import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { FloatingDuasButton } from "@/components/FloatingDuasButton";
import { IosInstallBanner } from "@/components/IosInstallBanner";

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
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/qalb-logo.png", sizes: "any", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* iOS PWA Installation Support Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Qalb" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        <link rel="icon" href="/icon-192x192.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Scheherazade+New:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Blocking Theme Initializer to prevent Dark Mode flash and state resets */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('qalb-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Service Worker Registration */}
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
        className="font-sans min-h-screen bg-qalb-bg dark:bg-qalb-night-bg text-qalb-ink dark:text-qalb-night-ink antialiased selection:bg-qalb-gold/30 selection:text-current transition-colors duration-200"
      >
        <AppProvider>
          <div className="mx-auto max-w-lg min-h-screen flex flex-col px-4 pt-3 pb-28">
            {children}
          </div>
          <IosInstallBanner />
          <FloatingDuasButton />
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
