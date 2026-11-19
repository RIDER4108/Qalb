# Project Rules — Islamic App

## 1. Scripture & Data Integrity
- NEVER generate, hardcode, or guess Quranic verses, translations, or Hadith from memory.
- Always fetch Quran text from verified APIs (e.g., Quran.com API or AlQuran Cloud) using Uthmani or IndoPak script.
- Always fetch prayer times and Hijri dates from the Aladhan API.

## 2. Arabic & RTL Typography
- Wrap all Arabic text blocks in `dir="rtl"` containers.
- Use legible Arabic fonts (e.g., Amiri, Scheherazade New, or IndoPak Nastaliq) with generous line-height (`1.8` or higher) so diacritics (harakat) never clip.

## 3. Media & UI Standards
- Audio must be vocal-only recitations — never include background music or sound effects.
- Design mobile-first with clean light and dark themes.