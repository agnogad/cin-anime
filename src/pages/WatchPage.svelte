<script>
  import ProviderSelector from '../components/ProviderSelector.svelte';
  import EpisodeItem from '../components/EpisodeItem.svelte';
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import { fetchJson, animeInfoUrl, animeEpisodesUrl, normalizeEpisodes } from '../lib/api.js';
  import { router } from '../lib/stores.js';

  let slug = $state('');
  let episodeNum = $state(1);

  $effect(() => {
    const parts = window.location.hash.slice(1).split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'watch') {
      slug = parts[1];
      episodeNum = Number(parts[2]) || 1;
    }
  });

  let info = $state(null);
  let episodes = $state([]);
  let loading = $state(true);
  let error = $state(null);

  async function load() {
    if (!slug) return;
    loading = true;
    error = null;
    const [infoRes, epRes] = await Promise.all([
      fetchJson(animeInfoUrl(slug)),
      fetchJson(animeEpisodesUrl(slug)),
    ]);
    if (infoRes.error) {
      error = infoRes.error;
    } else if (epRes.error) {
      error = epRes.error;
    } else {
      info = infoRes.data;
      episodes = normalizeEpisodes(epRes.data);
    }
    loading = false;
  }

  $effect(() => { if (slug) load(); });

  const title = $derived(info?.title || info?.Title || slug || 'Bilinmiyor');

  const currentEpisode = $derived(episodes.find(ep => ep.episode === episodeNum));

  let activeProviderIdx = $state(0);

  // Auto-select default provider
  $effect(() => {
    if (currentEpisode?.streams?.length > 0) {
      const defaultIdx = currentEpisode.streams.findIndex(s => s.default === true);
      activeProviderIdx = defaultIdx >= 0 ? defaultIdx : 0;
    }
  });

  const activeStream = $derived(currentEpisode?.streams?.[activeProviderIdx] || null);
  const prevEpisode = $derived(episodes.find(ep => ep.episode === episodeNum - 1));
  const nextEpisode = $derived(episodes.find(ep => ep.episode === episodeNum + 1));

  function handleEpisodeSelect(ep) {
    router.navigate(`/watch/${slug}/${ep}`);
  }
</script>

{#if loading}
  <div class="p-4 md:p-8">
    <div class="aspect-video w-full skeleton rounded-xl mb-6"></div>
    <div class="skeleton h-8 w-64 mb-4"></div>
    <div class="skeleton h-5 w-48 mb-6"></div>
    <Skeleton variant="list" count={6} />
  </div>
{:else if error}
  <div class="p-4 md:p-8">
    <ErrorDisplay message={error} onretry={load} />
  </div>
{:else if !currentEpisode}
  <div class="p-4 md:p-8">
    <ErrorDisplay
      message="Episode {episodeNum} not found."
      onretry={() => router.navigate(`/anime/${slug}`)}
    />
  </div>
{:else}
  <div class="p-2 md:p-6 animate-fade-in">
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
      <!-- Video Player + Info -->
      <div class="flex-1 min-w-0">
        <!-- Video Player -->
        <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/60">
          {#if activeStream}
            <iframe
              src={activeStream.embedUrl}
              class="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              title="{title} - EP {episodeNum}"
              loading="lazy"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center bg-zinc-900">
              <div class="text-center">
                <svg class="w-12 h-12 text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p class="text-zinc-500 text-sm">Yayın mevcut değil</p>
              </div>
            </div>
          {/if}
        </div>

        <!-- Episode Info -->
        <div class="mt-4 px-1">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h1 class="text-lg md:text-xl font-bold text-zinc-100 truncate">
                {title} — EP {episodeNum}
              </h1>
              {#if currentEpisode.title}
                <p class="text-sm text-zinc-400 mt-0.5">{currentEpisode.title}</p>
              {/if}
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                onclick={() => handleEpisodeSelect(episodeNum - 1)}
                disabled={!prevEpisode}
                class="px-3 py-2 {prevEpisode ? 'bg-zinc-800/80 hover:bg-zinc-700/80' : 'bg-zinc-800/30 opacity-30 cursor-not-allowed'} rounded-lg text-zinc-300 transition-colors text-sm flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span class="hidden sm:inline">Önceki</span>
              </button>
              <button
                onclick={() => handleEpisodeSelect(episodeNum + 1)}
                disabled={!nextEpisode}
                class="px-3 py-2 {nextEpisode ? 'bg-zinc-800/80 hover:bg-zinc-700/80' : 'bg-zinc-800/30 opacity-30 cursor-not-allowed'} rounded-lg text-zinc-300 transition-colors text-sm flex items-center gap-1.5"
              >
                <span class="hidden sm:inline">Sonraki</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Provider Selector -->
          {#if currentEpisode.streams?.length > 0}
            <div class="mt-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2.5">Yayın Sunucuları</p>
              <ProviderSelector
                streams={currentEpisode.streams}
                activeProvider={activeProviderIdx}
                onselect={(idx) => activeProviderIdx = idx}
              />
            </div>
          {/if}

          <!-- Episode description -->
          {#if currentEpisode.description}
            <div class="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/40">
              <p class="text-sm text-zinc-400 leading-relaxed">{currentEpisode.description}</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Episode List Sidebar -->
      <div class="w-full lg:w-80 flex-shrink-0">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Bölümler</h2>
          <span class="text-xs text-zinc-600">{episodes.length} toplam</span>
        </div>

        <!-- Quick Nav -->
        <div class="flex items-center gap-2 mb-3">
          <button
            onclick={() => handleEpisodeSelect(episodeNum - 1)}
            disabled={!prevEpisode}
            class="flex-1 py-2 text-center {prevEpisode ? 'bg-zinc-800/80 hover:bg-zinc-700/80' : 'bg-zinc-800/30 opacity-30 cursor-not-allowed'} rounded-lg text-zinc-300 text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Önceki
          </button>
          <button
            onclick={() => handleEpisodeSelect(episodeNum + 1)}
            disabled={!nextEpisode}
            class="flex-1 py-2 text-center {nextEpisode ? 'bg-zinc-800/80 hover:bg-zinc-700/80' : 'bg-zinc-800/30 opacity-30 cursor-not-allowed'} rounded-lg text-zinc-300 text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            Sonraki
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Episode List -->
        <div class="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
          {#each episodes as ep}
            <EpisodeItem
              episode={ep}
              {slug}
              currentEpisode={episodeNum}
              onselect={handleEpisodeSelect}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}
