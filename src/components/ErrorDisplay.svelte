<script>
  let { message = 'Failed to load data.', onretry } = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
  <svg class="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
  <h3 class="text-lg font-semibold text-zinc-300 mb-2">Something went wrong</h3>
  <p class="text-zinc-500 text-sm mb-6 max-w-md">{message}</p>
  {#if onretry}
    <button
      onclick={onretry}
      class="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-colors"
    >
      Retry
    </button>
  {/if}
</div>
