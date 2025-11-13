import "./globals.css";
import type { Metadata } from "next";
import ReactQueryProvider from "@/context/Providers/ReactQueryProvider";
import { PermissionProvider } from "@/context/auth/PermissionContext";
import { ThemeProvider } from "@/context/Theme/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { DateProvider } from "@/context/auth/PrimaryDateContext";

export const metadata: Metadata = {
  title: "Next.js Sidebar Example",
  description: "Sidebar with navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <PermissionProvider>
            <ThemeProvider>
              <DateProvider>
                <main>
                  <SidebarProvider>{children}</SidebarProvider>
                </main>
              </DateProvider>
            </ThemeProvider>
          </PermissionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
