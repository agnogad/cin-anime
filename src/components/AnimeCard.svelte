<script>
  import StatusBadge from './StatusBadge.svelte';
  import RatingBadge from './RatingBadge.svelte';
  import { router } from '../lib/stores.js';

  let { anime = {}, index = 0 } = $props();

  const title = $derived(anime.title || anime.Title || 'İsimsiz');
  const rating = $derived(anime.rating ?? anime.Rating ?? 0);
  const status = $derived((anime.status || anime.Status || 'ongoing').toLowerCase());
  const slug = $derived(anime.slug || anime.Slug);
  const cover = $derived(anime.cover || anime.Cover || anime.poster || anime.Poster || '');
  const year = $derived(anime.year || anime.Year || '');

  const delay = $derived(`${(index || 0) * 50}ms`);

  function goToAnime() {
    if (slug) router.navigate(`/anime/${slug}`);
  }

  let imgError = $state(false);
</script>

<button
  onclick={goToAnime}
  class="group block w-full text-left rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/5 animate-fade-in"
  style="animation-delay: {delay}"
>
  <!-- Cover -->
  <div class="relative aspect-[3/4] overflow-hidden bg-zinc-800">
    {#if cover && !imgError}
      <img
        src={cover}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
        onerror={() => imgError = true}
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center bg-zinc-800">
        <svg class="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
    {/if}
    <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>

    <!-- Top badges -->
    <div class="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
      <StatusBadge {status} />
      <RatingBadge {rating} />
    </div>
  </div>

  <!-- Info -->
  <div class="p-3 md:p-4">
    <h3 class="font-semibold text-sm md:text-base text-zinc-100 line-clamp-2 leading-snug group-hover:text-violet-300 transition-colors">
      {title}
    </h3>
    {#if year}
      <p class="text-xs text-zinc-500 mt-1">{year}</p>
    {/if}
  </div>
</button>
