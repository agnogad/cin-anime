const API_BASE = 'https://raw.githubusercontent.com/agnogad/tranime-api/refs/heads/main/data';
export const API_ANIMES = `${API_BASE}/animes.json`;
export const API_CATEGORIES = `${API_BASE}/categories.json`;
export const animeInfoUrl = (slug) => `${API_BASE}/anime/${slug}/info.json`;
export const animeEpisodesUrl = (slug) => `${API_BASE}/anime/${slug}/episodes.json`;

/**
 * Generic fetch helper with error handling.
 * Returns { data, error }
 */
export async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Normalize anime list from various response shapes.
 */
export function normalizeAnimes(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.animes) return Array.isArray(raw.animes) ? raw.animes : [];
  if (raw.data) return Array.isArray(raw.data) ? raw.data : [];
  return [];
}

/**
 * Normalize episodes list from various response shapes.
 */
export function normalizeEpisodes(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.episodes) return Array.isArray(raw.episodes) ? raw.episodes : [];
  if (raw.data) return Array.isArray(raw.data) ? raw.data : [];
  return [];
}
