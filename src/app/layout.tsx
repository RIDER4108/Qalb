import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { FloatingDuasButton } from "@/components/FloatingDuasButton";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qalb - Prayer, Quran & Dhikr",
  description: "Live Prayer Times, Hijri Date, Quran Reader, Tasbih, Adhkar, Qibla, and Ibadah Tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Qalb",
  },
  icons: {
    icon: [
      { url: "/qalb-logo.png", sizes: "any", type: "image/png" },
    ],
    apple: [
      { url: "/qalb-logo.png", sizes: "180x180", type: "image/png" },
    ],
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
        <link rel="icon" href="/qalb-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/qalb-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Scheherazade+New:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
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
        className={`${plusJakarta.variable} font-sans min-h-screen bg-qalb-bg dark:bg-qalb-night-bg text-qalb-ink dark:text-qalb-night-ink antialiased selection:bg-qalb-gold/30 selection:text-current transition-colors duration-200`}
      >
        <AppProvider>
          <div className="mx-auto max-w-lg min-h-screen flex flex-col px-4 pt-3 pb-28">
            {children}
          </div>
          <FloatingDuasButton />
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
