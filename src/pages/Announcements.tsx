import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Pin, Calendar } from "lucide-react";

const announcements = [
  {
    title: "Annual Science Fair 2026",
    content: "All students from Grade 8-12 are invited to participate in the Annual Science Fair. Registration deadline is March 20th. Projects must be submitted by April 5th.",
    date: "March 15, 2026",
    author: "Principal's Office",
    pinned: true,
    priority: "high",
  },
  {
    title: "Mid-Term Examination Schedule",
    content: "Mid-term examinations will commence from March 25th. Detailed timetable has been shared with class teachers. Students must carry their admit cards.",
    date: "March 10, 2026",
    author: "Examination Department",
    pinned: true,
    priority: "high",
  },
  {
    title: "Sports Day Registration",
    content: "Annual Sports Day will be held on April 10th. Students interested in track & field events should register with their respective PT teacher by March 15th.",
    date: "March 8, 2026",
    author: "Sports Department",
    pinned: false,
    priority: "medium",
  },
  {
    title: "Library Extended Hours",
    content: "The school library will remain open until 5:00 PM during exam preparation weeks. Extra study rooms are available for group study.",
    date: "March 5, 2026",
    author: "Library",
    pinned: false,
    priority: "low",
  },
  {
    title: "Parent-Teacher Meeting",
    content: "PTM for Term 2 will be held on March 22nd from 9 AM to 1 PM. Parents are requested to bring the progress report shared via email.",
    date: "March 3, 2026",
    author: "Administration",
    pinned: false,
    priority: "medium",
  },
  {
    title: "Uniform Policy Reminder",
    content: "Students are reminded to adhere to the school uniform policy. House colors are mandatory on sports days. Lab coats required for all laboratory sessions.",
    date: "March 1, 2026",
    author: "Discipline Committee",
    pinned: false,
    priority: "low",
  },
];

const Announcements = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-gold" /> Announcements
      </h1>
      <p className="text-muted-foreground font-body">Stay updated with school news</p>
    </div>

    <div className="space-y-4">
      {announcements.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className={`shadow-card border-border/50 ${a.pinned ? "ring-1 ring-gold/30" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                {a.pinned && <Pin className="w-4 h-4 text-gold flex-shrink-0 mt-1" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        a.priority === "high" ? "bg-destructive" : a.priority === "medium" ? "bg-warning" : "bg-success"
                      }`}
                    />
                    <h3 className="font-display font-semibold text-foreground">{a.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">{a.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
                    <span>{a.author}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default Announcements;
