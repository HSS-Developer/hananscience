import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Calendar,
  Megaphone,
  User,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  BookMarked,
  ShieldCheck,
  Send,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import schoolLogo from "@/assets/school-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "📓 Diary", url: "/diary", icon: BookMarked },
  { title: "📊 My Grades", url: "/grades", icon: BookOpen },
  { title: "✅ Attendance", url: "/attendance", icon: ClipboardCheck },
  { title: "📅 Timetable", url: "/timetable", icon: Calendar },
  { title: "📢 Notices", url: "/announcements", icon: Megaphone },
];

const studentSecondary = [
  { title: "💰 Fees", url: "/fees", icon: CreditCard },
  { title: "📝 Homework", url: "/assignments", icon: FileText },
  { title: "👤 Profile", url: "/profile", icon: User },
];

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "📓 Send Diary", url: "/admin/diary", icon: Send },
  { title: "📢 Send Notice", url: "/admin/announcement", icon: Megaphone },
  { title: "👁 View Diary", url: "/diary", icon: BookMarked },
  { title: "📢 View Notices", url: "/announcements", icon: Megaphone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === "admin";
  const mainItems = isAdmin ? adminItems : studentItems;
  const secondItems = isAdmin ? [] : studentSecondary;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="p-4 flex items-center gap-3">
        <img src={schoolLogo} alt="HSc Kids Logo" className="w-11 h-11 rounded-xl flex-shrink-0 object-contain bg-white/90 p-0.5" />
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="font-display font-bold text-sm text-sidebar-foreground leading-tight">HANAN</h2>
            <p className="text-[10px] text-sidebar-primary tracking-widest uppercase font-body">Science School</p>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider font-body">
            {isAdmin ? "🛡️ Admin Panel" : "📚 Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title + item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} className="hover:bg-sidebar-accent rounded-xl">
                    <NavLink to={item.url} end className="transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-bold">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="font-body text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {secondItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider font-body">
              More
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} className="hover:bg-sidebar-accent rounded-xl">
                      <NavLink to={item.url} end className="transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-bold">
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span className="font-body text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-body font-bold text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/60 truncate font-body">
              {isAdmin ? "Admin" : `Class ${user.class} · ${user.rollNumber}`}
            </p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => { logout(); navigate("/"); }}
              className="hover:bg-destructive/20 text-sidebar-foreground/70 hover:text-destructive rounded-xl"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span className="font-body text-sm">Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
