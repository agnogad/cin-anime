<script>
  import EmptyState from '../components/EmptyState.svelte';
</script>

<div class="p-4 md:p-8 animate-fade-in">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-1 h-7 bg-violet-500 rounded-full"></div>
    <h1 class="text-2xl md:text-3xl font-bold text-zinc-100">Recently Watched</h1>
  </div>
  <EmptyState
    title="No watch history"
    description="Start watching anime and your history will appear here."
  />
</div>
