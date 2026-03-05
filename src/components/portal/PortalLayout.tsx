import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell } from "lucide-react";

const PortalLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border bg-card px-4 lg:px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h2 className="font-display font-bold text-foreground text-lg hidden sm:block">
                {user?.role === "admin" ? "🛡️ Admin Panel" : `👋 Hi, ${user?.name?.split(" ")[0]}!`}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-fun flex items-center justify-center shadow-card">
                  <span className="text-sm font-bold text-primary-foreground font-body">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold font-body text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {user?.role === "admin" ? "Administrator" : `Class ${user?.class} · ${user?.section || "A"}`}
                  </p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PortalLayout;
