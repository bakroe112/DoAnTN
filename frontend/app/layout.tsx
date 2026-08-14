import type { Metadata } from "next"
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/src/layout/theme-provider"
import { cn } from "@/lib/utils"
import Header from "@/src/layout/Header"
import Footer from "@/src/layout/Footer"
import AppSidebar from "@/src/layout/Sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/components/ui/sidebar"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ElderCare AI",
  description: "AI-powered elderly care monitoring dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        plusJakartaSans.variable,
        fontMono.variable,
        "font-sans antialiased",
      )}
    >
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <main className="flex flex-1 flex-col gap-4 p-4">
                {children}
              </main>
              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
