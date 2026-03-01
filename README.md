<p align="center">
  <img src="public/Google logo.svg" alt="Hunger Games: The Google Edition" width="60%">
</p>

<h1 align="center">Hunger Games: The Google Edition</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/D3.js-Visualization-f9a03c?logo=d3.js" alt="D3.js">
  <img src="https://img.shields.io/badge/Observable_Plot-Charts-5f4b8b" alt="Observable Plot">
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" alt="Vercel">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen" alt="Status">
</p>

<p align="center">
  An interactive, narrative-driven data investigation into Google's product graveyard — built with D3.js, Observable Plot, and Next.js.
</p>

<p align="center">
  <a href="https://google-ui-website.vercel.app/"><strong>→ View Live Demo</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Pynthamil/The-Hunger-Games-The-Google-Edition">Python Analysis Repo</a>
</p>

---

## About

This is the interactive companion to the [Google Product Lifecycle & Innovation Analysis](https://github.com/Pynthamil/The-Hunger-Games-The-Google-Edition) notebook. It takes the same dataset and findings and turns them into a scrollable, browser-native investigation — structured as a seven-act story, from the first clue to the final conclusion.

The landing page is styled as a Google search interface. The analysis page is a long-form data essay. The notebook page shows every Python code block from the original Jupyter notebook, with syntax highlighting and one-click copy.

---

## Pages

### `/` — Landing
A Google search UI mockup built with a custom `InputGroup` component and `GridPattern` background. Two cards link directly to the Charts and Colab Notebook pages — framing the project as something you'd "search for."

### `/charts` — The Investigation
The core of the site. A dark-mode, monospaced, scrollable essay structured in seven acts, each pairing narrative prose with an interactive D3/Observable Plot chart:

| Act | Narrative | Chart |
|---|---|---|
| I | Products Are Dying Younger | Average lifespan line + scatter with hover tooltips |
| II | The Graveyard Fills Faster | Shutdown frequency bar chart + active products area chart |
| III | Mapping the Kill Zone | Hexbin density map + contour density plot |
| IV | The Category Curse | Shutdown heatmap by category/year + box plots by category |
| V | The Individual Stories | Gantt-style timeline of the 50 longest-lived products |
| VI | Your Product's Future | Kaplan–Meier-style survival curve with 50% marker |
| VII | What Changed? | Linear regression scatter with 2010 inflection marker |

All charts are rendered client-side with live data loaded from `/data/Google_graveyard.csv`. Stat callouts (e.g. average lifespan pre/post 2010, peak shutdown year, % change) are computed dynamically from the dataset at runtime.

### `/colab-notebook` — The Code
Every Python code block from the original Jupyter notebook, displayed in order with titles, syntax highlighting, and a copy button on each block. A header links directly to the `.ipynb` file on GitHub. The page uses a `DotPattern` background and a conic gradient border on each card.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Charting | Observable Plot + D3.js |
| Styling | Tailwind CSS |
| Components | shadcn/ui (`Button`, `Card`, `InputGroup`, `CodeBlock`) |
| Patterns | Custom `GridPattern`, `DotPattern` UI components |
| Deployment | Vercel |

### Architecture Notes

- All charts live in `/charts/page.tsx` as a single client component. Each chart uses a `useRef` to mount an Observable Plot SVG via `useEffect` once the CSV data is loaded with D3.
- Stats (avg lifespan, peak shutdown year, % change) are derived in the same `useEffect` as data loading and stored in a `stats` state object, injected directly into the narrative prose.
- The Colab page (`/colab-notebook/page.tsx`) is purely static — all code blocks are hardcoded as a typed array and mapped to `CodeBlock` components. No data fetching.
- The site is intentionally **desktop-only** for the charts page. A mobile gate is in place given the complexity of the SVG layouts.

---

## Project Structure

```
├── app/
│   ├── page.tsx                # Landing — Google search UI
│   ├── charts/
│   │   └── page.tsx            # Seven-act data investigation
│   └── colab-notebook/
│       └── page.tsx            # Python notebook code display
│
├── components/
│   ├── ui/                     # shadcn/ui + custom components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── input-group.tsx
│   │   ├── grid-pattern.tsx
│   │   └── dot-pattern.tsx
│   └── ai/
│       └── code-block.tsx      # Syntax-highlighted code block with copy
│
├── public/
│   ├── data/
│   │   └── Google_graveyard.csv
│   └── Google logo.svg
│
├── types/                      # Shared TypeScript interfaces
├── lib/                        # Utilities
├── d3.d.ts                     # Manual D3 type declaration
└── next.config.ts
```

---

## Getting Started

```bash
git clone https://github.com/Pynthamil/Google-UI-Website.git
cd Google-UI-Website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The charts page requires the CSV at `public/data/Google_graveyard.csv` — make sure it's present before running.

---

## Related

The datasets, Python analysis, and original Jupyter notebook all live in the companion repo.

**[→ Google Product Lifecycle & Innovation Analysis (Python / Jupyter)](https://github.com/Pynthamil/The-Hunger-Games-The-Google-Edition)**

---

## Author

**Pynthamil Pavendan**  
[github.com/Pynthamil](https://github.com/Pynthamil) · India

---

## License

MIT — see [LICENSE](LICENSE) for details.
