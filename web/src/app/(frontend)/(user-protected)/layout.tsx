import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { HeaderLogout } from "@/components/ui/HeaderLogout"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-4 bg-white shadow-sm">
          <SidebarTrigger className="-ml-1 text-slate-500" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-medium text-slate-500 text-sm">Início</h1>
          <HeaderLogout />
        </header>

        <div className="flex-1 flex flex-col p-4 md:p-6 bg-slate-50 overflow-y-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}