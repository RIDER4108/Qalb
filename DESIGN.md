---
name: Qalb (Sacred Oasis)
description: Authentic Islamic companion balancing classical reverence, precise prayer schedules, spiritual habit tracking, and verified scripture
colors:
  # Primary Sacred Forest & Emerald
  primary: "#11382B"
  primary-dark: "#0B261D"
  primary-container: "#E3EDE8"
  on-primary: "#FFFFFF"
  on-primary-container: "#072017"

  # Ochre / Warm Caramel Gold Accents (Floating Duas & Highlights)
  accent-gold: "#CCA768"
  accent-gold-hover: "#BFA05E"
  accent-gold-subtle: "#F5EFE3"
  on-accent-gold: "#2A210B"

  # Canvas & Surfaces (Alabaster & Oatmeal)
  canvas-light: "#F7F5F0"
  card-light: "#FFFFFF"
  card-subtle-light: "#F1EEE7"
  border-light: "#EFECE6"
  text-primary-light: "#1A2822"
  text-secondary-light: "#7D8A83"
  text-muted-light: "#9EA9A3"

  # Dark Mode Canvas (Obsidian & Emerald Night)
  canvas-dark: "#0C1310"
  card-dark: "#141D18"
  card-subtle-dark: "#1A2520"
  border-dark: "#223129"
  text-primary-dark: "#F4F7F5"
  text-secondary-dark: "#9EADA5"
  text-muted-dark: "#62736A"

  # Badges & Indicators
  status-active: "#11382B"
  status-next: "#0B261D"
  status-sunnah: "#CCA768"
  status-streak: "#7C3AED"

typography:
  display-serif:
    fontFamily: "'Playfair Display', 'Newsreader', Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  arabic-scripture:
    fontFamily: "'Amiri', 'Scheherazade New', serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 2.2
    letterSpacing: "0em"
  arabic-title:
    fontFamily: "'Amiri', 'Scheherazade New', serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.8
    letterSpacing: "0em"
  latin-body:
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  latin-caption:
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"

rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "28px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"

components:
  card-prayer:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.text-primary-light}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  card-prayer-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  floating-duas-btn:
    backgroundColor: "{colors.accent-gold}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "12px 22px"
  bottom-nav:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.text-secondary-light}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
---

# Design System: Qalb (Sacred Oasis)

## 1. Overview
**Qalb** (قَلْب - The Heart) is an authentic, serene Islamic Progressive Web App. Designed to emulate the refined visual standards of modern premium devotional apps (DesignArena specifications), Qalb harmonizes:
1. Warm, tactile alabaster parchment backgrounds (`#F7F5F0`).
2. Deep forest green sanctuary accents (`#11382B`).
3. Refined editorial serif typography (`Playfair Display`) paired with authoritative Uthmani Arabic script (`Amiri`) and modern humanist UI typography (`Plus Jakarta Sans`).
4. Flush, space-optimized prayer cards and quick access modules.
5. Five cohesive navigation surfaces: **Home**, **Tasbih**, **Adhkar**, **Qibla**, and **Tracker**, accompanied by a persistent floating **Duas** action.

---

## 2. Colors

### Light Palette (Reference Alabaster & Forest Green)
- **Canvas / Page Background:** `#F7F5F0` (warm alabaster cream)
- **Card Surfaces:** `#FFFFFF` (crisp white with `#EFECE6` hairline border)
- **Subtle Surface:** `#F1EEE7` (warm tinted surface for badges & inputs)
- **Primary Brand / Active State:** `#11382B` (deep forest green)
- **Next Prayer Footnote Pill:** `#0B261D` (dark forest green)
- **Warm Caramel / Gold Accent:** `#CCA768` (floating Duas button, timetable links, active bars)
- **Primary Text:** `#1A2822` (deep evergreen ink)
- **Secondary Text:** `#7D8A83` (muted sage gray)
- **Muted Text / Badges:** `#9EA9A3`

### Dark Palette
- **Canvas / Page Background:** `#0C1310` (deep obsidian night)
- **Card Surfaces:** `#141D18` (dark marble card)
- **Card Border:** `#223129` (subtle deep slate border)
- **Primary Text:** `#F4F7F5` (moonlight white)
- **Secondary Text:** `#9EADA5` (silver sage)
- **Gold Accent:** `#DFBA75`

---

## 3. Typography

### Scripture & Arabic Text Standards (Mandatory per AGENTS.md)
1. **Typeface:** `'Amiri'`, with fallback to `'Scheherazade New'`.
2. **Text Direction:** Strictly wrapped in `dir="rtl"` with `lang="ar"`.
3. **Line Height:** Minimum `line-height: 2.0` (ideal `2.2+`) to guarantee zero clipping of harakat (fathah, kasrah, dammah, sukoon, shaddah).
4. **Authenticity:** All verses and Adhkar texts are sourced from verified canonical collections (Quran.com API, Hisn al-Muslim). Never hallucinated.

### Latin UI Typography
1. **Section Headers & Titles:** `'Playfair Display'` or `'Newsreader'` serif font (`font-serif`) for timeless editorial reverence ("Today's Prayers", "Quick Access", "Tasbih", "Daily Ayah", "Qibla Finder", "Ibadah Tracker").
2. **UI & Navigation:** `'Plus Jakarta Sans'` for clean legibility, tab labels, and buttons.
3. **Numerals & Timers:** Tabular figures (`font-variant-numeric: tabular-nums`) for jitter-free countdowns.

---

## 4. Layout & Spacing Rules

### Header & Top Badges
- Location indicator with auto-detect GPS pin: `AS-SALAMU ALAIKUM` / `📍 Makkah • Auto-detected`.
- Notification and Settings circular buttons.
- Full-width Hijri card in `#11382B` with embedded Qibla azimuth widget (`58° NE`).
- Next Prayer card with live countdown pill (`⏱ 7h 27m 12s`) and daytime progress bar.

### Today's Prayers Rectangles (Requirement 5)
- 2-column grid (`grid grid-cols-2 gap-3`) with uniform card height.
- **No empty space inside cards:** Prayer name on top left, status icon on top right, scheduled time in bold font-serif, and Arabic prayer name on bottom right.
- The active prayer card carries a flush dark bottom badge labeled `NEXT`.

### Quick Access Rectangles (Requirement 5)
- Full-width horizontal rounded cards (`rounded-2xl`, `p-4`, `flex items-center gap-4`):
  1. **Tasbih:** Teal circle icon, "Continue dhikr".
  2. **Morning Adhkar:** Gold sun icon, "6 duas left".
  3. **Qibla:** Blue compass icon, "58° NE".
  4. **Tracker:** Purple calendar icon, "2/5 today".
  5. **Quran Reader:** Green book icon, "Read & listen".
  6. **Private & Ad-Free banner:** Green shield, reassuring offline storage.

### Navigation & Actions
- Floating Action Button (FAB): Bottom-right pill in `#CCA768` with heart icon and label **Duas**.
- Floating Bottom Navigation: 5 items (`Home`, `Tasbih`, `Adhkar`, `Qibla`, `Tracker`).

---

## 5. Extra Features Specification

1. **Tasbih:**
   - Multiple canonical Dhikr presets with cycle targets (33, 34, 100).
   - Large interactive counter with circular completion gauge, vibration/haptic toggle, and sound toggle.
   - Daily and weekly tally with interactive 7-day bar chart.
2. **Adhkar (Hisn al-Muslim):**
   - Morning, Evening, After Salah, and Sleep categories.
   - Completion progress tracking with tap-to-count card interactions.
3. **Qibla Finder:**
   - Real-time compass dial using device orientation sensor with Kaaba bearing needle.
   - Distance to Kaaba calculator and live GPS location coordinates.
   - Manual adjust calibration slider for desktop testing and sensor adjustment.
4. **Ibadah Tracker:**
   - 7-day interactive horizontal date strip with 5-dot prayer completion indicator.
   - Daily Fard prayer check-off (Fajr, Dhuhr, Asr, Maghrib, Isha).
   - Sunnah & daily habits toggles (Tahajjud, Quran reading, Adhkar).
   - Current streak, best streak, and monthly completion metrics stored locally in `localStorage`.
5. **Duas Sheet:**
   - Categorized authentic Duas from Quran & Sunnah with Arabic (`dir="rtl"`), transliteration, English translation, and copy action.
6. **Quran Reader:**
   - Preserves complete working Quran reader with 114 Surahs, Uthmani script, translation, and vocal-only recitation (Mishary Rashid Alafasy).
