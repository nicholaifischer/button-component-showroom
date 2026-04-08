import type { Metadata } from "next"
import "@/index.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "shadcn/ui Component Showroom",
  description: "A dynamic component builder and showroom",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="dark bg-background antialiased">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto bg-background">
              <div className="flex h-14 items-center border-b px-4">
                <SidebarTrigger />
                <h1 className="ml-4 font-semibold text-sm">Interactive Playground</h1>
              </div>
              <div className="p-6 h-[calc(100vh-3.5rem)]">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
