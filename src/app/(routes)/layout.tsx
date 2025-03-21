import { AppSidebar } from "@/components/common/app-sidebar";
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
            <SidebarInset>
              <RoutesLayout>{children}</RoutesLayout>
            </SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 md:pt-6">{children}</div>
  );
}
