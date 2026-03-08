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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border/40 glass px-4 lg:px-6 flex-shrink-0 sticky top-0 z-10 shadow-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h2 className="font-display font-bold text-foreground text-lg hidden sm:block">
                {user?.role === "principal" ? "👑 Principal Panel" : user?.role === "admin" ? "🛡️ Admin Panel" : user?.role === "teacher" ? "📚 Teacher Panel" : `👋 Hi, ${user?.name?.split(" ")[0]}!`}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 rounded-xl hover:bg-muted/60 transition-all hover:shadow-card">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-fun flex items-center justify-center shadow-fun">
                  <span className="text-sm font-bold text-primary-foreground font-body">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold font-body text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {user?.role === "principal" ? "Principal" : user?.role === "admin" ? "Administrator" : user?.role === "teacher" ? "Teacher" : `Class ${user?.class} · ${user?.section || "A"}`}
                  </p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PortalLayout;
