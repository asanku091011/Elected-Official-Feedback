// The CSV export contains aggregated numbers only. It never includes a
// resident's identity, because CivLink never records one on a vote.

function escapeCell(value) {
  const text = String(value == null ? '' : value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(rows = []) {
  return rows.map((row) => row.map(escapeCell).join(',')).join('\n');
}

// Builds the file for one poll: totals by option, then turnout by locality.
export function pollResultsCsv(poll, tally, exportedAt) {
  const rows = [
    ['CivLink poll results'],
    ['Poll', poll.question],
    ['Type', poll.type],
    ['Areas', (poll.audience || []).join(' | ')],
    ['Status', poll.status],
    ['Total responses', tally.total],
    ['Includes sample data', poll.isSample ? 'yes - sample numbers plus this device' : 'no'],
    ['Exported at', exportedAt],
    [],
    ['Option', 'Responses', 'Percent of respondents'],
    ...tally.options.map((option) => [option.label, option.count, option.share]),
    [],
    ['Locality', 'Responses', 'Percent of responses'],
    ...tally.jurisdictions.map((item) => [item.label, item.count, item.share]),
  ];
  return toCsv(rows);
}

export function csvFileName(poll, exportedAt) {
  const stamp = String(exportedAt).slice(0, 10);
  const slug = String(poll.question || 'poll')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `civlink-${slug || 'poll'}-${stamp}.csv`;
}
