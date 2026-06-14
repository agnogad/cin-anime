<script>
  let { name = '', active = false } = $props();
</script>

<span
  class="px-3 py-1 rounded-full text-xs font-medium transition-all border {active ? 'bg-violet-600 text-white border-violet-600' : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/60 hover:text-zinc-300'}"
>
  {name.charAt(0).toUpperCase() + name.slice(1)}
</span>
