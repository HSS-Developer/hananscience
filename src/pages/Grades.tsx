import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const subjects = [
  { name: "Physics", teacher: "Mr. Rahman", midterm: 88, final: 92, assignments: 95, lab: 90, grade: "A" },
  { name: "Mathematics", teacher: "Mrs. Ali", midterm: 95, final: 98, assignments: 92, lab: 0, grade: "A+" },
  { name: "Chemistry", teacher: "Dr. Syed", midterm: 82, final: 85, assignments: 88, lab: 87, grade: "B+" },
  { name: "Biology", teacher: "Ms. Fatima", midterm: 90, final: 90, assignments: 93, lab: 91, grade: "A" },
  { name: "English", teacher: "Ms. Khan", midterm: 78, final: 82, assignments: 85, lab: 0, grade: "B+" },
  { name: "Urdu", teacher: "Mr. Qasim", midterm: 85, final: 88, assignments: 90, lab: 0, grade: "A-" },
  { name: "Computer Science", teacher: "Mr. Tariq", midterm: 96, final: 94, assignments: 98, lab: 95, grade: "A+" },
  { name: "Islamiat", teacher: "Maulana Yusuf", midterm: 92, final: 90, assignments: 88, lab: 0, grade: "A" },
];

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-success";
  if (grade.startsWith("B")) return "text-gold";
  return "text-warning";
};

const Grades = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">My Grades</h1>
      <p className="text-muted-foreground font-body">Academic Year 2025-2026 · Term 2</p>
    </div>

    <div className="grid gap-4">
      {subjects.map((s, i) => (
        <Card key={i} className="shadow-card border-border/50">
          <CardContent className="p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 sm:w-56">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{s.teacher}</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Midterm</p>
                  <p className="text-lg font-display font-bold text-foreground">{s.midterm}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Final</p>
                  <p className="text-lg font-display font-bold text-foreground">{s.final}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Assignments</p>
                  <p className="text-lg font-display font-bold text-foreground">{s.assignments}%</p>
                </div>
                {s.lab > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Lab</p>
                    <p className="text-lg font-display font-bold text-foreground">{s.lab}%</p>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-right sm:w-20">
                <p className={`text-3xl font-display font-bold ${gradeColor(s.grade)}`}>{s.grade}</p>
              </div>
            </div>
            <Progress value={(s.midterm + s.final + s.assignments) / 3} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </motion.div>
);

export default Grades;
