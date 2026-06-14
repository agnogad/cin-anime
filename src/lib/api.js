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
 * Proxy image URL through images.weserv.nl for optimization and caching.
 * Falls back to original URL if proxy fails.
 * @param {string} url - Original image URL
 * @returns {string} Proxied URL or empty string if no URL
 */
export function proxyImg(url) {
  if (!url) return '';
  return `https://images.weserv.nl/v1/?url=${encodeURIComponent(url)}&l=9&maxage=1d&output=webp&filename=cover.png`;
}

/**
 * Handles image load error: replaces src with original URL.
 * Use as: onerror={(e) => onImgError(e, 'https://original.url')}
 */
export function onImgError(event, originalUrl) {
  if (originalUrl && event.target.src !== originalUrl) {
    event.target.src = originalUrl;
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
