<script>
  import Layout from './components/Layout.svelte';
  import HomePage from './pages/HomePage.svelte';
  import AnimePage from './pages/AnimePage.svelte';
  import WatchPage from './pages/WatchPage.svelte';
  import CategoryPage from './pages/CategoryPage.svelte';
  import CategoriesListPage from './pages/CategoriesListPage.svelte';
  import SearchPage from './pages/SearchPage.svelte';
  import RecentPage from './pages/RecentPage.svelte';
  import EmptyState from './components/EmptyState.svelte';
  import { currentPath } from './lib/stores.js';

  // Use store auto-subscription: $currentPath
  const segments = $derived($currentPath.split('/').filter(Boolean));
  const route = $derived(segments[0] || 'home');
  const params = $derived({
    slug: segments[1] || '',
    episode: Number(segments[2]) || 1,
    name: segments[1] || '',
  });
</script>

<Layout>
  {#if route === 'home' || route === ''}
    <HomePage />
  {:else if route === 'anime' && params.slug}
    <AnimePage />
  {:else if route === 'watch' && params.slug && params.episode}
    <WatchPage />
  {:else if route === 'category' && params.name}
    <CategoryPage />
  {:else if route === 'categories'}
    <CategoriesListPage />
  {:else if route === 'search'}
    <SearchPage />
  {:else if route === 'recent'}
    <RecentPage />
  {:else}
    <div class="p-8 text-center">
      <EmptyState title="Page not found" description="The page you're looking for doesn't exist." />
      <a
        href="#/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all mt-4"
      >
        Go Home
      </a>
    </div>
  {/if}
</Layout>
