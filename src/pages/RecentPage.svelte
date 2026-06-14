<script>
  import EmptyState from '../components/EmptyState.svelte';
</script>

<div class="p-4 md:p-8 animate-fade-in">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-1 h-7 bg-violet-500 rounded-full"></div>
    <h1 class="text-2xl md:text-3xl font-bold text-zinc-100">Son İzlenenler</h1>
  </div>
  <EmptyState
    title="İzleme geçmişi yok"
    description="Anime izlemeye başlayın, geçmişiniz burada görünecek."
  />
</div>
