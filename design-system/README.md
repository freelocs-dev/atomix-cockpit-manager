# AtomixOS Design System

**Brand:** OnLocsByte / AtomixOS  
**Primary Product:** AtomixOS Cockpit Manager — a web-based KDE Plasma desktop mode/scenario manager  
**Status:** Personal beta, v0.2

---

## Sources

- **GitHub org:** https://github.com/OnLocsByte
- **Cockpit Manager codebase:** `freelocs-dev/atomix-cockpit-manager` (React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + shadcn/ui + Lucide icons)
- **Config repo:** `freelocs-dev/atomixos-config` (mirrors README only at time of capture)
- *(Note: `OnLocsByte/atomixos` repo was not accessible via GitHub App at design-system build time — install it at https://github.com/apps/claude-design-import/installations/new to add access)*

---

## Product Context

AtomixOS is a personal Linux desktop experience layer built on top of **Nobara Linux / KDE Plasma 6**. It centers on the concept of **Scenarios** — named desktop modes (e.g. Gaming, Work, Creator) that bundle apps, KDE color themes, wallpapers, and shell scripts. The Cockpit Manager is a local web app that lets you configure, activate, and export those scenarios as KDE shell scripts.

### Products / Surfaces
| Surface | Description |
|---|---|
| **Cockpit Manager** | Main web UI — sidebar nav, scenario cards, theme builder, app library, settings |
| **AtomixOS Shell** | The underlying KDE Plasma layer (scripts, theming, wallpaper switching) |

### Desktop Modes
| Mode | Accent | Purpose |
|---|---|---|
| ⚡ Gaming | `#DC2626` Red | Performance, full focus, immersion |
| 💼 Work | `#0EA5E9` Sky Blue | Development, clarity, flow |
| 🎨 Creator | `#F59E0B` Amber | Video, design, creative work |

---

## CONTENT FUNDAMENTALS

**Tone:** Technical, terse, tool-focused. No fluff. Commands, not suggestions.  
**Voice:** First-person tool (the app speaks to the user directly). Lowercase section labels. Title-cased headings.  
**Casing:** UI labels use Title Case for nav items ("Theme Builder", "App Library"). Section labels use `UPPERCASE TRACKING` at 11px. Descriptions use sentence case.  
**Emoji:** Used selectively for scenario/app icons only — as functional identifiers, not decoration. Never in prose UI text or navigation.  
**Numbers:** Version shown as `v0.2 beta` in sidebar footer. Counts shown as pills: `3 apps`, `KDE Breeze`.  
**Examples:**
- Page heading: `Scenarios` / subtitle: `Automate your desktop environment`
- Empty state: `Create your first scenario` / body: `Automate apps, themes, and layout for any context — gaming, work, creative flow.`
- Status: `Running` / `Stopped`
- CTA copy: `New Scenario`, `Create Scenario`, `Export script`
- Code context: shell scripts use `kebab-case` filenames like `gaming-night.sh`

**No marketing copy.** This is a power-user tool. Descriptions are functional: "What is this scenario for?" is a field placeholder.

---

## VISUAL FOUNDATIONS

### Colors
Deep blue-black backgrounds with electric blue (`#3B82F6`) as the only accent. All surfaces live in a very narrow dark range:

| Token | Value | Use |
|---|---|---|
| `--atomix-bg` | `#05080F` | Root background |
| `--atomix-surface` | `#0A0F1E` | Elevated surface |
| `--atomix-card` | `#0D1526` | Cards, panels |
| `--atomix-elevated` | `#111D35` | App icon bubbles, elevated card rows |
| `--atomix-sidebar` | `#08101F` | Sidebar background |
| `--atomix-input` | `#060D1A` | Input/select backgrounds |
| `--atomix-code` | `#04070D` | Code/terminal blocks |
| `--atomix-border` | `rgba(99,179,237,0.08)` | Default border (very subtle blue tint) |
| `--atomix-border-strong` | `rgba(59,130,246,0.3)` | Focused/active borders |
| `--atomix-accent` | `#3B82F6` | Primary CTA, active state, glow |
| `--atomix-accent-hover` | `#2563EB` | Hover state for primary |
| `--atomix-accent-soft` | `#60A5FA` | Pill text, secondary emphasis |
| `--atomix-glow` | `rgba(59,130,246,0.15)` | Ambient glow fill |
| `--atomix-text` | `#F0F4FF` | Primary text (slightly blue-tinted white) |
| `--atomix-muted` | `#64748B` | Subtext, labels, placeholders |

**Mode accent colors:** Red `#DC2626` (Gaming), Sky `#0EA5E9` (Work), Amber `#F59E0B` (Creator), Emerald `#10B981` (active/running status).

### Typography
- **Sans:** `Inter` (300–600 weight range) — all UI text
- **Mono:** `JetBrains Mono` (400–700) — code blocks, script output, terminal content
- **Display headings:** `text-3xl font-bold tracking-tight text-white` — page titles
- **Section labels:** `text-[11px] uppercase tracking-widest font-semibold text-[#64748B]`
- **Body text:** `text-sm text-[#94A3B8]` (secondary) or `text-[#F0F4FF]` (primary)
- **Smallest text:** `text-[10px] uppercase tracking-widest` — version footer

### Spacing & Layout
- Sidebar: `w-60` (240px), `sticky top-0`, `h-screen`
- Main content: `px-8 py-6`
- Card grid: `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4`
- Card padding: `p-6`
- Section spacing: `mb-8` between page header and content

### Borders & Radius
- Default border: `rgba(99,179,237,0.08)` — nearly invisible, cold blue tint
- Active border: `rgba(59,130,246,0.3)` — visible blue
- Radius scale: `rounded-lg` (0.5rem inputs/buttons), `rounded-xl` (cards/panels), `rounded-2xl` (empty state frame), `rounded-full` (pills, dots, toggles)

### Shadows & Glows
- Card hover: `box-shadow: 0 0 20px rgba(59,130,246,0.08)` — barely perceptible blue halo
- Button hover: `box-shadow: 0 0 18px rgba(59,130,246,0.45)` — strong glow on primary button
- Active/running card: `glow-pulse` animation — `0 0 24px 2px rgba(59,130,246,0.4)` pulsing
- Status dot: `box-shadow: 0 0 8px <color>` — per-color glow on status indicators
- Input focus ring: `0 0 0 3px rgba(59,130,246,0.15)` — soft blue ring

### Animation
- **Page transitions:** `opacity 0 → 1, y: 10 → 0`, `duration: 0.2` (Framer Motion)
- **Card enter:** `opacity/y: 12 → 0`, spring `stiffness 320, damping 28`
- **Card hover:** `scale: 1.01`, spring `stiffness 320, damping 28`
- **Toggle thumb:** `layout` animation, spring `stiffness 500, damping 30`
- **Glow pulse:** `keyframes`, 2.4s ease-in-out, on active/running cards
- **No page-level easing curves** — all micro-interactions use spring physics

### Backgrounds & Textures
- No images, no textures. Pure flat dark backgrounds.
- No gradients on backgrounds (solid colors only)
- Gradient-style effect achieved purely via layered semi-transparent borders and box-shadows

### Hover / Press States
- **Text/icon buttons:** opacity or color shift to `text-white`, bg `hover:bg-white/[0.03]` or `hover:bg-white/[0.05]`
- **Danger buttons:** `hover:text-red-400 hover:bg-red-500/10`
- **Primary button:** bg darkens (`#3B82F6 → #2563EB`) + glow shadow appears
- **Press (active):** `active:scale-[0.97]` — subtle push-down effect
- **Nav items (active):** bg `rgba(59,130,246,0.1)` + 2px left border in `#3B82F6`

### Cards
- Background: `#0D1526`
- Border: `rgba(99,179,237,0.08)` (default), `rgba(59,130,246,0.4)` (running state)
- Radius: `rounded-xl`
- Internal dividers: `h-px bg-white/[0.05]`
- Hover: scale 1.01 + glow shadow

### Scrollbars
- Custom: 10px width, transparent track, `rgba(59,130,246,0.15)` thumb, `rgba(59,130,246,0.4)` on hover, `border-radius: 8px`

### Imagery
- No photography or illustrations used
- Empty states use geometric icon-in-circle with `rgba(59,130,246,0.1)` fill
- App/scenario icons are emoji (functional, not decorative)

### Corner Radius
- Buttons/inputs: `rounded-lg` (8px)
- Cards/panels/drawers: `rounded-xl` (12px)
- Empty state frames: `rounded-2xl` (16px), `border-dashed`
- Indicators/pills: `rounded-full`

---

## ICONOGRAPHY

- **Icon system:** Lucide React (`lucide-react` v0.575+) — stroke-style icons, 16px (`w-4 h-4`) standard size
- **Usage:** Navigation (LayoutGrid, Paintbrush, Package, Settings), action buttons (Plus, Pencil, Play, Square, Code2, Trash2)
- **No custom icon font.** Lucide is the only icon system.
- **Emoji icons:** Used as scenario/app identifiers — functional first-class UI elements (e.g. ⚡ for gaming scenario, 💼 for work, 🎨 for creator)
- **Unicode chars as icons:** Not observed
- **CDN availability:** `https://unpkg.com/lucide-react` or import from npm

Assets copied: see `assets/` folder.

---

## Files in this Design System

```
README.md                    ← this file
SKILL.md                     ← Agent skill definition
colors_and_type.css          ← CSS variables: colors, type, semantic tokens
assets/
  logo.svg                   ← AtomixOS "A" icon (512×512 / viewBox 0 0 56 56)
preview/
  colors-base.html           ← Base color palette swatches
  colors-semantic.html       ← Semantic / surface color swatches
  colors-modes.html          ← Desktop mode accent colors
  type-scale.html            ← Typography scale specimen
  type-specimens.html        ← Font specimens (Inter + JetBrains Mono)
  spacing-tokens.html        ← Radius, border, spacing tokens
  shadows-glows.html         ← Shadow & glow system
  components-buttons.html    ← Button variants
  components-inputs.html     ← Input, textarea, select, toggle
  components-cards.html      ← Card variants + scenario card
  components-pills.html      ← Pills, status dots, section labels
  components-sidebar.html    ← Sidebar navigation
  brand-logo.html            ← Logo on backgrounds
ui_kits/
  cockpit/
    README.md
    index.html               ← Full interactive Cockpit Manager prototype
    Sidebar.jsx
    Primitives.jsx
    ScenariosView.jsx
    ThemeBuilderView.jsx
```
