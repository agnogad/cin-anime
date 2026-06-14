<script>
  import AnimeCard from '../components/AnimeCard.svelte';
  import Skeleton from '../components/Skeleton.svelte';
  import ErrorDisplay from '../components/ErrorDisplay.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import { fetchJson, API_ANIMES, API_CATEGORIES, normalizeAnimes } from '../lib/api.js';
  import { currentPath, router } from '../lib/stores.js';

  let animes = $state([]);
  let categories = $state([]);
  let loading = $state(true);
  let error = $state(null);

  async function load() {
    loading = true;
    error = null;
    const [animeRes, catRes] = await Promise.all([
      fetchJson(API_ANIMES),
      fetchJson(API_CATEGORIES),
    ]);
    if (animeRes.error) {
      error = animeRes.error;
    } else {
      animes = normalizeAnimes(animeRes.data);
      categories = catRes.data || [];
    }
    loading = false;
  }

  $effect(() => { load(); });

  // ---- Filter state ----
  let selectedCategory = $state('');
  let selectedType = $state('');
  let searchQuery = $state('');
  let sortBy = $state('newest');

  // Read initial params from URL hash
  $effect(() => {
    const hash = window.location.hash;
    const path = hash.split('?')[0];
    const qs = hash.split('?')[1] || '';
    const params = new URLSearchParams(qs);

    // Category from path: #/category/action
    const parts = path.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'category') {
      selectedCategory = parts[1] || params.get('cat') || '';
    }

    selectedType = params.get('type') || '';
    searchQuery = params.get('q') || '';
    sortBy = params.get('sort') || 'newest';
  });

  // Get available categories from data
  const allCategories = $derived.by(() => {
    const cats = categories.length > 0
      ? categories.map(c => ({ slug: c.slug, name: c.name }))
      : [];
    // Also extract from anime data
    const fromAnime = new Set();
    animes.forEach(a => {
      const c = a.categories || [];
      (Array.isArray(c) ? c : []).forEach(cat => fromAnime.add(cat));
    });
    const existing = new Set(cats.map(c => c.slug));
    fromAnime.forEach(slug => {
      if (!existing.has(slug)) {
        cats.push({ slug, name: slug.charAt(0).toUpperCase() + slug.slice(1) });
      }
    });
    return cats.sort((a, b) => a.name.localeCompare(b.name));
  });

  // Filtered results
  const filtered = $derived.by(() => {
    let result = [...animes];

    // Category filter
    if (selectedCategory) {
      const cat = selectedCategory.toLowerCase();
      result = result.filter(a => {
        const cats = a.categories || [];
        return Array.isArray(cats) && cats.some(c => c.toLowerCase() === cat);
      });
    }

    // Type filter (sub/dub)
    if (selectedType) {
      result = result.filter(a => {
        const types = a.types || [];
        return types.includes(selectedType);
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(a => {
        const title = (a.title || a.Title || '').toLowerCase();
        const desc = (a.description || a.Description || '').toLowerCase();
        const titleTr = (a.titleTr || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || titleTr.includes(q);
      });
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        break;
      case 'oldest':
        result.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        break;
      case 'title-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'updated':
        result.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        break;
    }

    return result;
  });

  const displayName = $derived.by(() => {
    if (selectedCategory) {
      const cat = allCategories.find(c => c.slug === selectedCategory);
      return cat ? cat.name : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    }
    if (selectedType === 'sub') return 'Altyazılı Animeler';
    if (selectedType === 'dub') return 'Dublaj Animeler';
    return 'Tüm Animeler';
  });

  // Update URL when filters change
  function updateUrl() {
    const params = new URLSearchParams();
    if (selectedType) params.set('type', selectedType);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (sortBy !== 'newest') params.set('sort', sortBy);

    let path = '#/category';
    if (selectedCategory) path += `/${selectedCategory}`;
    if (params.toString()) path += `?${params.toString()}`;

    router.navigate(path);
  }

  function setCategory(cat) {
    selectedCategory = cat;
    updateUrl();
  }

  function setType(type) {
    selectedType = type;
    updateUrl();
  }

  function handleSearch(e) {
    e.preventDefault();
    updateUrl();
  }

  function handleSortChange(e) {
    sortBy = e.target.value;
    updateUrl();
  }
</script>

<div class="p-4 md:p-8 animate-fade-in">
  {#if loading}
    <div class="skeleton h-8 w-48 mb-6"></div>
    <Skeleton variant="grid" count={8} />
  {:else if error}
    <ErrorDisplay message={error} onretry={load} />
  {:else}
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-1 h-7 bg-violet-500 rounded-full"></div>
      <h1 class="text-2xl md:text-3xl font-bold text-zinc-100">{displayName}</h1>
      <span class="text-sm text-zinc-500 font-medium">({filtered.length})</span>
    </div>

    <!-- Filters -->
    <div class="space-y-4 mb-8">
      <!-- Search -->
      <form onsubmit={handleSearch}>
        <div class="relative max-w-xl">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Anime ara..."
            class="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          />
        </div>
      </form>

      <!-- Category Chips -->
      <div class="flex flex-wrap gap-2">
        <button
          onclick={() => setCategory('')}
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border {!selectedCategory && !selectedType ? 'bg-violet-600 text-white border-violet-600' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50'}"
        >
          Tümü
        </button>
        {#each allCategories as cat}
          <button
            onclick={() => setCategory(cat.slug)}
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border {selectedCategory === cat.slug ? 'bg-violet-600 text-white border-violet-600' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50'}"
          >
            {cat.name}
          </button>
        {/each}
      </div>

      <!-- Type & Sort Row -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Type filter -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Tür:</span>
          <button
            onclick={() => setType('')}
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border {!selectedType ? 'bg-violet-600 text-white border-violet-600' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50'}"
          >
            Tümü
          </button>
          <button
            onclick={() => setType('sub')}
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border {selectedType === 'sub' ? 'bg-blue-600 text-white border-blue-600' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50'}"
          >
            <span class="flex items-center gap-1.5">
              SUB
              {#if selectedType === 'sub'}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              {/if}
            </span>
          </button>
          <button
            onclick={() => setType('dub')}
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border {selectedType === 'dub' ? 'bg-amber-600 text-white border-amber-600' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50'}"
          >
            <span class="flex items-center gap-1.5">
              DUB
              {#if selectedType === 'dub'}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              {/if}
            </span>
          </button>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-2 ml-auto">
          <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Sırala:</span>
          <select
            value={sortBy}
            onchange={handleSortChange}
            class="bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="title-asc">A-Z</option>
            <option value="title-desc">Z-A</option>
            <option value="rating-desc">Puan (Yüksek)</option>
            <option value="updated">Son Güncellenen</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results -->
    {#if filtered.length === 0}
      <EmptyState
        title="Eşleşen anime bulunamadı"
        description="Farklı bir kategori, tür veya arama terimi deneyin."
      />
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {#each filtered as anime, i}
          <AnimeCard {anime} index={i} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
