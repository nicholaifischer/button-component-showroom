import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background">
          <div className="flex h-14 items-center border-b px-4">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold text-sm">Interactive Playground</h1>
          </div>
          <div className="p-6 h-[calc(100vh-3.5rem)]">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
