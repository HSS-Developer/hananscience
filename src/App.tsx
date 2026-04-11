import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const Login = lazy(() => import("./pages/Login"));
const PortalLayout = lazy(() => import("./components/portal/PortalLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Grades = lazy(() => import("./pages/Grades"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Timetable = lazy(() => import("./pages/Timetable"));
const AdminStudents = lazy(() => import("./pages/AdminStudents"));
const AdminTeachers = lazy(() => import("./pages/AdminTeachers"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Assignments = lazy(() => import("./pages/Assignments"));
const Profile = lazy(() => import("./pages/Profile"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const Diary = lazy(() => import("./pages/Diary"));
const AdminSendDiary = lazy(() => import("./pages/AdminSendDiary"));
const AdminSendAnnouncement = lazy(() => import("./pages/AdminSendAnnouncement"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Uniform = lazy(() => import("./pages/Uniform"));
const Syllabus = lazy(() => import("./pages/Syllabus"));
const Fees = lazy(() => import("./pages/Fees"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-12 h-12 rounded-2xl gradient-fun animate-pulse mx-auto mb-3" />
      <p className="text-sm text-muted-foreground font-body">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<AppLoader />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<PortalLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/diary" element={<Diary />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin/diary" element={<AdminSendDiary />} />
                <Route path="/admin/announcement" element={<AdminSendAnnouncement />} />
                <Route path="/admin/students" element={<AdminStudents />} />
                <Route path="/admin/teachers" element={<AdminTeachers />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/uniform" element={<Uniform />} />
                <Route path="/syllabus" element={<Syllabus />} />
                <Route path="/fees" element={<Fees />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
