import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const subjects = [
  { name: "English", teacher: "Ms. Khan", test1: 85, test2: 90, homework: 92, grade: "A" },
  { name: "Mathematics", teacher: "Mrs. Ali", test1: 92, test2: 95, homework: 88, grade: "A+" },
  { name: "Urdu", teacher: "Mr. Qasim", test1: 88, test2: 82, homework: 90, grade: "A-" },
  { name: "Science", teacher: "Ms. Fatima", test1: 78, test2: 85, homework: 80, grade: "B+" },
  { name: "Islamiat", teacher: "Maulana Yusuf", test1: 95, test2: 92, homework: 94, grade: "A+" },
  { name: "Social Studies", teacher: "Mr. Tariq", test1: 80, test2: 78, homework: 85, grade: "B+" },
  { name: "Computer", teacher: "Ms. Nadia", test1: 90, test2: 94, homework: 96, grade: "A+" },
  { name: "Drawing", teacher: "Ms. Hira", test1: 88, test2: 90, homework: 92, grade: "A" },
];

const gradeEmoji = (grade: string) => {
  if (grade.includes("+")) return "🌟";
  if (grade.startsWith("A")) return "⭐";
  if (grade.startsWith("B")) return "👍";
  return "📚";
};

const Grades = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">📊 My Grades</h1>
      <p className="text-muted-foreground font-body">Class 3 · Term 2 Results</p>
    </div>

    <div className="grid gap-3">
      {subjects.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="shadow-card border-border/50 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 sm:w-48">
                  <div className="w-10 h-10 rounded-xl gradient-fun flex items-center justify-center">
                    <span className="text-lg">{gradeEmoji(s.grade)}</span>
                  </div>
                  <div>
                    <p className="font-body font-bold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{s.teacher}</p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-xl bg-muted/40">
                    <p className="text-[10px] text-muted-foreground font-body font-bold uppercase">Test 1</p>
                    <p className="text-lg font-display font-bold text-foreground">{s.test1}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-muted/40">
                    <p className="text-[10px] text-muted-foreground font-body font-bold uppercase">Test 2</p>
                    <p className="text-lg font-display font-bold text-foreground">{s.test2}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-muted/40">
                    <p className="text-[10px] text-muted-foreground font-body font-bold uppercase">H.Work</p>
                    <p className="text-lg font-display font-bold text-foreground">{s.homework}</p>
                  </div>
                </div>
                <div className="text-center sm:w-16">
                  <p className="text-3xl font-display font-bold text-primary">{s.grade}</p>
                </div>
              </div>
              <Progress value={(s.test1 + s.test2 + s.homework) / 3} className="h-1.5 mt-3" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default Grades;
