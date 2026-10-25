// Shared state for the civic prototype: who is signed in, which area the
// resident picked, the polls and announcements, responses, and the sample
// official accounts.
//
// Everything is stored on this device. There is no server and no real
// authentication, which is why the portal labels itself a prototype and only
// ships sample organizations. The shape here is close to what a real backend
// would return, so the demo shows the intended flow without pretending to be
// connected to a government office.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SAMPLE_ACCOUNTS, SAMPLE_ORG, isGovEmail } from '../data/accounts';
import { CATEGORIES, seedCivicData } from '../data/seedContent';
import { JURISDICTIONS, getJurisdiction } from '../data/jurisdictions';
import {
  canPublish,
  canVote,
  pollPhase,
  tallyPoll,
  validatePoll,
  validateSelection,
} from '../lib/polls';
import { containsThreats, findBlockedWords, rateLimitOk } from '../lib/moderation';
import { loadCivicState, saveCivicState } from '../lib/storage';

const CivicContext = createContext(null);

const CATEGORY_IDS = CATEGORIES.map((item) => item.id);

export const DEFAULT_NOTIFICATION_PREFS = {
  categories: CATEGORY_IDS.reduce((map, id) => ({ ...map, [id]: true }), {}),
  jurisdictions: JURISDICTIONS.reduce((map, item) => ({ ...map, [item.id]: true }), {}),
  muted: false,
};

function freshState() {
  const seed = seedCivicData();
  return {
    sessionAccountId: null,
    accounts: JSON.parse(JSON.stringify(SAMPLE_ACCOUNTS)),
    accessRequests: [],
    jurisdictionId: 'loudoun',
    votes: [],
    polls: seed.polls,
    announcements: seed.announcements,
    questions: seed.questions,
    reports: [],
    notificationPrefs: JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_PREFS)),
    seen: { announcements: [], polls: [] },
    auditLog: [],
    civicStorageOk: true,
  };
}

function mergePrefs(saved = {}) {
  return {
    categories: { ...DEFAULT_NOTIFICATION_PREFS.categories, ...(saved.categories || {}) },
    jurisdictions: {
      ...DEFAULT_NOTIFICATION_PREFS.jurisdictions,
      ...(saved.jurisdictions || {}),
    },
    muted: saved.muted === true,
  };
}

// Old or partial saved state should fill in the missing pieces instead of
// crashing a screen.
function hydrate(saved) {
  const base = freshState();
  if (!saved || typeof saved !== 'object') return base;
  return {
    ...base,
    ...saved,
    accounts: Array.isArray(saved.accounts) && saved.accounts.length ? saved.accounts : base.accounts,
    polls: Array.isArray(saved.polls) ? saved.polls : base.polls,
    announcements: Array.isArray(saved.announcements) ? saved.announcements : base.announcements,
    questions: Array.isArray(saved.questions) ? saved.questions : base.questions,
    votes: Array.isArray(saved.votes) ? saved.votes : [],
    reports: Array.isArray(saved.reports) ? saved.reports : [],
    accessRequests: Array.isArray(saved.accessRequests) ? saved.accessRequests : [],
    notificationPrefs: mergePrefs(saved.notificationPrefs),
    seen: {
      announcements: Array.isArray(saved.seen && saved.seen.announcements) ? saved.seen.announcements : [],
      polls: Array.isArray(saved.seen && saved.seen.polls) ? saved.seen.polls : [],
    },
    auditLog: Array.isArray(saved.auditLog) ? saved.auditLog : [],
    jurisdictionId: getJurisdiction(saved.jurisdictionId) ? saved.jurisdictionId : 'loudoun',
    civicStorageOk: true,
  };
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function withAudit(state, actor, action, target) {
  const entry = {
    id: makeId('log'),
    actor: actor || 'Sample account',
    action,
    target: target || '',
    at: new Date().toISOString(),
  };
  return [entry, ...(state.auditLog || [])].slice(0, 100);
}

function upsert(list, record) {
  const index = list.findIndex((item) => item.id === record.id);
  if (index === -1) return [record, ...list];
  const next = [...list];
  next[index] = record;
  return next;
}

export function CivicProvider({ children }) {
  const [state, setState] = useState(freshState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;
    loadCivicState().then((result) => {
      if (!active) return;
      setState((current) => {
        const next = hydrate(result.state || current);
        stateRef.current = next;
        return next;
      });
      if (!result.ok) {
        setState((current) => ({ ...current, civicStorageOk: false }));
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    stateRef.current = state;
    if (!ready) return;
    let active = true;
    savingRef.current = true;
    saveCivicState(state)
      .then((ok) => {
        if (!active) return;
        if (!ok) {
          setState((current) =>
            current.civicStorageOk ? { ...current, civicStorageOk: false } : current
          );
        }
      })
      .finally(() => {
        savingRef.current = false;
      });
    return () => {
      active = false;
    };
  }, [state, ready]);

  // Apply the change to the ref before scheduling the render. Several actions
  // are followed immediately by another action (save a draft, then publish it),
  // and they need to see the record that was just written.
  const update = useCallback((updater) => {
    const current = stateRef.current;
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    stateRef.current = next;
    setState(next);
  }, []);

  const account = useMemo(
    () => state.accounts.find((item) => item.id === state.sessionAccountId) || null,
    [state.accounts, state.sessionAccountId]
  );
  const role = account ? account.role : 'resident';
  const admin = useMemo(() => state.accounts.find((item) => item.role === 'admin') || null, [state.accounts]);
  const actorName = account ? account.displayName : 'Resident';

  const jurisdiction = getJurisdiction(state.jurisdictionId) || JURISDICTIONS[0];

  const prefs = state.notificationPrefs;

  const feedItems = useMemo(() => {
    const now = Date.now();
    const area = state.jurisdictionId;

    const announcements = state.announcements
      .filter((item) => {
        if (item.status !== 'published') return false;
        if (new Date(item.publishAt || 0).getTime() > now) return false;
        if (!Array.isArray(item.audience) || !item.audience.includes(area)) return false;
        if (!prefs.categories[item.category]) return false;
        if (!prefs.jurisdictions[area]) return false;
        return true;
      })
      .map((item) => ({ type: 'announcement', at: item.publishAt, item }));

    const polls = state.polls
      .filter((item) => {
        const phase = pollPhase(item, now);
        if (phase !== 'open' && phase !== 'closed') return false;
        if (!Array.isArray(item.audience) || !item.audience.includes(area)) return false;
        if (!prefs.jurisdictions[area]) return false;
        return true;
      })
      .map((item) => ({ type: 'poll', at: item.opensAt, item }));

    return [...announcements, ...polls].sort(
      (a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime()
    );
  }, [state.announcements, state.polls, state.jurisdictionId, prefs]);

  const unreadCount = useMemo(() => {
    if (prefs.muted) return 0;
    return feedItems.filter((entry) => {
      const seen = entry.type === 'poll' ? state.seen.polls : state.seen.announcements;
      return !seen.includes(entry.item.id);
    }).length;
  }, [feedItems, prefs.muted, state.seen]);

  const openPolls = useMemo(
    () => state.polls.filter((item) => pollPhase(item) === 'open'),
    [state.polls]
  );
  const unreadQuestions = useMemo(
    () => state.questions.filter((item) => item.status === 'new').length,
    [state.questions]
  );
  const scheduledPosts = useMemo(
    () =>
      state.announcements.filter((item) => item.status === 'scheduled').length +
      state.polls.filter((item) => pollPhase(item) === 'scheduled').length,
    [state.announcements, state.polls]
  );
  const totalResponses = useMemo(
    () => state.polls.reduce((sum, poll) => sum + tallyPoll(poll, state.votes).total, 0),
    [state.polls, state.votes]
  );

  const signIn = useCallback(
    (accountId) => {
      const found = stateRef.current.accounts.find((item) => item.id === accountId);
      if (!found) return { ok: false, error: 'That demo account is not available.' };
      update((current) => ({
        ...current,
        sessionAccountId: found.id,
        auditLog: withAudit(current, found.displayName, 'signed in to the Official Portal', found.orgName),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const signOut = useCallback(() => {
    update((current) => ({ ...current, sessionAccountId: null }));
  }, [update]);

  const requestAccess = useCallback(
    ({ orgName, email, note = '' }) => {
      const name = String(orgName || '').trim();
      const mail = String(email || '').trim();
      if (name.length < 3) return { ok: false, error: 'Add the name of the office or organization.' };
      if (!isGovEmail(mail)) {
        return {
          ok: false,
          error: 'Use a .gov email address. In a real rollout the address would still need manual verification.',
        };
      }
      update((current) => ({
        ...current,
        accessRequests: [
          {
            id: makeId('req'),
            orgName: name,
            email: mail,
            note: String(note || '').trim(),
            jurisdictionId: current.jurisdictionId,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          ...current.accessRequests,
        ],
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const approveAccess = useCallback(
    (requestId) => {
      const current = stateRef.current;
      if (!current.sessionAccountId) return { ok: false, error: 'Sign in as an administrator first.' };
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn || signedIn.role !== 'admin') {
        return { ok: false, error: 'Only an administrator can approve an account.' };
      }
      const request = current.accessRequests.find((item) => item.id === requestId);
      if (!request) return { ok: false, error: 'That request is no longer available.' };
      const newAccount = {
        id: makeId('acct'),
        role: 'official',
        displayName: `${request.orgName} staff (demo)`,
        orgName: request.orgName,
        orgId: makeId('org'),
        email: request.email,
        verified: true,
        isSample: false,
        createdAt: new Date().toISOString(),
      };
      update((stateNow) => ({
        ...stateNow,
        accounts: [...stateNow.accounts, newAccount],
        accessRequests: stateNow.accessRequests.map((item) =>
          item.id === requestId ? { ...item, status: 'approved', decidedAt: new Date().toISOString() } : item
        ),
        auditLog: withAudit(stateNow, signedIn.displayName, 'approved an official account', request.orgName),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const denyAccess = useCallback(
    (requestId) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn || signedIn.role !== 'admin') {
        return { ok: false, error: 'Only an administrator can deny an account.' };
      }
      update((stateNow) => ({
        ...stateNow,
        accessRequests: stateNow.accessRequests.map((item) =>
          item.id === requestId ? { ...item, status: 'denied', decidedAt: new Date().toISOString() } : item
        ),
        auditLog: withAudit(stateNow, signedIn.displayName, 'denied an access request', requestId),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const selectJurisdiction = useCallback(
    (id) => {
      if (!getJurisdiction(id)) return;
      update((current) => ({ ...current, jurisdictionId: id }));
    },
    [update]
  );

  const markSeen = useCallback(
    (type, id) => {
      if (type !== 'poll' && type !== 'announcement') return;
      update((current) => {
        const key = type === 'poll' ? 'polls' : 'announcements';
        if (current.seen[key].includes(id)) return current;
        return { ...current, seen: { ...current.seen, [key]: [...current.seen[key], id] } };
      });
    },
    [update]
  );

  const markAllSeen = useCallback(() => {
    update((current) => {
      const pollIds = current.polls.map((item) => item.id);
      const announcementIds = current.announcements.map((item) => item.id);
      return {
        ...current,
        seen: { polls: pollIds, announcements: announcementIds },
      };
    });
  }, [update]);

  const vote = useCallback(
    (pollId, optionIds) => {
      const current = stateRef.current;
      const poll = current.polls.find((item) => item.id === pollId);
      const eligibility = canVote(poll, current.votes);
      if (!eligibility.ok) return { ok: false, error: eligibility.reason };
      const selectionError = validateSelection(poll, optionIds);
      if (selectionError) return { ok: false, error: selectionError };
      update((stateNow) => ({
        ...stateNow,
        votes: [
          ...stateNow.votes,
          {
            id: makeId('vote'),
            pollId,
            optionIds,
            jurisdictionId: stateNow.jurisdictionId,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const savePoll = useCallback(
    (draft) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      const record = {
        ...draft,
        id: draft.id || makeId('poll'),
        createdBy: signedIn.id,
        status: draft.status === 'draft' || !draft.status ? 'draft' : draft.status,
        updatedAt: new Date().toISOString(),
      };
      update((stateNow) => ({
        ...stateNow,
        polls: upsert(stateNow.polls, record),
        auditLog: withAudit(
          stateNow,
          signedIn.displayName,
          draft.id ? 'edited a poll' : 'created a poll draft',
          record.question
        ),
      }));
      return { ok: true, error: '', id: record.id };
    },
    [update]
  );

  const publishPoll = useCallback(
    (pollId) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      const poll = current.polls.find((item) => item.id === pollId);
      if (!poll) return { ok: false, error: 'That poll is not available.' };
      // A closed poll keeps its final results. Reopening it would change what
      // residents already saw, so the office has to publish a new poll.
      if (poll.status === 'closed' || pollPhase(poll) === 'closed') {
        return { ok: false, error: 'A closed poll cannot be reopened. Create a new poll instead.' };
      }

      const check = validatePoll(poll);
      if (!check.isValid) {
        return { ok: false, error: Object.values(check.errors)[0] };
      }
      if (!canPublish(poll, poll.neutrality || {})) {
        return { ok: false, error: 'Complete the neutrality checklist before publishing.' };
      }

      const opens = new Date(poll.opensAt).getTime();
      const status = opens > Date.now() ? 'scheduled' : 'open';
      update((stateNow) => ({
        ...stateNow,
        polls: stateNow.polls.map((item) =>
          item.id === pollId ? { ...item, status, publishedAt: new Date().toISOString() } : item
        ),
        auditLog: withAudit(stateNow, signedIn.displayName, `published a poll (${status})`, poll.question),
      }));
      return { ok: true, error: '', status };
    },
    [update]
  );

  const closePoll = useCallback(
    (pollId) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      update((stateNow) => ({
        ...stateNow,
        polls: stateNow.polls.map((item) =>
          item.id === pollId ? { ...item, status: 'closed', closedAt: new Date().toISOString() } : item
        ),
        auditLog: withAudit(
          stateNow,
          signedIn.displayName,
          'closed a poll',
          (current.polls.find((item) => item.id === pollId) || {}).question
        ),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const deletePoll = useCallback(
    (pollId) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      const poll = current.polls.find((item) => item.id === pollId);
      if (!poll) return { ok: false, error: 'That poll is not available.' };
      if (poll.status !== 'draft') {
        return { ok: false, error: 'Only a draft can be deleted. Close a published poll instead.' };
      }
      update((stateNow) => ({
        ...stateNow,
        polls: stateNow.polls.filter((item) => item.id !== pollId),
        auditLog: withAudit(stateNow, signedIn.displayName, 'deleted a poll draft', poll.question),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const saveAnnouncement = useCallback(
    (draft) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      const record = {
        ...draft,
        id: draft.id || makeId('ann'),
        createdBy: signedIn.id,
        // Editing keeps whatever state the announcement already has. Publishing
        // and archiving have their own actions and audit entries.
        status: draft.status || 'draft',
        updatedAt: new Date().toISOString(),
      };
      update((stateNow) => ({
        ...stateNow,
        announcements: upsert(stateNow.announcements, record),
        auditLog: withAudit(
          stateNow,
          signedIn.displayName,
          draft.id ? 'edited an announcement' : 'created an announcement draft',
          record.title
        ),
      }));
      return { ok: true, error: '', id: record.id };
    },
    [update]
  );

  const publishAnnouncement = useCallback(
    (announcementId) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      const announcement = current.announcements.find((item) => item.id === announcementId);
      if (!announcement) return { ok: false, error: 'That announcement is not available.' };
      if (String(announcement.title || '').trim().length < 6) {
        return { ok: false, error: 'Add a title before publishing.' };
      }
      if (String(announcement.body || '').trim().length < 20) {
        return { ok: false, error: 'Add a little more detail before publishing.' };
      }
      if (!Array.isArray(announcement.audience) || announcement.audience.length === 0) {
        return { ok: false, error: 'Choose at least one area before publishing.' };
      }
      const publishAt = announcement.publishAt || new Date().toISOString();
      const status = new Date(publishAt).getTime() > Date.now() ? 'scheduled' : 'published';
      update((stateNow) => ({
        ...stateNow,
        announcements: stateNow.announcements.map((item) =>
          item.id === announcementId
            ? { ...item, status, publishAt, publishedAt: new Date().toISOString() }
            : item
        ),
        auditLog: withAudit(stateNow, signedIn.displayName, `published an announcement (${status})`, announcement.title),
      }));
      return { ok: true, error: '', status };
    },
    [update]
  );

  const archiveAnnouncement = useCallback(
    (announcementId) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      update((stateNow) => ({
        ...stateNow,
        announcements: stateNow.announcements.map((item) =>
          item.id === announcementId ? { ...item, status: 'archived' } : item
        ),
        auditLog: withAudit(
          stateNow,
          signedIn.displayName,
          'archived an announcement',
          (current.announcements.find((item) => item.id === announcementId) || {}).title
        ),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const askQuestion = useCallback(
    ({ body, category }) => {
      const text = String(body || '').trim();
      if (text.length < 20) return { ok: false, error: 'Add a little more detail so staff can help.' };
      if (text.length > 600) return { ok: false, error: 'Keep your question under 600 characters.' };
      if (containsThreats(text)) {
        return { ok: false, error: 'Threats are not feedback and can be illegal. Rewrite your question without them.' };
      }
      if (findBlockedWords(text).length > 0) {
        return { ok: false, error: 'Remove the insulting language and ask your question again.' };
      }
      const mine = stateRef.current.questions.filter((item) => item.isMine);
      if (!rateLimitOk(mine.map((item) => item.createdAt), 3, 10 * 60 * 1000)) {
        return { ok: false, error: 'You have asked several questions in a short time. Try again in a few minutes.' };
      }
      update((current) => ({
        ...current,
        questions: [
          {
            id: makeId('q'),
            jurisdictionId: current.jurisdictionId,
            category: category || 'general',
            body: text,
            authorLabel: 'You',
            createdAt: new Date().toISOString(),
            status: 'new',
            reply: null,
            isMine: true,
            isSample: false,
          },
          ...current.questions,
        ],
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const replyQuestion = useCallback(
    (questionId, { reply, isPublic }) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      const text = String(reply || '').trim();
      if (text.length < 10) return { ok: false, error: 'Write a reply of at least 10 characters.' };
      update((stateNow) => ({
        ...stateNow,
        questions: stateNow.questions.map((item) =>
          item.id === questionId
            ? {
                ...item,
                status: 'replied',
                reply: {
                  body: text,
                  isPublic: isPublic !== false,
                  repliedAt: new Date().toISOString(),
                  repliedBy: signedIn.id,
                },
              }
            : item
        ),
        auditLog: withAudit(stateNow, signedIn.displayName, 'replied to a resident question', questionId),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const resolveQuestion = useCallback(
    (questionId) => {
      const current = stateRef.current;
      const signedIn = current.accounts.find((item) => item.id === current.sessionAccountId);
      if (!signedIn) return { ok: false, error: 'Sign in to the Official Portal first.' };
      update((stateNow) => ({
        ...stateNow,
        questions: stateNow.questions.map((item) =>
          item.id === questionId ? { ...item, status: 'resolved' } : item
        ),
        auditLog: withAudit(stateNow, signedIn.displayName, 'marked a question resolved', questionId),
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const reportContent = useCallback(
    ({ targetType, targetId, reason }) => {
      const exists = stateRef.current.reports.some(
        (item) => item.targetType === targetType && item.targetId === targetId
      );
      if (exists) return { ok: true, error: '' };
      update((current) => ({
        ...current,
        reports: [
          {
            id: makeId('report'),
            targetType,
            targetId,
            reason: reason || 'other',
            createdAt: new Date().toISOString(),
          },
          ...current.reports,
        ],
      }));
      return { ok: true, error: '' };
    },
    [update]
  );

  const setNotificationPrefs = useCallback(
    (patch) => {
      update((current) => ({
        ...current,
        notificationPrefs: mergePrefs({
          ...current.notificationPrefs,
          ...patch,
          categories: { ...current.notificationPrefs.categories, ...(patch.categories || {}) },
          jurisdictions: {
            ...current.notificationPrefs.jurisdictions,
            ...(patch.jurisdictions || {}),
          },
        }),
      }));
    },
    [update]
  );

  // Restores the seeded demo content. Saved messages are separate and stay put.
  const resetDemoData = useCallback(() => {
    const seed = seedCivicData();
    update((current) => ({
      ...current,
      sessionAccountId: null,
      accounts: JSON.parse(JSON.stringify(SAMPLE_ACCOUNTS)),
      accessRequests: [],
      votes: [],
      polls: seed.polls,
      announcements: seed.announcements,
      questions: seed.questions,
      reports: [],
      seen: { announcements: [], polls: [] },
      auditLog: withAudit(current, 'Demo reset', 'reset the sample portal data', SAMPLE_ORG.name),
    }));
  }, [update]);

  const value = useMemo(
    () => ({
      ready,
      civicStorageOk: state.civicStorageOk,
      account,
      admin,
      role,
      actorName,
      accounts: state.accounts,
      accessRequests: state.accessRequests,
      state,
      jurisdiction,
      jurisdictionId: state.jurisdictionId,
      polls: state.polls,
      announcements: state.announcements,
      questions: state.questions,
      votes: state.votes,
      reports: state.reports,
      auditLog: state.auditLog,
      notificationPrefs: prefs,
      seen: state.seen,
      feedItems,
      unreadCount,
      openPolls,
      unreadQuestions,
      scheduledPosts,
      totalResponses,
      signIn,
      signOut,
      requestAccess,
      approveAccess,
      denyAccess,
      selectJurisdiction,
      markSeen,
      markAllSeen,
      vote,
      savePoll,
      publishPoll,
      closePoll,
      deletePoll,
      saveAnnouncement,
      publishAnnouncement,
      archiveAnnouncement,
      askQuestion,
      replyQuestion,
      resolveQuestion,
      reportContent,
      setNotificationPrefs,
      resetDemoData,
      tallyPoll,
    }),
    [
      ready,
      state,
      account,
      admin,
      role,
      actorName,
      jurisdiction,
      prefs,
      feedItems,
      unreadCount,
      openPolls,
      unreadQuestions,
      scheduledPosts,
      totalResponses,
      signIn,
      signOut,
      requestAccess,
      approveAccess,
      denyAccess,
      selectJurisdiction,
      markSeen,
      markAllSeen,
      vote,
      savePoll,
      publishPoll,
      closePoll,
      deletePoll,
      saveAnnouncement,
      publishAnnouncement,
      archiveAnnouncement,
      askQuestion,
      replyQuestion,
      resolveQuestion,
      reportContent,
      setNotificationPrefs,
      resetDemoData,
    ]
  );

  return <CivicContext.Provider value={value}>{children}</CivicContext.Provider>;
}

export function useCivic() {
  const value = useContext(CivicContext);
  if (!value) {
    throw new Error('useCivic must be used inside CivicProvider');
  }
  return value;
}
