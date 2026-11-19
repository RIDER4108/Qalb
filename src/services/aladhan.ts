import { AladhanApiResponse, LocationConfig, PrayerItem, PrayerTimings } from "@/types/prayer";

const ALADHAN_BASE_URL = "https://api.aladhan.com/v1";

export const DEFAULT_LOCATIONS: LocationConfig[] = [
  { city: "Makkah", country: "Saudi Arabia", displayName: "Makkah, KSA", method: 4 },
  { city: "Madinah", country: "Saudi Arabia", displayName: "Madinah, KSA", method: 4 },
  { city: "London", country: "United Kingdom", displayName: "London, UK", method: 2 },
  { city: "New York", country: "United States", displayName: "New York, USA", method: 2 },
  { city: "Dubai", country: "United Arab Emirates", displayName: "Dubai, UAE", method: 4 },
  { city: "Cairo", country: "Egypt", displayName: "Cairo, Egypt", method: 5 },
  { city: "Istanbul", country: "Turkey", displayName: "Istanbul, Turkey", method: 13 },
  { city: "Jakarta", country: "Indonesia", displayName: "Jakarta, Indonesia", method: 11 },
  { city: "Kuala Lumpur", country: "Malaysia", displayName: "Kuala Lumpur, Malaysia", method: 11 },
  { city: "Toronto", country: "Canada", displayName: "Toronto, Canada", method: 2 },
];

export async function getPrayerTimesByCity(
  city: string,
  country: string,
  method: number = 4
): Promise<AladhanApiResponse> {
  const url = `${ALADHAN_BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }

  return response.json();
}

export async function getPrayerTimesByCoords(
  latitude: number,
  longitude: number,
  method: number = 4
): Promise<AladhanApiResponse> {
  const now = Math.floor(Date.now() / 1000);
  const url = `${ALADHAN_BASE_URL}/timings/${now}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }

  return response.json();
}

export function parseTimeToMinutes(timeStr: string): number {
  // Strip timezone if present (e.g. "05:14 (EEST)" -> "05:14")
  const clean = timeStr.split(" ")[0];
  const [hours, minutes] = clean.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatTime12Hour(timeStr: string): string {
  const clean = timeStr.split(" ")[0];
  const [hours, minutes] = clean.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${paddedMinutes} ${period}`;
}

export interface NextPrayerComputation {
  currentPrayer: PrayerItem | null;
  nextPrayer: PrayerItem;
  secondsRemaining: number;
  formattedCountdown: string;
  progressPercent: number;
}

export function computePrayerSchedule(timings: PrayerTimings): {
  prayers: PrayerItem[];
  nextPrayerInfo: NextPrayerComputation;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSecondsInDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const prayerDefs: { id: PrayerItem["id"]; nameEn: string; nameAr: string }[] = [
    { id: "Fajr", nameEn: "Fajr", nameAr: "الفجر" },
    { id: "Sunrise", nameEn: "Sunrise", nameAr: "الشروق" },
    { id: "Dhuhr", nameEn: "Dhuhr", nameAr: "الظهر" },
    { id: "Asr", nameEn: "Asr", nameAr: "العصر" },
    { id: "Maghrib", nameEn: "Maghrib", nameAr: "المغرب" },
    { id: "Isha", nameEn: "Isha", nameAr: "العشاء" },
  ];

  const prayers: PrayerItem[] = prayerDefs.map((def) => {
    const rawTime = timings[def.id] || "00:00";
    const minutes = parseTimeToMinutes(rawTime);
    const prayerSeconds = minutes * 60;
    
    let status: PrayerItem["status"] = "upcoming";
    if (currentMinutes > minutes) {
      status = "passed";
    }

    return {
      id: def.id,
      nameEn: def.nameEn,
      nameAr: def.nameAr,
      time24: rawTime.split(" ")[0],
      time12: formatTime12Hour(rawTime),
      status,
      timestamp: prayerSeconds,
    };
  });

  // Determine next prayer (excluding Sunrise if only counting obligatory, but Sunrise is displayed in ribbon)
  // The 5 obligatory prayers: Fajr, Dhuhr, Asr, Maghrib, Isha
  const obligatoryPrayers = prayers.filter((p) => p.id !== "Sunrise");
  
  let nextPrayer = obligatoryPrayers.find((p) => p.status === "upcoming");
  let currentPrayer: PrayerItem | null = null;

  if (!nextPrayer) {
    // If all prayers today have passed, next prayer is tomorrow's Fajr
    nextPrayer = obligatoryPrayers[0];
    currentPrayer = obligatoryPrayers[obligatoryPrayers.length - 1];
  } else {
    const nextIdx = obligatoryPrayers.indexOf(nextPrayer);
    currentPrayer = nextIdx > 0 ? obligatoryPrayers[nextIdx - 1] : null;
  }

  // Set the immediately active prayer
  if (currentPrayer) {
    currentPrayer.status = "active";
  }

  // Calculate seconds remaining to next prayer
  let nextPrayerSeconds = nextPrayer.timestamp;
  if (nextPrayerSeconds <= currentSecondsInDay) {
    // Tomorrow's Fajr
    nextPrayerSeconds += 24 * 3600;
  }
  const secondsRemaining = Math.max(0, nextPrayerSeconds - currentSecondsInDay);

  // Format countdown
  const hours = Math.floor(secondsRemaining / 3600);
  const mins = Math.floor((secondsRemaining % 3600) / 60);
  const secs = secondsRemaining % 60;
  const formattedCountdown = `-${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  // Calculate interval progress
  let prevSeconds = currentPrayer ? currentPrayer.timestamp : (nextPrayerSeconds - 24 * 3600);
  if (prevSeconds > nextPrayerSeconds) {
    prevSeconds -= 24 * 3600;
  }
  const totalInterval = Math.max(1, nextPrayerSeconds - prevSeconds);
  const elapsed = Math.max(0, currentSecondsInDay - prevSeconds);
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalInterval) * 100));

  return {
    prayers,
    nextPrayerInfo: {
      currentPrayer,
      nextPrayer,
      secondsRemaining,
      formattedCountdown,
      progressPercent,
    },
  };
}
