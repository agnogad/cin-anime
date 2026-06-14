<script>
  let { title = 'No results found', description = 'Try adjusting your search or filters.' } = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
  <svg class="w-16 h-16 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
  <h3 class="text-lg font-semibold text-zinc-400 mb-1">{title}</h3>
  <p class="text-zinc-600 text-sm">{description}</p>
</div>
