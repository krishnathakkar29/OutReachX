import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/custom/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col w-full overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto">

          <SidebarInset>{children}</SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
