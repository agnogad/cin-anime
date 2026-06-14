import { writable, derived } from 'svelte/store';

/**
 * Simple hash-based router store.
 * Reads/writes the window location hash.
 */
function createRouter() {
  const getPath = () => {
    const hash = window.location.hash.slice(1) || '/';
    return hash;
  };

  const { subscribe, set } = writable(getPath());

  const handleHashChange = () => {
    set(getPath());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', handleHashChange);
  }

  return {
    subscribe,
    /** Navigate to a path via hash */
    navigate(path) {
      window.location.hash = path;
    },
    /** Parse current path into segments */
    parse() {
      const path = getPath();
      const segments = path.split('/').filter(Boolean);
      return { path, segments };
    },
    destroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('hashchange', handleHashChange);
      }
    },
  };
}

export const router = createRouter();

/** Derived: current route path */
export const currentPath = derived(router, ($r) => $r);

/** Derived: route params extracted from path */
export const routeParams = derived(router, ($path) => {
  const parts = $path.split('/').filter(Boolean);
  const params = {};

  // Match routes
  if (parts.length >= 2 && parts[0] === 'anime') {
    params.slug = parts[1];
  } else if (parts.length >= 2 && parts[0] === 'watch') {
    params.slug = parts[1];
    params.episode = parts[2] ? Number(parts[2]) : 1;
  } else if (parts.length >= 2 && parts[0] === 'category') {
    params.name = parts[1];
  } else if (parts.length >= 1 && parts[0] === 'search') {
    const qs = $path.split('?')[1] || '';
    params.q = new URLSearchParams(qs).get('q') || '';
  }

  return params;
});
