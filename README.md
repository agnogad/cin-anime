<div align="center">
  <br />
  <a href="https://github.com/agnogad/cin-anime">
    <img src="https://img.shields.io/badge/ÇinAnime-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02LjMgMi44NDFBMS41IDEuNSAwIDAwNCA0LjExVjE1Ljg5YTEuNSAxLjUgMCAwMDIuMyAxLjI2OWw5LjM0NC01Ljg5YTEuNSAxLjUgMCAwMDAtMi41MzhMNi4zIDIuODQxeiIvPjwvc3ZnPg==" alt="ÇinAnime" />
  </a>
  <br />
  <h1 align="center" style="margin-top: 8px; font-size: 2.5rem; font-weight: 800;">ÇinAnime</h1>
  <p align="center">
    <strong>Premium Anime Streaming — Fully Static, Open Source</strong>
  </p>
  <p align="center">
    <a href="https://github.com/agnogad/cin-anime/issues">
      <img src="https://img.shields.io/github/issues/agnogad/cin-anime?style=flat-square&color=7C3AED" alt="Issues" />
    </a>
    <a href="https://github.com/agnogad/cin-anime/stargazers">
      <img src="https://img.shields.io/github/stars/agnogad/cin-anime?style=flat-square&color=7C3AED" alt="Stars" />
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square&color=7C3AED" alt="License" />
    </a>
    <img src="https://img.shields.io/badge/Svelte-5-orange?style=flat-square&logo=svelte" alt="Svelte 5" />
    <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/static-✓-success?style=flat-square" alt="Static" />
  </p>
  <br />
</div>

---

## ✨ Overview

**ÇinAnime** is a cinematic, fully static anime streaming website built with **Svelte 5** and **Tailwind CSS v4**. It follows **shadcn/ui** design conventions — dark theme, premium UI, and responsive layouts. All anime data is fetched at runtime from the [Tranime API](https://github.com/agnogad/tranime-api), making it completely backend-free.

> **No build step required** — open `dist/index.html` or serve with any static file server.

---

## 🌟 Features

<table>
  <tr>
    <td width="50%">
      <h3>🎬 Cinematic UI</h3>
      <p>Dark theme with violet accent, glassmorphism effects, smooth transitions, and hover-scale cards.</p>
    </td>
    <td width="50%">
      <h3>📡 Real-time Data</h3>
      <p>All anime, episodes, and metadata fetched live from GitHub raw API — no bundled data.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📱 Fully Responsive</h3>
      <p>Fixed sidebar on desktop, bottom navigation on mobile. Adaptive grid from 2 to 5 columns.</p>
    </td>
    <td width="50%">
      <h3>🎥 Smart Watch Page</h3>
      <p>Multiple stream providers with quality badges, auto-select default, 16:9 player, episode sidebar.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔍 Search & Filter</h3>
      <p>Client-side real-time search by title/description, category filtering with clickable chips.</p>
    </td>
    <td width="50%">
      <h3>⚡ Resilient UX</h3>
      <p>Skeleton loaders, error cards with retry buttons, and friendly empty states for every view.</p>
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/agnogad/cin-anime.git
cd cin-anime

# Install dependencies
npm install

# Start development server (with HMR)
npm run dev

# Build for production (static output → dist/)
npm run build

# Preview the production build
npm run preview
```

The built site is fully static and can be served with any HTTP server:

```bash
npx serve dist          # using serve
python3 -m http.server -d dist   # using Python
```

---

## 🗺️ Routes

| Route | Page | Description |
|---|---|---|
| `#/` | **Home** | Hero banner with featured anime, 🔥 trending horizontal scroll, category chips, latest releases grid, and full catalog |
| `#/anime/:slug` | **Anime Detail** | Poster, synopsis, metadata, status badges, category links, and complete episode list with thumbnails |
| `#/watch/:slug/:episode` | **Watch** | 16:9 iframe video player, multi-provider tabs with quality badges, prev/next episode nav, scrollable episode sidebar |
| `#/category/:name` | **Category** | Filtered anime grid by genre (action, sci-fi, romance, etc.) |
| `#/categories` | **All Categories** | Full list of available categories as clickable chips |
| `#/search?q=` | **Search** | Real-time client-side search by anime title and description |
| `#/recent` | **Recently Watched** | Placeholder for watch history (extensible) |

---

## 🧩 Tech Stack

| Technology | Purpose |
|---|---|
| **Svelte 5** | Reactive UI framework with runes (`$state`, `$derived`, `$effect`) |
| **Tailwind CSS v4** | Utility-first styling with `@tailwindcss/vite` plugin |
| **Vite 6** | Build tooling — fast HMR and optimized static output |
| **shadcn/ui** | Design conventions (rounded-xl, color tokens, component patterns) |
| **Hash Router** | Custom lightweight router using Svelte stores — zero dependencies |
| **GitHub Raw API** | All data sourced from [agnogad/tranime-api](https://github.com/agnogad/tranime-api) |

---

## 📁 Project Structure

```
cin-anime/
├── index.html                 # Vite entry HTML
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite + Svelte + Tailwind config
├── svelte.config.js           # Svelte preprocessor
├── src/
│   ├── main.js                # App entry point
│   ├── app.css                # Tailwind v4 imports + custom styles
│   ├── App.svelte             # Hash router — route matching & page switching
│   ├── lib/
│   │   ├── api.js             # Fetch helpers, URL builders, data normalizers
│   │   └── stores.js          # Custom hash-based router store
│   ├── components/            # 14 reusable UI components
│   │   ├── AnimeCard.svelte   # Anime grid card with cover, badges, hover
│   │   ├── BottomNav.svelte   # Mobile bottom navigation bar
│   │   ├── CategoryBadge.svelte
│   │   ├── EmptyState.svelte  # Friendly empty/no-results view
│   │   ├── EpisodeItem.svelte # Episode list item with thumbnail
│   │   ├── ErrorDisplay.svelte# Error card with retry button
│   │   ├── HeroBanner.svelte  # Full-width featured hero section
│   │   ├── Layout.svelte      # Sidebar + main + bottom nav layout
│   │   ├── ProviderSelector.svelte # Stream provider tabs with quality
│   │   ├── RatingBadge.svelte # Star rating with glow effect
│   │   ├── Sidebar.svelte     # Desktop left sidebar navigation
│   │   ├── Skeleton.svelte    # Shimmer loading skeletons (5 variants)
│   │   └── StatusBadge.svelte # Ongoing/Completed pill badge
│   └── pages/                 # 7 page components
│       ├── HomePage.svelte    # / — hero, trending, categories, grids
│       ├── AnimePage.svelte   # /anime/:slug — details + episodes
│       ├── WatchPage.svelte   # /watch/:slug/:episode — player + nav
│       ├── CategoryPage.svelte# /category/:name — filtered grid
│       ├── CategoriesListPage.svelte # /categories — all categories
│       ├── SearchPage.svelte  # /search — real-time search
│       └── RecentPage.svelte  # /recent — watch history placeholder
├── dist/                      # Production build output (~132KB)
└── .gitignore
```

---

## 🎨 Design System

- **Theme:** Dark mode only (`bg-zinc-950` / `bg-zinc-900` base)
- **Accent:** Vivid violet (`#7C3AED`) with soft violet (`#A78BFA`) variants
- **Typography:** Inter font family, bold display weights for titles
- **Cards:** `rounded-xl`, `border-zinc-800`, hover scale + shadow effects
- **Badges:** Colored pills — emerald for "Ongoing", gray for "Completed", violet for categories
- **Loading:** Shimmer skeleton animation on all data-fetching views
- **Scrollbar:** Custom dark scrollbar matching the theme

---

## 📡 Data Source

All anime data is fetched at runtime from the [Tranime API](https://github.com/agnogad/tranime-api) by [agnogad](https://github.com/agnogad):

```
Base URL: https://raw.githubusercontent.com/agnogad/tranime-api/refs/heads/main/data
```

| Endpoint | Description |
|---|---|
| `GET /data/animes.json` | Anime index — list of all anime with slugs |
| `GET /data/categories.json` | Category definitions |
| `GET /data/anime/{slug}/info.json` | Individual anime metadata |
| `GET /data/anime/{slug}/episodes.json` | Episode list with stream providers |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is [MIT](LICENSE) licensed. Feel free to use, modify, and distribute.

---

<div align="center">
  <br />
  <p>
    Built with ❤️ using <a href="https://svelte.dev">Svelte</a> and <a href="https://tailwindcss.com">Tailwind CSS</a>
  </p>
  <p>
    <a href="https://github.com/agnogad/cin-anime/issues">Report Bug</a>
    ·
    <a href="https://github.com/agnogad/cin-anime/issues">Request Feature</a>
  </p>
  <br />
</div>
