<script>
  import AnimeCard from '../components/AnimeCard.svelte';
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import { fetchJson, API_ANIMES, normalizeAnimes } from '../lib/api.js';
  import { currentPath } from '../lib/stores.js';

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

  // Extract category name from path
  let name = $state('');

  $effect(() => {
    const parts = window.location.hash.slice(1).split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'category') {
      name = parts[1];
    }
  });

  const filtered = $derived.by(() => {
    if (!name || animes.length === 0) return [];
    const catName = name.toLowerCase();
    return animes.filter(a => {
      const cats = a.categories || a.Categories || [];
      return Array.isArray(cats) && cats.some(c => c.toLowerCase() === catName);
    });
  });

  const displayName = $derived(name ? name.charAt(0).toUpperCase() + name.slice(1) : '');
</script>

<div class="p-4 md:p-8 animate-fade-in">
  {#if loading}
    <div class="skeleton h-8 w-48 mb-6"></div>
    <Skeleton variant="grid" count={8} />
  {:else if error}
    <ErrorDisplay message={error} onretry={load} />
  {:else}
    <div class="flex items-center gap-3 mb-6">
      <div class="w-1 h-7 bg-violet-500 rounded-full"></div>
      <h1 class="text-2xl md:text-3xl font-bold text-zinc-100">{displayName}</h1>
      <span class="text-sm text-zinc-500 font-medium">({filtered.length})</span>
    </div>

    {#if filtered.length === 0}
      <EmptyState
        title='"{displayName}" kategorisinde anime bulunamadı'
        description="Diğer kategorilere göz atın."
      />
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {#each filtered as anime, i}
          <AnimeCard {anime} index={i} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
