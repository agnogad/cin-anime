<script>
  import HeroBanner from '../components/HeroBanner.svelte';
  import AnimeCard from '../components/AnimeCard.svelte';
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import { fetchJson, API_ANIMES, normalizeAnimes } from '../lib/api.js';
  import { router } from '../lib/stores.js';

  let animes = $state([]);
  let loading = $state(true);
  let error = $state(null);

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

  const featured = $derived(animes.filter(a => a.featured === true || a.Featured === true));
  const trending = $derived(animes.filter(a => a.trending === true || a.Trending === true));
  const recent = $derived(
    [...animes].sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || a.UpdatedAt || a.CreatedAt || '';
      const dateB = b.updatedAt || b.createdAt || b.UpdatedAt || b.CreatedAt || '';
      return dateB.localeCompare(dateA);
    }).slice(0, 10)
  );

  const animeCategories = $derived.by(() => {
    const cats = new Set();
    animes.forEach(a => {
      const c = a.categories || a.Categories || [];
      (Array.isArray(c) ? c : []).forEach(cat => cats.add(cat));
    });
    return Array.from(cats);
  });

  let searchQuery = $state('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }
</script>

{#if loading}
  <div class="p-4 md:p-8 space-y-8">
    <Skeleton variant="hero" />
    <div>
      <div class="skeleton h-7 w-40 mb-5"></div>
      <Skeleton variant="grid" count={5} />
    </div>
    <div>
      <div class="skeleton h-7 w-40 mb-5"></div>
      <Skeleton variant="grid" count={6} />
    </div>
  </div>
{:else if error}
  <div class="p-4 md:p-8">
    <ErrorDisplay message={error} onretry={load} />
  </div>
{:else if animes.length === 0}
  <div class="p-4 md:p-8">
    <EmptyState title="No anime found" description="Check back later for new releases!" />
  </div>
{:else}
  <div class="animate-fade-in">
    {#if featured.length > 0}
      <HeroBanner anime={featured[0]} />
    {/if}

    <div class="px-4 md:px-8 space-y-10 pb-8">
      <!-- Search Bar (Mobile) -->
      <form onsubmit={handleSearch} class="md:hidden">
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search anime..."
            class="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          />
        </div>
      </form>

      <!-- Trending Section -->
      {#if trending.length > 0}
        <section>
          <div class="flex items-center gap-3 mb-5">
            <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
            <h2 class="text-xl md:text-2xl font-bold text-zinc-100">🔥 Trending Now</h2>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory">
            {#each trending as anime, i}
              <div class="flex-shrink-0 w-44 md:w-48 snap-start">
                <AnimeCard {anime} index={i} />
              </div>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Category Chips -->
      {#if animeCategories.length > 0}
        <section>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
            <h2 class="text-xl md:text-2xl font-bold text-zinc-100">Browse Categories</h2>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each animeCategories as cat}
              <a
                href="#/category/{cat}"
                class="px-4 py-2 bg-zinc-900/80 border border-zinc-800/60 hover:border-violet-600/40 hover:bg-zinc-800/80 rounded-xl text-sm text-zinc-400 hover:text-violet-300 transition-all"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </a>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Latest Releases -->
      <section>
        <div class="flex items-center gap-3 mb-5">
          <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-bold text-zinc-100">📺 Latest Releases</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {#each recent as anime, i}
            <AnimeCard {anime} index={i} />
          {/each}
        </div>
      </section>

      <!-- All Anime -->
      <section>
        <div class="flex items-center gap-3 mb-5">
          <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-bold text-zinc-100">📂 All Anime</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {#each animes as anime, i}
            <AnimeCard {anime} index={i} />
          {/each}
        </div>
      </section>
    </div>
  </div>
{/if}
