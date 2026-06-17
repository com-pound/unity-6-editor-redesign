# Unity 6 Editor Redesign Concept — Plan

## Context
The user wants a high-fidelity concept redesign of the Unity game engine editor for Unity 6.5 / Unity 7 (2026). The reference image shows Unity 2020's actual editor. The design vision blends Unity × Figma × JetBrains × Linear × Apple Pro Apps — premium, dark, minimal, and productive.

This is a **multi-screen interactive concept** (not a real editor) built in React + Tailwind. No @make-kits packages are present; we use existing shadcn/ui components from `src/app/components/ui/` plus `lucide-react` icons.

---

## Architecture

### Routing / Screens
Use `react-router` (already installed v7.13.0) to navigate between 10 concept screens accessible via a top screen-switcher tab bar:

1. **Main Editor** — primary layout (default)
2. **Scene View** — full viewport focus
3. **Inspector Detail** — component card showcase
4. **Hierarchy Panel** — tree view showcase
5. **Project Browser** — asset browser
6. **Console** — debug console
7. **Build Settings** — build config panel
8. **Package Manager** — package listing
9. **Light Theme** — same main editor, light variant
10. **OLED Dark** — same main editor, pure black variant

Navigation: a floating screen-switcher bar at the top-right corner (pill-shaped, numbered 1–10).

### File Structure
```
src/app/
  App.tsx                          — router root + screen switcher
  components/
    unity/
      TopMenuBar.tsx               — File Edit Project Scene GameObjects ...
      MainToolbar.tsx              — play/pause, search, breadcrumb, workspace
      HierarchyPanel.tsx           — tree view with color coding, prefab icons
      SceneView.tsx                — viewport + floating toolbars + gizmos
      InspectorPanel.tsx           — component cards
      ProjectWindow.tsx            — asset browser grid/list
      ConsolePanel.tsx             — grouped errors, AI explain, chips
      BottomStatusBar.tsx          — branch, errors count, progress
      ScreenSwitcher.tsx           — pill navigation between 10 screens
    screens/
      MainEditorScreen.tsx
      SceneViewScreen.tsx
      InspectorScreen.tsx
      HierarchyScreen.tsx
      ProjectBrowserScreen.tsx
      ConsoleScreen.tsx
      BuildSettingsScreen.tsx
      PackageManagerScreen.tsx
      LightThemeScreen.tsx
      OLEDDarkScreen.tsx
```

---

## Design System (inline tokens, no kit)

### Colors
Override `src/styles/theme.css` dark mode tokens to match Unity redesign palette:

| Token | Value | Usage |
|---|---|---|
| `--unity-bg-base` | `#0d0d0f` | Root background (OLED) |
| `--unity-bg-panel` | `#141416` | Panel backgrounds |
| `--unity-bg-surface` | `#1c1c1f` | Cards, dropdowns |
| `--unity-bg-elevated` | `#242428` | Hover, selected |
| `--unity-border` | `#2a2a2e` | Thin separators |
| `--unity-accent` | `#4FC3F7` | Unity blue accent |
| `--unity-accent-dim` | `#2a6f8a` | Muted accent |
| `--unity-text-primary` | `#f0f0f2` | Main text |
| `--unity-text-secondary` | `#8888a0` | Muted labels |
| `--unity-text-tertiary` | `#555566` | Placeholder |
| `--unity-error` | `#f87171` | Errors |
| `--unity-warning` | `#fbbf24` | Warnings |
| `--unity-success` | `#34d399` | Info/success |
| `--unity-prefab` | `#7dd3fc` | Prefab GameObjects |
| `--unity-radius` | `10px` | Default border radius |

### Typography
- Font: `Inter` (import in fonts.css via Google Fonts)
- Monospace: `JetBrains Mono` for console/code fields
- Scale defined as CSS vars: `--unity-text-xs` through `--unity-text-xl`

### Panels
All panels: `bg-[var(--unity-bg-panel)]`, `border border-[var(--unity-border)]`, `rounded-[10px]`
Panel headers: `bg-[var(--unity-bg-surface)]`, `h-8`, icon + label + actions

---

## Screen Implementations

### 1. Main Editor (default)
Full editor chrome:
- **TopMenuBar**: File | Edit | Assets | GameObject | Component | Window | Help — monospace labels, 32px tall, thin bottom border
- **MainToolbar**: Play ▶ Pause ⏸ Step ⏭ | Breadcrumb | Global Search (⌘K) | Workspace switcher | Cloud sync icon | AI icon | Account avatar
- **3-column layout**:
  - Left (240px): HierarchyPanel (top 60%) + ProjectWindow tabs (bottom 40%)
  - Center (flex-1): SceneView
  - Right (280px): InspectorPanel
- **Bottom (120px)**: ConsolePanel + BottomStatusBar

### 2. HierarchyPanel
- Search bar with filter chips
- Tree with `▶` expand arrows, indentation
- Color-coded GameObjects: cameras (blue), lights (yellow), terrain (green), UI (purple)
- Prefab objects shown in `--unity-prefab` blue
- Hover: `bg-[var(--unity-bg-elevated)]`, active: accent left border
- Component type icons (lucide: `Camera`, `Lightbulb`, `Mountain`, `Box`)

### 3. SceneView
- Dark gray viewport `#1a1a1c`, mock terrain/landscape using a CSS gradient + SVG gizmo lines
- Floating toolbar (top-left): Scene/Game/Overlay tabs
- Tool selector sidebar (left edge): Move/Rotate/Scale/Rect/Transform icons
- Top-right overlays: Camera, Grid, Gizmos dropdowns
- Bottom-left: stats chip (Triangles, FPS, Draw Calls)
- Transform gizmo (center): colored XYZ arrows using SVG

### 4. InspectorPanel
Component cards for: Transform, Terrain, Terrain Collider, Material
Each card:
- Header: icon + component name + toggle switch + `⋯` menu
- Body: property rows with label + value (sliders, number inputs, dropdowns)
- `rounded-[10px]`, `shadow-sm`, gap between cards

### 5. ProjectWindow
- Tab bar: Project | Library
- Folder tree (left sidebar, collapsible)
- Asset grid: thumbnails in `72px` tiles or list view toggle
- Bottom toolbar: zoom slider, filter chips, search

### 6. ConsolePanel
- Tabs: All | Errors | Warnings | Info
- Filter chips: `[Error 3] [Warning 12] [Info 45]`
- AI Explain button on each error row
- Stack trace expandable rows
- Monospace font for stack traces

### 7. BuildSettingsScreen
- Platform list (iOS, Android, PC, WebGL, Xbox, PS5) with icons
- Active platform highlight
- Build Options section with toggles/checkboxes
- Build and Run button (accent)

### 8. PackageManagerScreen
- Search + filter bar
- Package list: name, version, description, install/update button
- Installed/Available/Built-in tabs

### 9. LightThemeScreen
- Same layout as Main Editor
- Override colors: `#f5f5f7` base, `#ffffff` panels, `#e5e5ea` borders, accent unchanged

### 10. OLEDDarkScreen
- Pure `#000000` base, `#0a0a0a` panels, deepest dark

---

## Implementation Order (for build phase)

1. Update `src/styles/theme.css` with Unity tokens
2. Add Inter + JetBrains Mono to `src/styles/fonts.css`
3. Create `ScreenSwitcher.tsx`
4. Create all `unity/` panel components (order: TopMenuBar → MainToolbar → HierarchyPanel → SceneView → InspectorPanel → ProjectWindow → ConsolePanel → BottomStatusBar)
5. Assemble `screens/MainEditorScreen.tsx`
6. Create remaining 9 screens
7. Wire router in `App.tsx`

---

## Verification
- All 10 screens navigable via ScreenSwitcher
- No broken imports or missing components
- Dark/Light/OLED themes visually distinct
- Inspector component cards collapse/expand
- Hierarchy tree expand/collapse
- Console filter chips functional
- Play button has active state animation
- Command palette (⌘K) opens modal
