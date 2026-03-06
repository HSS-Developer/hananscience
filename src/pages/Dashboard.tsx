import { motion } from "framer-motion";
import { useAuth, classDisplayName } from "@/contexts/AuthContext";
import { BookOpen, ClipboardCheck, Trophy, TrendingUp, Calendar, Megaphone, Clock, BookMarked } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Dashboard = () => {
  const { user, diaryEntries, announcements } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin" || user?.role === "principal";

  // Filter diary/announcements for student's class
  const myDiary = diaryEntries.filter((d) => user && d.targetClasses.includes(user.class));
  // removed unused variable
  const studentAnnouncements = isAdmin ? announcements : announcements.filter((a) => user && a.targetClasses.includes(user.class));
  const todayDiary = myDiary.find((d) => d.date === "2026-03-05");

  const stats = isAdmin
    ? [
        { label: "Total Classes", value: "11", emoji: "🏫", color: "gradient-fun" },
        { label: "Diary Sent Today", value: diaryEntries.filter((d) => d.date === "2026-03-05").length.toString(), emoji: "📓", color: "gradient-warm" },
        { label: "Active Notices", value: announcements.length.toString(), emoji: "📢", color: "gradient-fresh" },
        { label: "School Level", value: "PG - 8", emoji: "🎓", color: "gradient-sunset" },
      ]
    : [
        { label: "My Class", value: classDisplayName(user?.class || "1"), emoji: "📚", color: "gradient-fun" },
        { label: "Attendance", value: "94%", emoji: "✅", color: "gradient-fresh" },
        { label: "Today's HW", value: todayDiary ? `${todayDiary.subjects.length} subjects` : "None", emoji: "📝", color: "gradient-warm" },
        { label: "Notices", value: studentAnnouncements.length.toString(), emoji: "📢", color: "gradient-sunset" },
      ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item}>
        <div className="p-6 rounded-2xl gradient-fun shadow-elevated">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground">
            {isAdmin ? (user?.role === "principal" ? "Welcome, Principal! 👑" : "Welcome, Admin! 🛡️") : `Assalam-o-Alaikum, ${user?.name?.split(" ")[0]}! 🌟`}
          </h1>
          <p className="text-primary-foreground/80 font-body mt-1">
            {isAdmin
              ? "Manage diary, announcements and alerts for all classes"
              : `${classDisplayName(user?.class || "1")} · Section ${user?.section || "A"} · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-border/50 hover:shadow-elevated transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-4 lg:p-5">
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-1 font-semibold">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Admin Quick Actions */}
      {isAdmin && (
        <motion.div variants={item} className="grid sm:grid-cols-2 gap-4">
          <Card
            className="shadow-card border-border/50 rounded-2xl cursor-pointer hover:shadow-elevated transition-all hover:scale-[1.02]"
            onClick={() => navigate("/admin/diary")}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center shadow-fun">
                <BookMarked className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">Send Diary 📓</h3>
                <p className="text-sm text-muted-foreground font-body">Send homework diary to any class</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="shadow-card border-border/50 rounded-2xl cursor-pointer hover:shadow-elevated transition-all hover:scale-[1.02]"
            onClick={() => navigate("/admin/announcement")}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-sunset flex items-center justify-center shadow-fun">
                <Megaphone className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">Send Notice 📢</h3>
                <p className="text-sm text-muted-foreground font-body">Send announcements & alerts to classes</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Diary */}
        {!isAdmin && (
          <motion.div variants={item}>
            <Card className="shadow-card border-border/50 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  📓 Today's Diary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayDiary ? (
                  <div className="space-y-3">
                    {todayDiary.subjects.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                        <span className="text-lg">📖</span>
                        <div>
                          <p className="font-body font-bold text-sm text-foreground">{s.subject}</p>
                          <p className="text-sm text-muted-foreground font-body">{s.homework}</p>
                        </div>
                      </div>
                    ))}
                    {todayDiary.note && (
                      <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                        <p className="text-sm font-body font-semibold text-foreground">💡 {todayDiary.note}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground font-body py-6">No diary for today! 🎉</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Announcements */}
        <motion.div variants={item}>
          <Card className="shadow-card border-border/50 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                📢 Latest Notices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {studentAnnouncements.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      a.priority === "high" ? "bg-destructive" : a.priority === "medium" ? "bg-orange" : "bg-green"
                    }`}
                  />
                  <div>
                    <p className="font-body font-bold text-sm text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{a.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
