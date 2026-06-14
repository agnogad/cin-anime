<script>
  import Sidebar from './Sidebar.svelte';
  import BottomNav from './BottomNav.svelte';
  import { fetchJson, API_CATEGORIES } from '../lib/api.js';

  let { children } = $props();

  let categories = $state([]);
  let loaded = $state(false);

  $effect(() => {
    async function load() {
      const { data } = await fetchJson(API_CATEGORIES);
      if (data) {
        categories = Array.isArray(data) ? data : [];
      }
      loaded = true;
    }
    load();
  });
</script>

<Sidebar {categories} />
<main class="md:ml-60 pb-20 md:pb-8 min-h-screen">
  {@render children()}
</main>
<BottomNav />
