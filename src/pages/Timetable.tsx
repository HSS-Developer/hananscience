import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const timetable: Record<string, { time: string; subject: string; teacher: string }[]> = {
  Monday: [
    { time: "08:00 - 08:40", subject: "🕌 Assembly + Quran", teacher: "" },
    { time: "08:40 - 09:20", subject: "English", teacher: "Ms. Khan" },
    { time: "09:25 - 10:05", subject: "Math", teacher: "Mrs. Ali" },
    { time: "10:05 - 10:25", subject: "🍎 Break", teacher: "" },
    { time: "10:25 - 11:05", subject: "Urdu", teacher: "Mr. Qasim" },
    { time: "11:10 - 11:50", subject: "Science", teacher: "Ms. Fatima" },
    { time: "11:55 - 12:35", subject: "Islamiat", teacher: "Maulana Yusuf" },
    { time: "12:35 - 01:00", subject: "🎨 Drawing", teacher: "Ms. Hira" },
  ],
  Tuesday: [
    { time: "08:00 - 08:40", subject: "🕌 Assembly + Quran", teacher: "" },
    { time: "08:40 - 09:20", subject: "Math", teacher: "Mrs. Ali" },
    { time: "09:25 - 10:05", subject: "English", teacher: "Ms. Khan" },
    { time: "10:05 - 10:25", subject: "🍎 Break", teacher: "" },
    { time: "10:25 - 11:05", subject: "Science", teacher: "Ms. Fatima" },
    { time: "11:10 - 11:50", subject: "Social Studies", teacher: "Mr. Tariq" },
    { time: "11:55 - 12:35", subject: "Urdu", teacher: "Mr. Qasim" },
    { time: "12:35 - 01:00", subject: "💻 Computer", teacher: "Ms. Nadia" },
  ],
  Wednesday: [
    { time: "08:00 - 08:40", subject: "🕌 Assembly + Quran", teacher: "" },
    { time: "08:40 - 09:20", subject: "Islamiat", teacher: "Maulana Yusuf" },
    { time: "09:25 - 10:05", subject: "Math", teacher: "Mrs. Ali" },
    { time: "10:05 - 10:25", subject: "🍎 Break", teacher: "" },
    { time: "10:25 - 11:05", subject: "English", teacher: "Ms. Khan" },
    { time: "11:10 - 11:50", subject: "Urdu", teacher: "Mr. Qasim" },
    { time: "11:55 - 12:35", subject: "Science", teacher: "Ms. Fatima" },
    { time: "12:35 - 01:00", subject: "🏃 P.T.", teacher: "Sir Aslam" },
  ],
  Thursday: [
    { time: "08:00 - 08:40", subject: "🕌 Assembly + Quran", teacher: "" },
    { time: "08:40 - 09:20", subject: "English", teacher: "Ms. Khan" },
    { time: "09:25 - 10:05", subject: "Social Studies", teacher: "Mr. Tariq" },
    { time: "10:05 - 10:25", subject: "🍎 Break", teacher: "" },
    { time: "10:25 - 11:05", subject: "Math", teacher: "Mrs. Ali" },
    { time: "11:10 - 11:50", subject: "Computer", teacher: "Ms. Nadia" },
    { time: "11:55 - 12:35", subject: "Islamiat", teacher: "Maulana Yusuf" },
    { time: "12:35 - 01:00", subject: "🎨 Drawing", teacher: "Ms. Hira" },
  ],
  Friday: [
    { time: "08:00 - 08:40", subject: "🕌 Assembly + Quran", teacher: "" },
    { time: "08:40 - 09:20", subject: "Math", teacher: "Mrs. Ali" },
    { time: "09:25 - 10:05", subject: "Urdu", teacher: "Mr. Qasim" },
    { time: "10:05 - 10:25", subject: "🍎 Break", teacher: "" },
    { time: "10:25 - 11:05", subject: "Science", teacher: "Ms. Fatima" },
    { time: "11:05 - 11:30", subject: "🕌 Juma Prayer", teacher: "" },
  ],
  Saturday: [
    { time: "08:00 - 08:40", subject: "🕌 Assembly + Quran", teacher: "" },
    { time: "08:40 - 09:20", subject: "English", teacher: "Ms. Khan" },
    { time: "09:25 - 10:05", subject: "Math", teacher: "Mrs. Ali" },
    { time: "10:05 - 10:25", subject: "🍎 Break", teacher: "" },
    { time: "10:25 - 11:05", subject: "Islamiat", teacher: "Maulana Yusuf" },
    { time: "11:10 - 11:50", subject: "Drawing / Activity", teacher: "Ms. Hira" },
  ],
};

const Timetable = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">📅 Timetable</h1>
      <p className="text-muted-foreground font-body">Class 3 · Section A</p>
    </div>

    <Tabs defaultValue="Monday">
      <TabsList className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-2xl">
        {Object.keys(timetable).map((day) => (
          <TabsTrigger
            key={day}
            value={day}
            className="font-body text-sm rounded-xl data-[state=active]:gradient-fun data-[state=active]:text-primary-foreground"
          >
            {day.slice(0, 3)}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(timetable).map(([day, classes]) => (
        <TabsContent key={day} value={day} className="mt-4">
          <Card className="shadow-card border-border/50 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {classes.map((cls, i) => {
                const isBreak = cls.subject.includes("Break") || cls.subject.includes("Prayer") || cls.subject.includes("Assembly");
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-3 rounded-xl ${
                      isBreak ? "bg-accent/10" : "bg-muted/40"
                    }`}
                  >
                    <div className="w-28">
                      <p className="text-xs font-body font-bold text-foreground">{cls.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className={`font-body font-bold text-sm ${isBreak ? "text-accent-foreground" : "text-foreground"}`}>
                        {cls.subject}
                      </p>
                      {cls.teacher && <p className="text-xs text-muted-foreground font-body">{cls.teacher}</p>}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  </motion.div>
);

export default Timetable;
