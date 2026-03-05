import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const assignments = [
  { subject: "Physics", title: "Electromagnetic Waves Report", dueDate: "Mar 12, 2026", status: "pending", progress: 60 },
  { subject: "Mathematics", title: "Calculus Problem Set #8", dueDate: "Mar 10, 2026", status: "submitted", progress: 100 },
  { subject: "Chemistry", title: "Organic Reactions Lab Report", dueDate: "Mar 15, 2026", status: "pending", progress: 30 },
  { subject: "English", title: "Essay: Climate Change Impact", dueDate: "Mar 08, 2026", status: "graded", grade: "A-", progress: 100 },
  { subject: "Computer Science", title: "Python Sorting Algorithm", dueDate: "Mar 07, 2026", status: "graded", grade: "A+", progress: 100 },
  { subject: "Biology", title: "Genetics Worksheet", dueDate: "Mar 14, 2026", status: "pending", progress: 0 },
  { subject: "Islamiat", title: "Surah Tafseer Notes", dueDate: "Mar 06, 2026", status: "graded", grade: "A", progress: 100 },
  { subject: "Urdu", title: "Ghazal Analysis Essay", dueDate: "Mar 11, 2026", status: "pending", progress: 45 },
];

const statusConfig = {
  pending: { icon: Clock, cls: "bg-warning/10 text-warning", label: "In Progress" },
  submitted: { icon: CheckCircle2, cls: "bg-teal/10 text-teal", label: "Submitted" },
  graded: { icon: CheckCircle2, cls: "bg-success/10 text-success", label: "Graded" },
  overdue: { icon: AlertTriangle, cls: "bg-destructive/10 text-destructive", label: "Overdue" },
};

const Assignments = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <FileText className="w-6 h-6 text-gold" /> Assignments
      </h1>
      <p className="text-muted-foreground font-body">Track your coursework and submissions</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-warning">{assignments.filter(a => a.status === "pending").length}</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Pending</p>
        </CardContent>
      </Card>
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-teal">{assignments.filter(a => a.status === "submitted").length}</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Submitted</p>
        </CardContent>
      </Card>
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-success">{assignments.filter(a => a.status === "graded").length}</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Graded</p>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-3">
      {assignments.map((a, i) => {
        const config = statusConfig[a.status as keyof typeof statusConfig];
        return (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] font-body">{a.subject}</Badge>
                      <Badge className={`${config.cls} border-0 text-[10px] font-body`}>
                        <config.icon className="w-3 h-3 mr-1" />{config.label}
                      </Badge>
                    </div>
                    <p className="font-body font-semibold text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground font-body">Due: {a.dueDate}</p>
                  </div>
                  <div className="sm:w-40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-body">Progress</span>
                      {a.grade && <span className="text-sm font-display font-bold text-gold">{a.grade}</span>}
                    </div>
                    <Progress value={a.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

export default Assignments;
