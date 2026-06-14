<script>
  import { currentPath } from '../lib/stores.js';

  const items = [
    { path: '/', label: 'Ana Sayfa', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/search', label: 'Ara', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
    { path: '/categories', label: 'Kategoriler', icon: 'M19.5 8.25l-7.5 7.5-7.5-7.5' },
    { path: '/recent', label: 'Geçmiş', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  function isActive(path) {
    if (path === '/') return $currentPath === '/';
    if (path === '/categories') return $currentPath.startsWith('/category');
    return $currentPath.startsWith(path);
  }
</script>

<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/60 z-50">
  <div class="flex items-center justify-around h-16">
    {#each items as item}
      {@const active = isActive(item.path)}
      <a
        href="#{item.path}"
        class="flex flex-col items-center justify-center gap-0.5 min-w-[60px] h-full relative {active ? 'bottom-nav-active' : 'text-zinc-500'}"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
        </svg>
        <span class="text-[10px] font-medium">{item.label}</span>
      </a>
    {/each}
  </div>
</nav>
