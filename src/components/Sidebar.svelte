<script>
  import { currentPath } from '../lib/stores.js';

  let { categories = [] } = $props();

  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/search', label: 'Ara', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
  ];

  // Use $currentPath from store auto-subscription
</script>

<aside class="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 bg-zinc-950 border-r border-zinc-800/60 z-40 overflow-y-auto">
  <!-- Logo -->
  <a href="#/" class="flex items-center gap-2.5 px-5 py-5 border-b border-zinc-800/40">
    <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
      Ç
    </div>
    <span class="text-lg font-bold text-white tracking-tight">
      Çin<span class="text-violet-400">Anime</span>
    </span>
  </a>

  <!-- Nav -->
  <nav class="flex-1 px-3 py-4 space-y-1">
    {#each navItems as item}
      {@const active = $currentPath === item.path || (item.path !== '/' && $currentPath.startsWith(item.path))}
      <a
        href="#{item.path}"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all {active ? 'bg-violet-600/10 text-violet-300' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'}"
        class:nav-active={active && item.path !== '/'}
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
        </svg>
        {item.label}
      </a>
    {/each}

    <!-- Categories Section -->
    <div class="pt-5 pb-2">
      <p class="px-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Kategoriler</p>
    </div>
    {#if categories.length > 0}
      {#each categories as cat}
        {@const catName = typeof cat === 'string' ? cat : (cat.name || cat.slug || cat)}
        {@const catSlug = typeof cat === 'string' ? cat : (cat.slug || cat.name || cat).toLowerCase().replace(/\s+/g, '-')}
        {@const isCatActive = $currentPath === `/category/${catSlug}`}
        <a
          href="#/category/{catSlug}"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all {isCatActive ? 'text-violet-300' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-700 flex-shrink-0"></span>
          {catName.charAt(0).toUpperCase() + catName.slice(1)}
        </a>
      {/each}
    {:else}
      {#each Array(6) as _, i}
        <div key={i} class="skeleton h-8 w-full rounded-lg my-1"></div>
      {/each}
    {/if}
  </nav>

  <!-- Footer -->
  <div class="px-5 py-4 border-t border-zinc-800/40">
    <p class="text-xs text-zinc-600">© 2026 ÇinAnime</p>
  </div>
</aside>

<style>
  .nav-active {
    position: relative;
  }
  .nav-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 24px;
    background: #7c3aed;
    border-radius: 0 4px 4px 0;
  }
</style>
