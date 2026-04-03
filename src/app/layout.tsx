import "./globals.css";
import type { Metadata } from "next";
import ReactQueryProvider from "@/context/Providers/ReactQueryProvider";
import { PermissionProvider } from "@/context/auth/PermissionContext";
import { ThemeProvider } from "@/context/Theme/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { DateProvider } from "@/context/auth/PrimaryDateContext";
import { ToasterProvider } from "@/components/Toast/ToasterProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "School management system",
  description: "Sidebar with navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <PermissionProvider>
            <ThemeProvider>
              <DateProvider>
                <main>
                  <SidebarProvider>
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
