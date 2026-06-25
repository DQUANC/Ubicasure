import {
  AppSidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/layout/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center gap-2 px-3 py-2 border-b bg-white md:hidden">
            <SidebarTrigger className="text-[#1a237e]" />
            <span className="font-semibold text-[#1a237e] text-sm">UBICASURE</span>
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
