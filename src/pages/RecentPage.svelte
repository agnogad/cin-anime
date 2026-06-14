<script>
  import EmptyState from '../components/EmptyState.svelte';
  import { getHistory, clearHistory, removeFromHistory } from '../lib/history.js';
  import { proxyImg, onImgError } from '../lib/api.js';
  import { router } from '../lib/stores.js';

  let history = $state([]);

  $effect(() => {
    history = getHistory();
  });

  function goToWatch(slug, episode) {
    router.navigate(`/watch/${slug}/${episode}`);
  }

  function handleClear() {
    if (confirm('İzleme geçmişini temizlemek istediğinize emin misiniz?')) {
      clearHistory();
      history = [];
    }
  }

  function handleRemove(slug) {
    removeFromHistory(slug);
    history = getHistory();
  }
</script>

<div class="p-4 md:p-8 animate-fade-in">
  <div class="flex items-center justify-between gap-3 mb-6">
    <div class="flex items-center gap-3">
      <div class="w-1 h-7 bg-violet-500 rounded-full"></div>
      <h1 class="text-2xl md:text-3xl font-bold text-zinc-100">Son İzlenenler</h1>
    </div>
    {#if history.length > 0}
      <button
        onclick={handleClear}
        class="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
      >
        Temizle
      </button>
    {/if}
  </div>

  {#if history.length === 0}
    <EmptyState
      title="İzleme geçmişi yok"
      description="Anime izlemeye başlayın, geçmişiniz burada görünecek."
    />
  {:else}
    <div class="space-y-2 max-w-3xl">
      {#each history as item}
        <button
          onclick={() => goToWatch(item.slug, item.episode)}
          class="w-full text-left flex items-center gap-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700/50 transition-all group"
        >
          <!-- Cover thumbnail -->
          <div class="w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
            {#if item.cover}
              <img src={proxyImg(item.cover)} alt="" class="w-full h-full object-cover" loading="lazy" onerror={(e) => onImgError(e, item.cover)} />
            {/if}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm md:text-base font-semibold text-zinc-200 group-hover:text-violet-300 transition-colors truncate">
              {item.title}
            </p>
            <p class="text-xs text-zinc-500 mt-1">
              Bölüm {item.episode}
              {#if item.episodeTitle}
                — {item.episodeTitle}
              {/if}
            </p>
            <p class="text-xs text-zinc-600 mt-0.5">
              {new Date(item.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <!-- Remove button -->
          <div
            role="button"
            tabindex="0"
            onclick={(e) => { e.stopPropagation(); handleRemove(item.slug); }}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRemove(item.slug); } }}
            class="p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            title="Kaldır"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <svg class="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      {/each}
    </div>
  {/if}
</div>
