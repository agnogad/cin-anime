<script>
  import { proxyImg, onImgError } from '../lib/api.js';

  let { episode, slug, currentEpisode, onselect } = $props();

  const isActive = $derived(currentEpisode === episode.episode);
  let thumbError = $state(false);
</script>

<button
  onclick={() => onselect?.(episode.episode)}
  class="w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all border {isActive ? 'bg-violet-600/10 border-violet-500/40' : 'bg-zinc-900/60 border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700/50'}"
>
  <!-- Thumbnail -->
  <div class="w-24 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 relative">
    {#if episode.thumbnail && !thumbError}
      <img src={proxyImg(episode.thumbnail)} alt="" class="w-full h-full object-cover" loading="lazy" onerror={(e) => onImgError(e, episode.thumbnail)} />
    {/if}
    {#if episode.duration}
      <span class="absolute bottom-1 right-1 text-[10px] font-medium bg-black/70 text-zinc-300 px-1.5 py-0.5 rounded">
        {episode.duration}
      </span>
    {/if}
  </div>

  <!-- Info -->
  <div class="flex-1 min-w-0">
    <p class="text-sm font-medium text-zinc-200 truncate">
      EP {episode.episode}: {episode.title || `Episode ${episode.episode}`}
    </p>
    {#if episode.releaseDate}
      <p class="text-xs text-zinc-500 mt-0.5">{episode.releaseDate}</p>
    {/if}
  </div>

  {#if isActive}
    <svg class="w-5 h-5 text-violet-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  {/if}
</button>
