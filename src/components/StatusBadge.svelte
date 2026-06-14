<script>
  let { status = 'ongoing' } = $props();
  const isOngoing = $derived(status?.toLowerCase() === 'ongoing');
</script>

<span
  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border {isOngoing ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-zinc-700/50 text-zinc-400 border-zinc-700'}"
>
  <span
    class="w-1.5 h-1.5 rounded-full {isOngoing ? 'bg-emerald-400' : 'bg-zinc-500'}"
  />
  {isOngoing ? 'Ongoing' : 'Completed'}
</span>
