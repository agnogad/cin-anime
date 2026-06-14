<script>
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import { fetchJson, API_ANIMES, normalizeAnimes } from '../lib/api.js';

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

  const categories = $derived.by(() => {
    const cats = new Set();
    animes.forEach(a => {
      const c = a.categories || a.Categories || [];
      (Array.isArray(c) ? c : []).forEach(cat => cats.add(cat));
    });
    return Array.from(cats).sort();
  });
</script>

<div class="p-4 md:p-8 animate-fade-in">
  {#if loading}
    <div class="skeleton h-8 w-48 mb-6"></div>
    <div class="flex flex-wrap gap-3">
      {#each Array(10) as _, i}
        <div key={i} class="skeleton h-10 w-28 rounded-xl"></div>
      {/each}
    </div>
  {:else if error}
    <ErrorDisplay message={error} onretry={load} />
  {:else}
    <div class="flex items-center gap-3 mb-6">
      <div class="w-1 h-7 bg-violet-500 rounded-full"></div>
      <h1 class="text-2xl md:text-3xl font-bold text-zinc-100">Categories</h1>
    </div>

    {#if categories.length === 0}
      <EmptyState title="No categories found" />
    {:else}
      <div class="flex flex-wrap gap-3">
        {#each categories as cat}
          <a
            href="#/category/{cat}"
            class="px-5 py-3 bg-zinc-900/80 border border-zinc-800/60 hover:border-violet-600/40 hover:bg-zinc-800/80 rounded-xl text-sm font-medium text-zinc-400 hover:text-violet-300 transition-all"
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </a>
        {/each}
      </div>
    {/if}
  {/if}
</div>
