<script>
  import StatusBadge from './StatusBadge.svelte';
  import RatingBadge from './RatingBadge.svelte';
  import { router } from '../lib/stores.js';
  import { proxyImg, onImgError } from '../lib/api.js';

  let { anime = {} } = $props();

  const title = $derived(anime.title || anime.Title || '');
  const desc = $derived(anime.description || anime.Description || '');
  const slug = $derived(anime.slug || anime.Slug || '');
  const rating = $derived(anime.rating ?? anime.Rating ?? 0);
  const status = $derived((anime.status || anime.Status || 'ongoing').toLowerCase());
  const year = $derived(anime.year || anime.Year || '');
  const banner = $derived(anime.banner || anime.Banner || anime.cover || anime.Cover || '');

  let bannerError = $state(false);
</script>

<div class="relative w-full h-[400px] md:h-[500px] overflow-hidden">
  <!-- Background -->
  {#if banner && !bannerError}
    <img
      src={proxyImg(banner)}
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
      onerror={(e) => onImgError(e, banner)}
    />
  {:else}
    <div class="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-zinc-950"></div>
  {/if}
  <div class="absolute inset-0 hero-overlay"></div>

  <!-- Content -->
  <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 pb-8 md:pb-16">
    <div class="max-w-3xl">
      <div class="flex items-center gap-3 mb-3">
        <StatusBadge {status} />
        <RatingBadge {rating} />
        {#if year}
          <span class="text-xs text-zinc-400 font-medium">{year}</span>
        {/if}
      </div>
      <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight">{title}</h1>
      <p class="text-sm md:text-base text-zinc-300 line-clamp-2 max-w-2xl mb-5">{desc}</p>
      <div class="flex items-center gap-3">
        <button
          onclick={() => router.navigate(`/anime/${slug}`)}
          class="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          Detayları Gör
        </button>
        <button
          onclick={() => router.navigate(`/watch/${slug}/1`)}
          class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold transition-all border border-white/10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hemen İzle
        </button>
      </div>
    </div>
  </div>
</div>
