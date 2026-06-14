<script>
  let { streams = [], activeProvider = 0, onselect } = $props();
</script>

{#if streams.length > 0}
  <div class="flex flex-wrap gap-2">
    {#each streams as stream, idx}
      <button
        onclick={() => onselect?.(idx)}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border {idx === activeProvider ? 'bg-violet-600 text-white border-violet-600' : 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600'}"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {stream.provider}
        {#if stream.quality}
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded {idx === activeProvider ? 'bg-white/15 text-white' : 'bg-zinc-700/60 text-zinc-400'}">
            {stream.quality}
          </span>
        {/if}
      </button>
    {/each}
  </div>
{/if}
