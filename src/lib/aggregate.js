// Turns a list of saved messages into the numbers the dashboard shows.
// Kept as a plain function so it can be tested without rendering anything.

import { LEVELS } from '../data/offices.js';
import { getTopic } from '../data/topics.js';

export function newestFirst(messages) {
  return [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function summarize(messages = []) {
  const total = messages.length;
  const levelCounts = {};
  const topicCounts = {};

  messages.forEach((message) => {
    levelCounts[message.level] = (levelCounts[message.level] || 0) + 1;
    topicCounts[message.topicId] = (topicCounts[message.topicId] || 0) + 1;
  });

  const levels = LEVELS.map((level) => ({
    id: level.id,
    label: level.label,
    count: levelCounts[level.id] || 0,
    share: total ? Math.round(((levelCounts[level.id] || 0) / total) * 100) : 0,
  })).filter((level) => level.count > 0);

  const topics = Object.keys(topicCounts)
    .map((topicId) => {
      const topic = getTopic(topicId);
      return {
        id: topicId,
        title: topic ? topic.title : 'Other',
        icon: topic ? topic.icon : '📝',
        count: topicCounts[topicId],
        share: Math.round((topicCounts[topicId] / total) * 100),
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    total,
    levels,
    topics,
    topTopic: topics[0] || null,
    latest: newestFirst(messages)[0] || null,
  };
}
