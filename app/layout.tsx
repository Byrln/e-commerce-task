import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { LayoutContent } from "@/components/layout-content"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "Долгион Загвар - Орчин үеийн хувцасны брэнд",
  description: "Залуу үеийнхэнд зориулсан орчин үеийн хувцасны цуглуулгыг олж мэдээрэй."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            <LayoutContent>{children}</LayoutContent>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
