import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

const timetable: Record<string, { time: string; subject: string; teacher: string; room: string }[]> = {
  Monday: [
    { time: "08:30 - 09:15", subject: "Physics", teacher: "Mr. Rahman", room: "Lab 201" },
    { time: "09:20 - 10:05", subject: "Mathematics", teacher: "Mrs. Ali", room: "Room 105" },
    { time: "10:15 - 11:00", subject: "Chemistry", teacher: "Dr. Syed", room: "Lab 302" },
    { time: "11:05 - 11:50", subject: "English", teacher: "Ms. Khan", room: "Room 110" },
    { time: "12:30 - 01:15", subject: "Biology", teacher: "Ms. Fatima", room: "Lab 103" },
    { time: "01:20 - 02:05", subject: "Urdu", teacher: "Mr. Qasim", room: "Room 108" },
  ],
  Tuesday: [
    { time: "08:30 - 09:15", subject: "Mathematics", teacher: "Mrs. Ali", room: "Room 105" },
    { time: "09:20 - 10:05", subject: "Computer Science", teacher: "Mr. Tariq", room: "IT Lab" },
    { time: "10:15 - 11:00", subject: "Physics", teacher: "Mr. Rahman", room: "Lab 201" },
    { time: "11:05 - 11:50", subject: "Islamiat", teacher: "Maulana Yusuf", room: "Room 112" },
    { time: "12:30 - 01:15", subject: "Chemistry", teacher: "Dr. Syed", room: "Lab 302" },
    { time: "01:20 - 02:05", subject: "English", teacher: "Ms. Khan", room: "Room 110" },
  ],
  Wednesday: [
    { time: "08:30 - 09:15", subject: "Biology", teacher: "Ms. Fatima", room: "Lab 103" },
    { time: "09:20 - 10:05", subject: "Physics", teacher: "Mr. Rahman", room: "Lab 201" },
    { time: "10:15 - 11:00", subject: "Urdu", teacher: "Mr. Qasim", room: "Room 108" },
    { time: "11:05 - 11:50", subject: "Mathematics", teacher: "Mrs. Ali", room: "Room 105" },
    { time: "12:30 - 01:15", subject: "Computer Science", teacher: "Mr. Tariq", room: "IT Lab" },
    { time: "01:20 - 02:05", subject: "Islamiat", teacher: "Maulana Yusuf", room: "Room 112" },
  ],
  Thursday: [
    { time: "08:30 - 09:15", subject: "Chemistry", teacher: "Dr. Syed", room: "Lab 302" },
    { time: "09:20 - 10:05", subject: "English", teacher: "Ms. Khan", room: "Room 110" },
    { time: "10:15 - 11:00", subject: "Biology", teacher: "Ms. Fatima", room: "Lab 103" },
    { time: "11:05 - 11:50", subject: "Physics", teacher: "Mr. Rahman", room: "Lab 201" },
    { time: "12:30 - 01:15", subject: "Mathematics", teacher: "Mrs. Ali", room: "Room 105" },
    { time: "01:20 - 02:05", subject: "Urdu", teacher: "Mr. Qasim", room: "Room 108" },
  ],
  Friday: [
    { time: "08:30 - 09:15", subject: "Islamiat", teacher: "Maulana Yusuf", room: "Room 112" },
    { time: "09:20 - 10:05", subject: "Computer Science", teacher: "Mr. Tariq", room: "IT Lab" },
    { time: "10:15 - 11:00", subject: "Mathematics", teacher: "Mrs. Ali", room: "Room 105" },
    { time: "11:05 - 11:50", subject: "Chemistry", teacher: "Dr. Syed", room: "Lab 302" },
  ],
};

const subjectColors: Record<string, string> = {
  Physics: "border-l-teal",
  Mathematics: "border-l-gold",
  Chemistry: "border-l-destructive",
  Biology: "border-l-success",
  English: "border-l-accent",
  Urdu: "border-l-navy-light",
  "Computer Science": "border-l-ring",
  Islamiat: "border-l-muted-foreground",
};

const Timetable = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Calendar className="w-6 h-6 text-gold" /> Class Timetable
      </h1>
      <p className="text-muted-foreground font-body">Grade 10 - Science · Term 2</p>
    </div>

    <Tabs defaultValue="Monday">
      <TabsList className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg">
        {Object.keys(timetable).map((day) => (
          <TabsTrigger
            key={day}
            value={day}
            className="font-body text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {day}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(timetable).map(([day, classes]) => (
        <TabsContent key={day} value={day} className="mt-4">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">{day}'s Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {classes.map((cls, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-lg bg-muted/30 border-l-4 ${
                    subjectColors[cls.subject] || "border-l-border"
                  }`}
                >
                  <div className="w-28">
                    <p className="text-sm font-body font-semibold text-foreground">{cls.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-body font-semibold text-foreground">{cls.subject}</p>
                    <p className="text-xs text-muted-foreground font-body">{cls.teacher} · {cls.room}</p>
                  </div>
                </div>
              ))}
              {day === "Friday" && (
                <p className="text-sm text-muted-foreground font-body text-center py-4">
                  🕌 Friday prayers & early dismissal after 4th period
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  </motion.div>
);

export default Timetable;
