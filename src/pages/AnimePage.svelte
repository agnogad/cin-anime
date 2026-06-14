<script>
  import StatusBadge from '../components/StatusBadge.svelte';
  import RatingBadge from '../components/RatingBadge.svelte';
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import { fetchJson, animeInfoUrl, animeEpisodesUrl, normalizeEpisodes, proxyImg } from '../lib/api.js';
  import { router, currentPath } from '../lib/stores.js';

  let info = $state(null);
  let episodes = $state([]);
  let infoLoading = $state(true);
  let epLoading = $state(true);
  let infoError = $state(null);
  let epError = $state(null);

  let slug = $state('');

  $effect(() => {
    const parts = window.location.hash.slice(1).split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'anime') {
      slug = parts[1];
    }
  });

  async function loadInfo() {
    if (!slug) return;
    infoLoading = true;
    infoError = null;
    const { data, error } = await fetchJson(animeInfoUrl(slug));
    if (error) {
      infoError = error;
    } else {
      info = data;
    }
    infoLoading = false;
  }

  async function loadEpisodes() {
    if (!slug) return;
    epLoading = true;
    epError = null;
    const { data, error } = await fetchJson(animeEpisodesUrl(slug));
    if (error) {
      epError = error;
    } else {
      episodes = normalizeEpisodes(data);
    }
    epLoading = false;
  }

  $effect(() => {
    if (slug) {
      loadInfo();
      loadEpisodes();
    }
  });

  const title = $derived(info?.title || info?.Title || 'Bilinmiyor');
  const description = $derived(info?.description || info?.Description || '');
  const year = $derived(info?.year || info?.Year || '');
  const status = $derived((info?.status || info?.Status || 'ongoing').toLowerCase());
  const rating = $derived(info?.rating ?? info?.Rating ?? 0);
  const cover = $derived(info?.cover || info?.Cover || info?.poster || info?.Poster || '');
  const categories = $derived(info?.categories || info?.Categories || []);
  const types = $derived(info?.types || []);

  let coverError = $state(false);
  let bannerError = $state(false);

  function startWatching() {
    if (episodes.length > 0) {
      router.navigate(`/watch/${slug}/${episodes[0].episode}`);
    }
  }
</script>

<div class="animate-fade-in">
  {#if infoLoading}
    <div class="p-4 md:p-8">
      <Skeleton variant="detail" />
    </div>
  {:else if infoError}
    <div class="p-4 md:p-8">
      <ErrorDisplay message={infoError} onretry={loadInfo} />
    </div>
  {:else if !info}
    <div class="p-4 md:p-8">
      <EmptyState title="Anime not found" description="This anime might not exist or the data is unavailable." />
    </div>
  {:else}
    <!-- Banner background -->
    {#if info.banner && !bannerError}
      <div class="relative h-48 md:h-64 overflow-hidden">
        <img src={proxyImg(info.banner)} alt="" class="w-full h-full object-cover" onerror={() => bannerError = true} />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
      </div>
    {/if}

    <div class="px-4 md:px-8 -mt-16 md:-mt-24 relative z-10">
      <div class="flex flex-col md:flex-row gap-6 md:gap-8">
        <!-- Poster -->
        <div class="w-40 md:w-64 flex-shrink-0 mx-auto md:mx-0">
          <div class="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 shadow-xl shadow-black/40 border border-zinc-800/60">
            {#if cover && !coverError}
              <img src={proxyImg(cover)} alt={title} class="w-full h-full object-cover" onerror={() => coverError = true} />
            {:else}
              <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                <svg class="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            {/if}
          </div>

          <!-- Watch button (mobile) -->
          <button
            onclick={startWatching}
            disabled={episodes.length === 0}
            class="md:hidden w-full mt-4 py-3 {episodes.length === 0 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-500 text-white'} rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            {episodes.length > 0 ? 'İzlemeye Başla' : 'Bölüm Yok'}
          </button>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0 py-4">
          <h1 class="text-2xl md:text-4xl font-extrabold text-white mb-2">{title}</h1>
          {#if info.titleTr}
            <p class="text-base text-zinc-500 mb-3">{info.titleTr}</p>
          {/if}

          <div class="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge {status} />
            <RatingBadge {rating} />
            {#if year}
              <span class="text-sm text-zinc-500 font-medium">{year}</span>
            {/if}
          </div>

          <!-- Categories -->
          {#if categories.length > 0}
            <div class="flex flex-wrap gap-2 mb-4">
              {#each categories as cat}
                <a
                  href="#/category/{cat}"
                  class="px-3 py-1 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 rounded-full text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </a>
              {/each}
            </div>
          {/if}

          <!-- Type Badges (Sub/Dub) -->
          {#if types.length > 0}
            <div class="flex flex-wrap gap-2 mb-4">
              {#if types.includes('sub')}
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">SUB</span>
              {/if}
              {#if types.includes('dub')}
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">DUB</span>
              {/if}
            </div>
          {/if}

          <!-- Description -->
          {#if description}
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Özet</h3>
              <p class="text-sm md:text-base text-zinc-300 leading-relaxed">{description}</p>
            </div>
          {/if}

          <!-- Watch button (desktop) -->
          <button
            onclick={startWatching}
            disabled={episodes.length === 0}
            class="hidden md:inline-flex items-center gap-2 px-6 py-3 {episodes.length === 0 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20'} rounded-xl text-sm font-semibold transition-all"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            {episodes.length > 0 ? 'İzlemeye Başla' : 'Bölüm Yok'}
          </button>
        </div>
      </div>

      <!-- Episodes Section -->
      <div class="mt-8 md:mt-10 pb-8">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-1 h-6 bg-violet-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-bold text-zinc-100">
            Bölümler
          </h2>
          {#if !epLoading && episodes.length > 0}
            <span class="text-sm text-zinc-500 font-medium">{episodes.length} toplam</span>
          {/if}
        </div>

        {#if epLoading}
          <Skeleton variant="list" count={6} />
        {:else if epError}
          <ErrorDisplay message={epError} onretry={loadEpisodes} />
        {:else if episodes.length === 0}
          <EmptyState title="Henüz bölüm yok" description="Yeni bölümler yakında eklenecek. Daha sonra tekrar kontrol edin!" />
        {:else}
          <div class="grid gap-2 max-w-3xl">
            {#each episodes as ep}
              <button
                onclick={() => router.navigate(`/watch/${slug}/${ep.episode}`)}
                class="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700/50 transition-all text-left group"
              >
                <!-- Thumbnail -->
                <div class="w-28 h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 relative">
                  {#if ep.thumbnail}
                    <img src={proxyImg(ep.thumbnail)} alt="" class="w-full h-full object-cover" loading="lazy" onerror={(e) => e.target.style.display = 'none'} />
                  {/if}
                  {#if ep.duration}
                    <span class="absolute bottom-1 right-1 text-[10px] font-medium bg-black/70 text-zinc-300 px-1.5 py-0.5 rounded">
                      {ep.duration}
                    </span>
                  {/if}
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-zinc-200 group-hover:text-violet-300 transition-colors">
                    EP {ep.episode}: {ep.title || `Episode ${ep.episode}`}
                  </p>
                  {#if ep.description}
                    <p class="text-xs text-zinc-500 mt-0.5 line-clamp-1">{ep.description}</p>
                  {/if}
                  <div class="flex items-center gap-3 mt-1.5">
                    {#if ep.releaseDate}
                      <span class="text-[11px] text-zinc-600">{ep.releaseDate}</span>
                    {/if}
                    {#if ep.streams?.length > 0}
                      <span class="text-[11px] text-zinc-600">{ep.streams.length} sunucu</span>
                    {/if}
                  </div>
                </div>

                <svg class="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
