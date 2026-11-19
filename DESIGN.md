---
name: Nur (Sacred Sanctuary)
description: Modern spiritual companion PWA balancing reverence, immaculate typography, and daily prayer utility
colors:
  # Primary Sacred Emerald & Olive Tones
  primary: "#144534"
  primary-hover: "#0E3326"
  primary-container: "#E1EFE7"
  on-primary: "#FFFFFF"
  on-primary-container: "#09241B"

  # Champagne Gold & Brass Accents
  accent-gold: "#C5A059"
  accent-gold-hover: "#B38F48"
  accent-gold-subtle: "#F5EFE1"
  on-accent-gold: "#2A210B"

  # Light Theme (Parchment & Warm Sand)
  surface-light: "#FAF7F2"
  surface-container-light: "#F3EDE2"
  surface-card-light: "#FFFFFF"
  border-light: "#E7DFD3"
  text-primary-light: "#1C2421"
  text-secondary-light: "#5C6762"
  text-muted-light: "#8F9A95"

  # Dark Theme (Obsidian & Deep Night)
  surface-dark: "#0C1310"
  surface-container-dark: "#131C18"
  surface-card-dark: "#1A2520"
  border-dark: "#25342D"
  text-primary-dark: "#F4F7F5"
  text-secondary-dark: "#A7B5AE"
  text-muted-dark: "#687770"

  # Status & Prayer Indicators
  status-active: "#10B981"
  status-upcoming: "#C5A059"
  status-passed: "#94A3B8"

typography:
  arabic-scripture:
    fontFamily: "'Amiri', 'Scheherazade New', serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 2.2
    letterSpacing: "0em"
  arabic-heading:
    fontFamily: "'Amiri', 'Scheherazade New', serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.8
    letterSpacing: "0em"
  latin-display:
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  latin-heading:
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  latin-body:
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  latin-caption:
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"

rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
  bottom-nav:
    backgroundColor: "{colors.surface-card-light}"
    textColor: "{colors.text-primary-light}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
---

# Design System: Sacred Sanctuary

## 1. Overview
**Nur** is an Islamic Progressive Web App (PWA) designed to bring daily spiritual peace, clarity, and discipline to modern Muslims. 

Rooted in the visual philosophy of the **Sacred Sanctuary**, the experience fuses timeless architectural reverence (deep emerald tones, warm parchment surfaces, delicate champagne gold details) with modern mobile ergonomics. The app honors Quranic scripture with uncompromised typographical care (zero harakat clipping, full RTL support) while maintaining immediate glanceability for daily prayer schedules.

---

## 2. Colors

### Palette Philosophy
The palette evokes traditional sanctuary materials: deep dyed green leather, warm handmade parchment, polished brass sundials, and dark obsidian marble.

### Light Mode (Parchment & Warm Sand)
Designed for daylight contemplation without harsh white glare.
- **Base Background:** `#FAF7F2` (Warm sand parchment)
- **Container / Section Fill:** `#F3EDE2` (Soft sand stone)
- **Card Background:** `#FFFFFF` (Crisp clean card)
- **Primary Text:** `#1C2421` (Deep evergreen ink, softer than pure black)
- **Secondary Text:** `#5C6762` (Warm charcoal)
- **Borders:** `#E7DFD3` (Subtle warm stone rule)

### Dark Mode (Obsidian & Emerald Night)
Designed for pre-dawn Fajr, Tahajjud, and late-night Quran reading without eye fatigue.
- **Base Background:** `#0C1310` (Deep obsidian night)
- **Container / Section Fill:** `#131C18` (Subtle midnight emerald)
- **Card Background:** `#1A2520` (Dark marble slate)
- **Primary Text:** `#F4F7F5` (Warm moonlight white)
- **Secondary Text:** `#A7B5AE` (Muted silver sage)
- **Borders:** `#25342D` (Muted deep border)

### Accents & Signatures
- **Primary Brand:** `#144534` (Deep Sacred Emerald)
- **Champagne Gold:** `#C5A059` (Active prayer indicators, ayah markers, premium accents)
- **Subtle Gold Wash:** `#F5EFE1` (Light mode gold highlights) / `#262013` (Dark mode gold wash)
- **Prayer Active State:** `#10B981` (Vibrant emerald glow)

---

## 3. Typography

### Scripture & Arabic Text Standards (Mandatory)
Adhering strictly to **AGENTS.md**:
1. **Script:** Classical Medina Uthmani script fetched directly from verified APIs (Quran.com API / AlQuran Cloud).
2. **Arabic Fonts:** `'Amiri'` or `'Scheherazade New'`, fallback to system Arabic Naskh.
3. **RTL Container:** All Arabic text blocks must be wrapped in explicit `dir="rtl"` elements with `lang="ar"`.
4. **Line Height:** Minimum `line-height: 2.0` (ideal `2.2` to `2.4`) to guarantee diacritics (harakat, sukoon, maddah, tanween) **never clip**.
5. **Arabic Font Size:** Default Quran ayah reading size is `1.75rem` (28px) to `2rem` (32px), with user-adjustable font-size controls.

### Latin UI Typography
1. **Font Family:** `'Plus Jakarta Sans'`, system sans-serif fallback.
2. **Body Text:** `0.95rem` (15.2px) with `1.6` line-height for clean readability.
3. **Numerals & Times:** Clean tabular numbers for prayer countdowns and clock displays (`font-feature-settings: 'tnum'`).

---

## 4. Layout

### Mobile-First PWA Structure
1. **Max Container Width:** Mobile viewport default (`100%`, max `480px` centered on desktop screens with atmospheric backdrop).
2. **Safe Area Insets:** Strict adherence to iOS and Android safe areas (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`).
3. **Navigation Hierarchy:**
   - **Top Header:** Clean app bar with Hijri date badge, current location label, and settings/theme toggle.
   - **Hero Section:** Next Prayer Countdown Card with dynamic solar progress ring/arc.
   - **Prayer Times Ribbon:** Horizontal or vertical 5-prayer strip (Fajr, Dhuhr, Asr, Maghrib, Isha) + Sunrise, showing active/past/upcoming states.
   - **Quick Actions:** Instant jump to "Continue Reading Quran", "Daily Dhikr", and "Qibla".
   - **Bottom Navigation:** Floating pill dock (`Home`, `Quran`, `Du'a / Dhikr`, `Settings`) positioned above system navigation bars with subtle backdrop blur (`backdrop-blur-md`).

---

## 5. Elevation & Depth

1. **Light Mode Elevation:**
   - Cards use soft warm ambient shadows: `box-shadow: 0 4px 20px -2px rgba(28, 36, 33, 0.05)`.
   - Floating elements: `box-shadow: 0 10px 30px -4px rgba(20, 69, 52, 0.12)`.
2. **Dark Mode Elevation:**
   - Avoid harsh drop shadows. Instead, rely on **border radiance and surface luminosity**:
   - Level 0 (Background): `#0C1310`
   - Level 1 (Cards): `#1A2520` with a 1px border of `#25342D`
   - Active/Hero: Subtle inward emerald or gold radial gradient wash (`radial-gradient(ellipse at top, rgba(197, 160, 89, 0.15), transparent 70%)`).

---

## 6. Shapes & Geometry

1. **Corner Radii:**
   - Hero Cards: `24px` (`rounded-2xl` / `rounded-3xl`)
   - Standard Cards & Prayer Tiles: `16px` (`rounded-xl` / `rounded-2xl`)
   - Buttons & Badges: `12px` or full pill (`rounded-full`)
2. **Islamic Geometric Touch:**
   - Tasteful, subtle geometric eight-point star (Rub el Hizb) used as Ayah end-markers and section dividers.
   - Never clutter UI with heavy simulated mosaics or low-contrast wallpapers.

---

## 7. Components

### A. Next Prayer Hero Card
- **Background:** Deep Emerald with subtle champagne radiance.
- **Content:**
  - Next prayer name in English & Arabic (e.g. *Maghrib • مَغْرِب*).
  - High-precision countdown timer (`-00:42:18`).
  - Scheduled time (`6:14 PM`).
  - Next prayer indicator ring / progress bar showing elapsed time between prayers.

### B. Prayer Time Daily Ribbon
- 5 Prayer items + Shuruq (Sunrise).
- **Active State:** Highlighted border in gold (`#C5A059`), subtle glow, active badge.
- **Passed State:** Muted opacity (60%), clear checkmark or subtle dot.
- **Upcoming State:** Clean default text with scheduled time.

### C. Clean Quran Reader
- **Surah Index:** Clean list with Arabic title, English transliteration, revelation place (Meccan/Medinan), and total ayah count.
- **Reading View:**
  - Verse-by-verse clean card layout.
  - Arabic Ayah on top (`dir="rtl"`, Amiri font, line-height 2.2, crisp harakat).
  - Rub el Hizb Ayah number end-marker.
  - English translation directly beneath in legible Latin body text.
  - Vocal-only audio player bar docked at bottom when playing (reciter name, play/pause, ayah sync).

### D. Floating Bottom Nav
- Pill container centered at bottom with blur backdrop.
- Active item indicator with subtle emerald or gold pill highlight.

---

## 8. Do's and Don'ts

### Do's:
- **DO** verify all Quranic verses and prayer times via official APIs (Quran.com API, Aladhan API).
- **DO** always wrap Arabic scripture in `dir="rtl"` with ample `line-height >= 2.0`.
- **DO** support offline caching via Service Worker / Next.js PWA capabilities for cached Surahs and daily prayer schedules.
- **DO** use vocal-only audio recitations (e.g., Mishary Rashid Alafasy, Husary) without sound effects.
- **DO** make the design responsive, high-contrast, and compliant with WCAG AA accessibility standards.

### Don'ts:
- **DON'T** hardcode, paraphrase, or guess any Quran ayah or translation from LLM memory.
- **DON'T** clip Arabic diacritics (harakat/tashkeel) with tight line-heights or standard Latin container heights.
- **DON'T** include background music, chimes, or non-vocal sound effects.
- **DON'T** use low-contrast ornate arabesque patterns behind scripture text.
- **DON'T** overwhelm the user with intrusive ads, donation popups, or cluttered banners.
