import type { Metadata, Viewport } from "next";
import { Amiri, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { FloatingDuasButton } from "@/components/FloatingDuasButton";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qalb — Islamic Companion",
  description: "Live Prayer Times, Hijri Date, Quran Reader, Tasbih, Adhkar, Qibla, and Ibadah Tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Qalb",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1310" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch((err) => {
                    console.log('SW registration error:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${amiri.variable} ${playfair.variable} ${plusJakarta.variable} font-sans min-h-screen bg-qalb-bg dark:bg-qalb-night-bg text-qalb-ink dark:text-qalb-night-ink antialiased selection:bg-qalb-gold/30 selection:text-current transition-colors duration-200`}
      >
        <div className="mx-auto max-w-lg min-h-screen flex flex-col px-4 pt-3 pb-28">
          {children}
        </div>
        <FloatingDuasButton />
        <BottomNav />
      </body>
    </html>
  );
}
