import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  ClipboardCheck,
  Trophy,
  TrendingUp,
  Calendar,
  Megaphone,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "Overall GPA", value: "3.85", icon: Trophy, change: "+0.12", color: "text-gold" },
  { label: "Attendance", value: "94.5%", icon: ClipboardCheck, change: "+2.1%", color: "text-success" },
  { label: "Courses", value: "8", icon: BookOpen, change: "Active", color: "text-teal" },
  { label: "Rank", value: "#5", icon: TrendingUp, change: "of 120", color: "text-accent" },
];

const upcomingClasses = [
  { subject: "Physics", time: "08:30 AM", room: "Lab 201", teacher: "Mr. Rahman" },
  { subject: "Mathematics", time: "10:00 AM", room: "Room 105", teacher: "Mrs. Ali" },
  { subject: "Chemistry", time: "11:30 AM", room: "Lab 302", teacher: "Dr. Syed" },
  { subject: "English", time: "01:00 PM", room: "Room 110", teacher: "Ms. Khan" },
];

const announcements = [
  { title: "Annual Science Fair 2026", date: "Mar 15", priority: "high" },
  { title: "Mid-Term Exams Schedule Released", date: "Mar 10", priority: "high" },
  { title: "Sports Day Registration Open", date: "Mar 08", priority: "medium" },
  { title: "Library Extended Hours This Week", date: "Mar 05", priority: "low" },
];

const recentGrades = [
  { subject: "Physics", grade: "A", score: 92, total: 100 },
  { subject: "Mathematics", grade: "A+", score: 98, total: 100 },
  { subject: "Chemistry", grade: "B+", score: 85, total: 100 },
  { subject: "Biology", grade: "A", score: 90, total: 100 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              Here's what's happening at HANAN Science School today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-border/50 hover:shadow-elevated transition-shadow">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs text-success font-body font-medium flex items-center gap-0.5">
                  {stat.change} <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingClasses.map((cls, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors"
                >
                  <div className="w-16 text-center">
                    <p className="text-sm font-body font-semibold text-foreground">{cls.time.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{cls.time.split(" ")[1]}</p>
                  </div>
                  <div className="w-1 h-10 rounded-full bg-gold" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-sm text-foreground">{cls.subject}</p>
                    <p className="text-xs text-muted-foreground font-body">{cls.teacher} · {cls.room}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Announcements */}
        <motion.div variants={item}>
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-gold" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      a.priority === "high" ? "bg-destructive" : a.priority === "medium" ? "bg-warning" : "bg-success"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-body font-medium text-foreground leading-tight">{a.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{a.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Grades */}
      <motion.div variants={item}>
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentGrades.map((g, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-body font-semibold text-sm text-foreground">{g.subject}</p>
                    <span className="text-lg font-display font-bold text-gold">{g.grade}</span>
                  </div>
                  <Progress value={(g.score / g.total) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground font-body">{g.score}/{g.total} marks</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
