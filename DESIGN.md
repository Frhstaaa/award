# DESIGN.md — RSU Livasya Awards 2026 Presentation System

## 1. Visual Thesis & Philosophy
- **Aesthetic Mood**: *Luxury Gala Night* — Grand, prestigious, cinematic, yet disciplined and focused.
- **Core Principle**: **Zero-Scroll Fullscreen Viewport (`100dvh`)**. Every presentation slide must fit 100% within the screen boundaries across desktop monitors, laptops (1366x768 / 1080p with display scaling), and stage projectors.
- **Atmospheric Contrast**: Deep obsidian background with radiant gold metallics and rich velvet drapery.

---

## 2. Color System
| Role | Color Value / Class | Description |
| :--- | :--- | :--- |
| **Base Background** | `#05070d` / `#070a13` | Deep space black / dark obsidian |
| **Surface Card** | `#0d1326`/90 (`backdrop-blur-xl`) | Translucent dark midnight navy |
| **Gold Primary** | `#d4af37` / `amber-400` | Luminous metallic gold |
| **Gold Shimmer** | `from-amber-400 to-amber-600` | Animated gradient shimmer for titles |
| **Curtain Velvet** | `#50070b` to `#2a0406` | Deep crimson royal velvet texture |
| **Border Accents** | `border-amber-500/25` to `30` | Subtle, elegant gold-leaf borders |
| **Text Primary** | `#f8fafc` (`slate-100`) | Crisp, high-contrast readable white |
| **Text Muted** | `#94a3b8` (`slate-400`) | Subtle metadata / subtitle grey |

---

## 3. Typography Scale & Hierarchy
- **Display Font**: *Cinzel* / Serif Display (`font-display`) — used for event branding, stage titles, and nominee/winner names.
- **Body / UI Font**: *Plus Jakarta Sans* (`font-sans`) — used for metadata, roles, departments, descriptions, and HUD controls.
- **Monospace Font**: JetBrains Mono / UI Monospace (`font-mono`) — used for counters, candidate badges, and status tags.

### Sizing Scale (Optimized for 100vh):
- **Stage Titles ("AND THE WINNER IS...")**: `text-2xl sm:text-4xl md:text-5xl font-black`
- **Nominee / Winner Names**: `text-xl sm:text-2xl md:text-3xl font-bold`
- **Category Titles**: `text-2xl sm:text-3xl md:text-4xl font-black`
- **Pill Badges**: `text-[10px] sm:text-xs px-3.5 py-1`
- **Body & Quotes**: `text-xs sm:text-sm leading-relaxed`
- **HUD & Controller**: `text-[11px] sm:text-xs`

---

## 4. Viewport & Layout Architecture
- **Root Layout**: `h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-between`
- **Presentation Header**: Fixed compact height (`py-2.5 px-5`, ~52px), non-shrinking (`flex-shrink-0`).
- **Main Stage Area**: `flex-1 w-full flex items-center justify-center px-4 pt-1 pb-16 overflow-hidden`.
  - The `pb-16` cushion guarantees zero overlap with the floating bottom HUD.
- **Floating HUD (`SlideshowControls`)**:
  - Anchored at `bottom-3 sm:bottom-4`.
  - Slim height (~44px) with semi-translucent glassmorphism (`bg-[#0a0e1a]/90 backdrop-blur-md`).
  - Auto-hides on mouse inactivity.

---

## 5. Component Proportions & Limits
1. **WelcomeGate**: Max width `max-w-md`, compact icon `w-14 h-14`, button `px-6 py-3`.
2. **CategoryIntroSlide**: Max width `max-w-2xl`, category icon `w-16 h-16` to `w-24 h-24`.
3. **NomineeSlide**: Max width `max-w-4xl`, photo card `w-32 h-32` to `w-48 h-48`, quote box max height `max-h-24 overflow-y-auto`.
4. **SuspenseSlide**: Max width `max-w-2xl`, pulsing star box `w-16 h-16` to `w-20 h-20`.
5. **WinnerRevealSlide**: Max width `max-w-4xl`, curtain container `min-h-[300px] h-[330px] sm:h-[370px] md:h-[400px] max-h-[58vh]`, avatar `w-28 h-28` to `w-40 h-40`.
