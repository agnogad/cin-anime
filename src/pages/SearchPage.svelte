<script>
  import AnimeCard from '../components/AnimeCard.svelte';
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import { fetchJson, API_ANIMES, normalizeAnimes } from '../lib/api.js';
  import { router, currentPath } from '../lib/stores.js';

  let animes = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let localQuery = $state('');

  async function load() {
    loading = true;
    error = null;
    const { data, error: err } = await fetchJson(API_ANIMES);
    if (err) {
      error = err;
    } else {
      animes = normalizeAnimes(data);
    }
    loading = false;
  }

  $effect(() => { load(); });

  // Get query from hash
  let query = $state('');

  $effect(() => {
    const hash = window.location.hash;
    const qs = hash.split('?')[1] || '';
    const params = new URLSearchParams(qs);
    query = params.get('q') || '';
    localQuery = query;
  });

  const results = $derived.by(() => {
    if (!query || animes.length === 0) return [];
    const q = query.toLowerCase();
    return animes.filter(a => {
      const title = (a.title || a.Title || '').toLowerCase();
      const desc = (a.description || a.Description || '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (localQuery.trim()) {
      router.navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  }
</script>

<div class="p-4 md:p-8 animate-fade-in">
  <!-- Search Form -->
  <form onsubmit={handleSubmit} class="mb-8 max-w-xl">
    <div class="relative">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        bind:value={localQuery}
        placeholder="Search anime by title..."
        class="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-base text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
      />
    </div>
  </form>

  {#if loading}
    <div>
      <div class="skeleton h-6 w-48 mb-6"></div>
      <Skeleton variant="grid" count={8} />
    </div>
  {:else if error}
    <ErrorDisplay message={error} onretry={load} />
  {:else if query}
    <div class="flex items-center gap-3 mb-6">
      <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
      <h2 class="text-xl font-bold text-zinc-100">Results for "{query}"</h2>
      <span class="text-sm text-zinc-500 font-medium">({results.length})</span>
    </div>

    {#if results.length === 0}
      <EmptyState
        title='No results for "{query}"'
        description="Try a different search term or browse categories."
      />
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {#each results as anime, i}
          <AnimeCard {anime} index={i} />
        {/each}
      </div>
    {/if}
  {:else}
    <div class="py-16 text-center">
      <svg class="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <h3 class="text-lg font-semibold text-zinc-400 mb-2">Search Anime</h3>
      <p class="text-zinc-600 text-sm max-w-md mx-auto">
        Type in the search bar above to find your favorite anime by title or description.
      </p>
    </div>
  {/if}
</div>
