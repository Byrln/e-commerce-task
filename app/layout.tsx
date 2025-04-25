import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Wave Fashion - Y2K Modern Fashion Brand",
  description: "Discover our modern fashion collection for the young generation."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            {/* 
              The suppressHydrationWarning attribute is used to suppress the warning about hydration mismatches.
              This is particularly useful when browser extensions like Bitdefender add attributes like bis_skin_checked="1"
              which can cause hydration mismatches.
            */}
            <div className="flex min-h-screen flex-col overflow-hidden" suppressHydrationWarning>
              <Navbar />
              <main className="flex-1" suppressHydrationWarning>{children}</main>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
