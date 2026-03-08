import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import PortalLayout from "./components/portal/PortalLayout";
import Dashboard from "./pages/Dashboard";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import AdminStudents from "./pages/AdminStudents";
import Announcements from "./pages/Announcements";
import Assignments from "./pages/Assignments";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import Diary from "./pages/Diary";
import AdminSendDiary from "./pages/AdminSendDiary";
import AdminSendAnnouncement from "./pages/AdminSendAnnouncement";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
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
              <Route path="/about" element={<AboutUs />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
