<script>
  import HeroBanner from '../components/HeroBanner.svelte';
  import AnimeCard from '../components/AnimeCard.svelte';
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import { fetchJson, API_ANIMES, normalizeAnimes, proxyImg } from '../lib/api.js';
  import { router } from '../lib/stores.js';
  import { getHistory } from '../lib/history.js';

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

  const watchHistory = $derived(getHistory().slice(0, 8));

  const subAnimes = $derived(animes.filter(a => {
    const types = a.types || [];
    return types.includes('sub');
  }));

  const dubAnimes = $derived(animes.filter(a => {
    const types = a.types || [];
    return types.includes('dub');
  }));

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
    <EmptyState title="Anime bulunamadı" description="Yeni bölümler için daha sonra tekrar kontrol edin!" />
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
            placeholder="Anime ara..."
            class="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          />
        </div>
      </form>

      <!-- Watch History -->
      {#if watchHistory.length > 0}
        <section>
          <div class="flex items-center justify-between gap-3 mb-5">
            <div class="flex items-center gap-3">
              <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
              <h2 class="text-xl md:text-2xl font-bold text-zinc-100">🕐 Kaldığın Yerden</h2>
            </div>
            <a href="#/recent" class="text-xs text-violet-400 hover:text-violet-300 transition-colors">Tümünü Gör</a>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory">
            {#each watchHistory as item}
              <a
                href="#/watch/{item.slug}/{item.episode}"
                class="flex-shrink-0 w-36 md:w-40 snap-start group"
              >
                <div class="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 relative shadow-lg shadow-black/30">
                  {#if item.cover}
                    <img src={proxyImg(item.cover)} alt={item.title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" onerror={(e) => e.target.style.display = 'none'} />
                  {/if}
                  <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent"></div>
                  <div class="absolute bottom-2 left-2 right-2">
                    <p class="text-xs font-semibold text-white truncate drop-shadow-lg">{item.title}</p>
                    <p class="text-[10px] text-zinc-300 mt-0.5">Bölüm {item.episode}</p>
                  </div>
                  <div class="absolute top-2 right-2 bg-violet-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    DEVAM
                  </div>
                </div>
              </a>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Trending Section -->
      {#if trending.length > 0}
        <section>
          <div class="flex items-center gap-3 mb-5">
            <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
            <h2 class="text-xl md:text-2xl font-bold text-zinc-100">🔥 Popülerler</h2>
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
            <h2 class="text-xl md:text-2xl font-bold text-zinc-100">Kategorilere Göz At</h2>
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
          <h2 class="text-xl md:text-2xl font-bold text-zinc-100">📺 Son Eklenenler</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {#each recent as anime, i}
            <AnimeCard {anime} index={i} />
          {/each}
        </div>
      </section>

      <!-- Sub Animes (tam liste) -->
      {#if subAnimes.length > 0}
        <section>
          <a href="#/category?type=sub" class="flex items-center gap-3 mb-5 group">
            <div class="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h2 class="text-xl md:text-2xl font-bold text-zinc-100 group-hover:text-blue-300 transition-colors">🎧 Altyazılı Animeler</h2>
            <span class="text-sm text-zinc-500 font-medium">({subAnimes.length})</span>
            <svg class="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {#each subAnimes as anime, i}
              <AnimeCard {anime} index={i} />
            {/each}
          </div>
        </section>
      {/if}

      <!-- Dub Animes (tam liste) -->
      {#if dubAnimes.length > 0}
        <section>
          <a href="#/category?type=dub" class="flex items-center gap-3 mb-5 group">
            <div class="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h2 class="text-xl md:text-2xl font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">🎙️ Dublaj Animeler</h2>
            <span class="text-sm text-zinc-500 font-medium">({dubAnimes.length})</span>
            <svg class="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {#each dubAnimes as anime, i}
              <AnimeCard {anime} index={i} />
            {/each}
          </div>
        </section>
      {/if}
    </div>
  </div>
{/if}
