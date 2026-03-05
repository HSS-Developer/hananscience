import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const assignments = [
  { subject: "English", title: "Write 5 sentences about My School", dueDate: "Mar 12", status: "pending", progress: 60 },
  { subject: "Math", title: "Exercise 5.3 Q1-Q10", dueDate: "Mar 10", status: "submitted", progress: 100 },
  { subject: "Science", title: "Draw & label parts of a flower", dueDate: "Mar 15", status: "pending", progress: 0 },
  { subject: "Urdu", title: "Write sabaq 12 question answers", dueDate: "Mar 08", status: "graded", grade: "A", progress: 100 },
  { subject: "Islamiat", title: "Learn Surah Al-Fil with tarjuma", dueDate: "Mar 07", status: "graded", grade: "A+", progress: 100 },
  { subject: "Drawing", title: "Draw your favorite animal", dueDate: "Mar 14", status: "pending", progress: 30 },
];

const statusEmoji = { pending: "⏳", submitted: "📤", graded: "✅" };
const statusLabel = { pending: "In Progress", submitted: "Submitted", graded: "Graded" };

const Assignments = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">📝 Homework & Assignments</h1>
      <p className="text-muted-foreground font-body">Track your work!</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { emoji: "⏳", count: assignments.filter(a => a.status === "pending").length, label: "Pending", color: "gradient-warm" },
        { emoji: "📤", count: assignments.filter(a => a.status === "submitted").length, label: "Submitted", color: "gradient-fun" },
        { emoji: "✅", count: assignments.filter(a => a.status === "graded").length, label: "Graded", color: "gradient-fresh" },
      ].map((s) => (
        <Card key={s.label} className="shadow-card border-border/50 rounded-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-3xl mb-1">{s.emoji}</p>
            <p className="text-3xl font-display font-bold text-foreground">{s.count}</p>
            <p className="text-xs text-muted-foreground font-body font-bold mt-1">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="space-y-3">
      {assignments.map((a, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <Card className="shadow-card border-border/50 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px] font-body rounded-lg">{a.subject}</Badge>
                    <span className="text-xs font-body font-bold">
                      {statusEmoji[a.status as keyof typeof statusEmoji]} {statusLabel[a.status as keyof typeof statusLabel]}
                    </span>
                  </div>
                  <p className="font-body font-bold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground font-body">Due: {a.dueDate}</p>
                </div>
                <div className="sm:w-32 space-y-1">
                  {(a as any).grade && (
                    <p className="text-right text-lg font-display font-bold text-primary">{(a as any).grade}</p>
                  )}
                  <Progress value={a.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default Assignments;
