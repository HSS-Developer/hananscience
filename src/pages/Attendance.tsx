import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, CheckCircle2, XCircle, Clock } from "lucide-react";

const monthlyData = [
  { month: "September", present: 22, absent: 2, late: 1, total: 25 },
  { month: "October", present: 20, absent: 1, late: 2, total: 23 },
  { month: "November", present: 19, absent: 3, late: 0, total: 22 },
  { month: "December", present: 15, absent: 0, late: 1, total: 16 },
  { month: "January", present: 21, absent: 1, late: 1, total: 23 },
  { month: "February", present: 18, absent: 2, late: 0, total: 20 },
  { month: "March", present: 3, absent: 0, late: 0, total: 3 },
];

const totalPresent = monthlyData.reduce((a, m) => a + m.present, 0);
const totalAbsent = monthlyData.reduce((a, m) => a + m.absent, 0);
const totalLate = monthlyData.reduce((a, m) => a + m.late, 0);
const totalDays = monthlyData.reduce((a, m) => a + m.total, 0);
const percentage = ((totalPresent / totalDays) * 100).toFixed(1);

const recentDays = [
  { date: "Mar 5", day: "Wednesday", status: "present" },
  { date: "Mar 4", day: "Tuesday", status: "present" },
  { date: "Mar 3", day: "Monday", status: "present" },
  { date: "Feb 28", day: "Friday", status: "absent" },
  { date: "Feb 27", day: "Thursday", status: "present" },
  { date: "Feb 26", day: "Wednesday", status: "present" },
  { date: "Feb 25", day: "Tuesday", status: "late" },
  { date: "Feb 24", day: "Monday", status: "present" },
];

const Attendance = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">Attendance</h1>
      <p className="text-muted-foreground font-body">Academic Year 2025-2026</p>
    </div>

    {/* Summary */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Overall", value: `${percentage}%`, icon: ClipboardCheck, cls: "text-gold" },
        { label: "Present", value: totalPresent, icon: CheckCircle2, cls: "text-success" },
        { label: "Absent", value: totalAbsent, icon: XCircle, cls: "text-destructive" },
        { label: "Late", value: totalLate, icon: Clock, cls: "text-warning" },
      ].map((s) => (
        <Card key={s.label} className="shadow-card border-border/50">
          <CardContent className="p-4">
            <s.icon className={`w-8 h-8 ${s.cls} mb-2`} />
            <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground font-body">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Monthly Breakdown */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {monthlyData.map((m) => (
            <div key={m.month} className="flex items-center gap-3">
              <p className="w-24 text-sm font-body font-medium text-foreground">{m.month}</p>
              <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-success/70 transition-all"
                  style={{ width: `${(m.present / m.total) * 100}%` }}
                />
                <div
                  className="h-full bg-warning/70 transition-all"
                  style={{ width: `${(m.late / m.total) * 100}%` }}
                />
                <div
                  className="h-full bg-destructive/70 transition-all"
                  style={{ width: `${(m.absent / m.total) * 100}%` }}
                />
              </div>
              <p className="w-12 text-right text-xs text-muted-foreground font-body">
                {((m.present / m.total) * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Recent Days</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentDays.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-body font-semibold text-foreground">{d.date}</p>
                <p className="text-xs text-muted-foreground font-body">{d.day}</p>
              </div>
              <span
                className={`text-xs font-body font-semibold px-3 py-1 rounded-full ${
                  d.status === "present"
                    ? "bg-success/10 text-success"
                    : d.status === "absent"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </motion.div>
);

export default Attendance;
