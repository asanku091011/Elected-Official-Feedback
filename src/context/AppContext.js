// One place for saved messages and the message being written.
// Screens read and write through this context, so a draft survives moving
// between the writing screen and the preview screen.

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getTopic } from '../data/topics';
import { getRecipient } from '../data/recipients';
import { makeReference } from '../lib/format';
import { loadMessages, saveMessages } from '../lib/storage';

const AppContext = createContext(null);

const EMPTY_DRAFT = {
  topicId: null,
  recipientId: null,
  consended: false,
  message: '',
  zip: '',
  includeName: false,
  name: '',
};

export function AppProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const messagesRef = useRef([]);

  useEffect(() => {
    let active = true;
    loadMessages().then((result) => {
      if (!active) return;
      messagesRef.current = result.messages;
      setMessages(result.messages);
      setStorageOk(result.ok);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const startDraft = useCallback((topicId) => {
    setDraft({ ...EMPTY_DRAFT, topicId });
  }, []);

  const updateDraft = useCallback((patch) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_DRAFT);
  }, []);

  // Adds a message, saves the new list, and returns the saved record plus
  // whether it reached device storage. The recipient must be an ID from the
  // fixed sample list in data/recipients.js — a free-typed address is
  // rejected here, the same way a server would reject it.
  const addMessage = useCallback(
    async ({ topicId, recipientId, message, zip, includeName, name, jurisdictionId }) => {
      const topic = getTopic(topicId);
      const recipient = getRecipient(recipientId);
      if (!topic) return { ok: false, error: 'That issue is not available.' };
      if (!recipient) {
        return { ok: false, error: 'That recipient is not on the CivLink list, so nothing was sent.' };
      }
      const now = new Date().toISOString();
      const record = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        reference: makeReference(messagesRef.current.map((item) => item.reference)),
        topicId,
        level: topic.level,
        officeId: topic.officeId,
        areaId: jurisdictionId || null,
        recipientId: recipient.id,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        status: 'Sent',
        message: message.trim(),
        zip: zip.trim(),
        authorName: includeName ? name.trim() : '',
        createdAt: now,
      };

      const next = [record, ...messagesRef.current];
      messagesRef.current = next;
      setMessages(next);

      const saved = await saveMessages(next);
      setStorageOk(saved);
      return { ok: true, record, saved };
    },
    []
  );

  const deleteMessage = useCallback(async (id) => {
    const next = messagesRef.current.filter((item) => item.id !== id);
    messagesRef.current = next;
    setMessages(next);
    const saved = await saveMessages(next);
    setStorageOk(saved);
    return saved;
  }, []);

  const clearMessages = useCallback(async () => {
    messagesRef.current = [];
    setMessages([]);
    const saved = await saveMessages([]);
    setStorageOk(saved);
    return saved;
  }, []);

  return (
    <AppContext.Provider
      value={{
        ready,
        storageOk,
        messages,
        draft,
        startDraft,
        updateDraft,
        resetDraft,
        addMessage,
        deleteMessage,
        clearMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return value;
}
