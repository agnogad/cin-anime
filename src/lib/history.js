/**
 * Watch history store backed by localStorage.
 * Saves anime info + last watched episode + timestamp.
 */

const STORAGE_KEY = 'cin-anime-history';
const MAX_ITEMS = 30;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Add/update an entry in the watch history.
 * @param {object} entry - { slug, title, cover, episode, episodeNum, timestamp }
 */
export function addToHistory(entry) {
  const items = loadHistory();
  const idx = items.findIndex(i => i.slug === entry.slug);
  const newEntry = {
    ...entry,
    timestamp: Date.now(),
  };
  if (idx >= 0) {
    items[idx] = newEntry;
    // Move to front
    const [moved] = items.splice(idx, 1);
    items.unshift(moved);
  } else {
    items.unshift(newEntry);
    if (items.length > MAX_ITEMS) items.pop();
  }
  saveHistory(items);
}

/**
 * Get all history entries, newest first.
 */
export function getHistory() {
  return loadHistory();
}

/**
 * Clear all history.
 */
export function clearHistory() {
  saveHistory([]);
}

/**
 * Remove a single entry by slug.
 */
export function removeFromHistory(slug) {
  const items = loadHistory().filter(i => i.slug !== slug);
  saveHistory(items);
}
