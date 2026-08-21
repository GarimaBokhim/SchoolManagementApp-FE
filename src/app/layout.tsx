import "./globals.css";
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from "next";
import ReactQueryProvider from "@/context/Providers/ReactQueryProvider";
import { PermissionProvider } from "@/context/auth/PermissionContext";
import { ThemeProvider } from "@/context/Theme/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { DateProvider } from "@/context/auth/PrimaryDateContext";
import { ToasterProvider } from "@/components/Toast/ToasterProvider";
import { Toaster } from "react-hot-toast";
import { ServiceWorkerRegister } from "@/components/Pwa/ServiceWorkerRegister";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "School management system",
  description: "Sidebar with navigation",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EliteKhaneyPani",
  },
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#035BBA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <PermissionProvider>
            <ThemeProvider>
              <DateProvider>
                <main>
                  <SidebarProvider>
                    <ServiceWorkerRegister />
                    <ToasterProvider />
                    {children}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 3000,
                      }}
                    />
                  </SidebarProvider>
                </main>
              </DateProvider>
            </ThemeProvider>
          </PermissionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}