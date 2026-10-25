// Poll rules and counting, kept as plain functions so they can be tested
// without rendering a screen.
//
// Sample data is always labeled. Seeded polls carry `isSample: true` and a
// `sampleResults` block; their counts are combined with the responses recorded
// on this device so the demo has something to draw, and every results screen
// says when sample numbers are included.
//
// Nobody can see who voted for what: a response stores only the poll, the
// chosen options, and a locality. There is no name or account on a vote.

import { getJurisdiction } from '../data/jurisdictions.js';
import { POLL_TYPES } from '../data/seedContent.js';

export const MIN_RESULTS_TO_SHOW = 5;
export const MAX_QUESTION_LENGTH = 160;
export const MIN_QUESTION_LENGTH = 12;
export const MAX_OPTIONS = 6;
export const MIN_OPTIONS = 2;

const DAY = 24 * 60 * 60 * 1000;

export const NEUTRALITY_CHECKS = [
  {
    id: 'service-not-campaign',
    label: 'The question asks about a public service, not about a person, party, or campaign.',
  },
  {
    id: 'balanced-options',
    label: 'Every option is worded neutrally, and no option is the “correct” answer.',
  },
  {
    id: 'real-choices',
    label: 'Each option is a realistic choice a resident could reasonably pick.',
  },
  {
    id: 'no-promises',
    label: 'The poll does not promise a decision or result the office cannot deliver.',
  },
];

export function pollStatusLabel(status) {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'scheduled':
      return 'Scheduled';
    case 'open':
      return 'Open';
    case 'closed':
      return 'Closed';
    default:
      return 'Draft';
  }
}

// Drafts stay drafts until published, and a closed poll cannot reopen on its
// own. Otherwise the dates decide.
export function pollPhase(poll, now = Date.now()) {
  if (!poll) return 'draft';
  if (poll.status === 'draft') return 'draft';
  if (poll.status === 'closed') return 'closed';
  const opens = new Date(poll.opensAt).getTime();
  const closes = new Date(poll.closesAt).getTime();
  if (Number.isNaN(opens) || Number.isNaN(closes)) return 'scheduled';
  if (now >= closes) return 'closed';
  if (now < opens) return 'scheduled';
  return 'open';
}

export function isPollOpen(poll, now = Date.now()) {
  return pollPhase(poll, now) === 'open';
}

// Residents see open polls and finished polls for their area. Drafts and polls
// that have not opened yet stay hidden.
export function isPollVisibleTo(poll, jurisdictionId, now = Date.now()) {
  const phase = pollPhase(poll, now);
  if (phase !== 'open' && phase !== 'closed') return false;
  return Array.isArray(poll.audience) && poll.audience.includes(jurisdictionId);
}

export function closesInLabel(poll, now = Date.now()) {
  if (!poll) return '';
  const closes = new Date(poll.closesAt).getTime();
  if (Number.isNaN(closes)) return '';
  const left = closes - now;
  if (left <= 0) return 'Closed';
  const days = Math.ceil(left / DAY);
  if (days <= 1) return 'Closes today';
  return `Closes in ${days} days`;
}

export function audienceLabel(poll) {
  if (!poll || !Array.isArray(poll.audience) || poll.audience.length === 0) return 'No area yet';
  const names = poll.audience.map((id) => {
    const item = getJurisdiction(id);
    return item ? item.short : id;
  });
  return names.join(', ');
}

export function pollTypeLabel(type) {
  const found = POLL_TYPES.find((item) => item.id === type);
  return found ? found.label : 'Pick one';
}

export function optionsForRating() {
  return [
    { id: '1', label: '1 - Very hard' },
    { id: '2', label: '2' },
    { id: '3', label: '3 - Neutral' },
    { id: '4', label: '4' },
    { id: '5', label: '5 - Very easy' },
  ];
}

// One function answers "has this device already responded?" so the feed, the
// poll screen, and the tests all agree.
export function findVote(votes, pollId) {
  return (votes || []).find((vote) => vote.pollId === pollId) || null;
}

export function canVote(poll, votes, now = Date.now()) {
  if (!poll) return { ok: false, reason: 'That poll is not available.' };
  if (pollPhase(poll, now) === 'closed') {
    return { ok: false, reason: 'This poll has closed and is showing final results.' };
  }
  if (pollPhase(poll, now) !== 'open') {
    return { ok: false, reason: 'This poll has not opened yet.' };
  }
  if (findVote(votes, poll.id)) {
    return { ok: false, reason: 'Your response is already recorded. One response per resident.' };
  }
  return { ok: true, reason: '' };
}

export function validateSelection(poll, optionIds = []) {
  if (!poll) return 'That poll is not available.';
  const valid = new Set((poll.options || []).map((option) => option.id));
  if (optionIds.length === 0) return 'Choose at least one option.';
  if (optionIds.some((id) => !valid.has(id))) return 'That choice is not part of this poll.';
  if (poll.type !== 'multiple' && optionIds.length > 1) {
    return 'This poll takes one answer. Choose a single option.';
  }
  return '';
}

// Combines sample counts with this device's recorded responses. Returns the
// same shape for every poll type.
export function tallyPoll(poll, votes = []) {
  if (!poll) {
    return {
      total: 0,
      options: [],
      jurisdictions: [],
      hasEnough: false,
      usingSampleData: false,
      localCount: 0,
    };
  }

  const pollVotes = (votes || []).filter((vote) => vote.pollId === poll.id);
  const sample = poll.isSample && poll.sampleResults ? poll.sampleResults : null;
  const optionCounts = {};
  const jurisdictionCounts = {};

  (poll.options || []).forEach((option) => {
    optionCounts[option.id] = sample && sample.byOption ? sample.byOption[option.id] || 0 : 0;
  });

  if (sample && sample.byJurisdiction) {
    Object.keys(sample.byJurisdiction).forEach((id) => {
      jurisdictionCounts[id] = (jurisdictionCounts[id] || 0) + sample.byJurisdiction[id];
    });
  }

  pollVotes.forEach((vote) => {
    (vote.optionIds || []).forEach((optionId) => {
      if (optionCounts[optionId] !== undefined) {
        optionCounts[optionId] += 1;
      }
    });
    if (vote.jurisdictionId) {
      jurisdictionCounts[vote.jurisdictionId] = (jurisdictionCounts[vote.jurisdictionId] || 0) + 1;
    }
  });

  const sampleTotal = sample ? Number(sample.total) || 0 : 0;
  const total = sampleTotal + pollVotes.length;

  const options = (poll.options || []).map((option) => ({
    id: option.id,
    label: option.label,
    count: optionCounts[option.id] || 0,
    share: total > 0 ? Math.round(((optionCounts[option.id] || 0) / total) * 100) : 0,
  }));

  const jurisdictions = Object.keys(jurisdictionCounts)
    .map((id) => {
      const item = getJurisdiction(id);
      return {
        id,
        label: item ? item.short : id,
        count: jurisdictionCounts[id],
        share: total > 0 ? Math.round((jurisdictionCounts[id] / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    total,
    options,
    jurisdictions,
    hasEnough: total >= MIN_RESULTS_TO_SHOW,
    usingSampleData: Boolean(sample && sampleTotal > 0),
    localCount: pollVotes.length,
  };
}

export function validatePoll(poll) {
  const errors = {};
  const question = String(poll.question || '').trim();
  if (question.length < MIN_QUESTION_LENGTH) {
    errors.question = `Write a question of at least ${MIN_QUESTION_LENGTH} characters.`;
  } else if (question.length > MAX_QUESTION_LENGTH) {
    errors.question = `Keep the question under ${MAX_QUESTION_LENGTH} characters.`;
  }

  const options = (poll.options || []).filter((option) => String(option.label || '').trim());
  if (options.length < MIN_OPTIONS) {
    errors.options = `Add at least ${MIN_OPTIONS} options.`;
  } else if (options.length > MAX_OPTIONS) {
    errors.options = `Use ${MAX_OPTIONS} options or fewer.`;
  } else {
    const labels = options.map((option) => option.label.trim().toLowerCase());
    if (new Set(labels).size !== labels.length) {
      errors.options = 'Two options have the same wording. Make them distinct.';
    }
  }

  if (!Array.isArray(poll.audience) || poll.audience.length === 0) {
    errors.audience = 'Choose at least one area that should receive this poll.';
  }

  const opens = new Date(poll.opensAt).getTime();
  const closes = new Date(poll.closesAt).getTime();
  if (Number.isNaN(opens) || Number.isNaN(closes)) {
    errors.dates = 'Add a valid opening and closing date.';
  } else if (closes <= opens) {
    errors.dates = 'The closing date needs to be after the opening date.';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

const CAMPAIGN_WORDS =
  /\b(elect|election|re-?elect|campaign|candidate|party|partisan|democrat|republican|ballot|vote for)\b/i;

// Automatic, explainable hints. They do not replace the human checklist; they
// point at wording an official should look at again before publishing.
export function pollWarnings(poll) {
  const warnings = [];
  const question = String(poll.question || '');
  if (question.includes('!')) {
    warnings.push('Remove the exclamation point so the question reads neutrally.');
  }
  if (CAMPAIGN_WORDS.test(question)) {
    warnings.push('This question uses campaign or election wording. Polls may not be used for campaign content.');
  }
  (poll.options || []).forEach((option) => {
    if (CAMPAIGN_WORDS.test(option.label || '')) {
      warnings.push(`The option “${option.label}” uses campaign or election wording.`);
    }
    if (String(option.label || '').trim().length > 90) {
      warnings.push(`Shorten the option “${option.label.slice(0, 40)}…” so it is easy to read.`);
    }
  });
  if ((poll.description || '').includes('!')) {
    warnings.push('Remove the exclamation point from the description.');
  }
  return warnings;
}

export function canPublish(poll, checklist = {}) {
  const reviewed = NEUTRALITY_CHECKS.every((item) => checklist[item.id] === true);
  return reviewed && validatePoll(poll).isValid;
}

export function emptyPollDraft(createdBy) {
  const now = new Date();
  const opens = new Date(now.getTime());
  const closes = new Date(now.getTime() + 14 * DAY);
  return {
    id: '',
    question: '',
    description: '',
    type: 'single',
    options: [
      { id: 'o1', label: '' },
      { id: 'o2', label: '' },
    ],
    audience: [],
    opensAt: opens.toISOString(),
    closesAt: closes.toISOString(),
    status: 'draft',
    createdBy,
    neutrality: {},
    isSample: false,
  };
}

// Date inputs use YYYY-MM-DD in the editor, so keep the conversion here.
export function toDateInput(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromDateInput(value, endOfDay = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return '';
  const date = new Date(`${value}T${endOfDay ? '23:59' : '00:00'}:00`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}
