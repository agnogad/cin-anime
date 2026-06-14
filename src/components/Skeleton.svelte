<script>
  let { variant = 'card', count = 1 } = $props();
</script>

{#if variant === 'card'}
  <div class="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
    <div class="skeleton h-48 w-full"></div>
    <div class="p-4 space-y-3">
      <div class="skeleton h-5 w-3/4"></div>
      <div class="skeleton h-4 w-1/2"></div>
      <div class="flex gap-2">
        <div class="skeleton h-5 w-16 rounded-full"></div>
        <div class="skeleton h-5 w-20 rounded-full"></div>
      </div>
    </div>
  </div>
{:else if variant === 'list'}
  <div class="space-y-2">
    {#each Array(count) as _, i}
      <div key={i} class="flex items-center gap-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
        <div class="skeleton w-20 h-12 rounded-lg flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-3 w-1/3"></div>
        </div>
      </div>
    {/each}
  </div>
{:else if variant === 'hero'}
  <div class="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden skeleton"></div>
{:else if variant === 'detail'}
  <div class="flex flex-col md:flex-row gap-8">
    <div class="skeleton w-full md:w-72 h-96 rounded-xl flex-shrink-0"></div>
    <div class="flex-1 space-y-4">
      <div class="skeleton h-8 w-3/4"></div>
      <div class="skeleton h-5 w-1/3"></div>
      <div class="skeleton h-24 w-full"></div>
      <div class="flex gap-3">
        <div class="skeleton h-8 w-24 rounded-full"></div>
        <div class="skeleton h-8 w-24 rounded-full"></div>
      </div>
    </div>
  </div>
{:else if variant === 'grid'}
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
    {#each Array(count) as _, i}
      <div key={i} class="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <div class="skeleton h-48 w-full"></div>
        <div class="p-4 space-y-3">
          <div class="skeleton h-5 w-3/4"></div>
          <div class="skeleton h-4 w-1/2"></div>
          <div class="flex gap-2">
            <div class="skeleton h-5 w-16 rounded-full"></div>
            <div class="skeleton h-5 w-20 rounded-full"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
