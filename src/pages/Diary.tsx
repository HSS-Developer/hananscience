import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, classDisplayName, getSectionsForClass } from "@/contexts/AuthContext";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Diary = () => {
  const { user, diaryEntries, deleteDiaryEntry } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin" || user?.role === "principal";

  const entries = isAdmin
    ? diaryEntries
    : diaryEntries.filter((d) => {
        if (!user) return false;
        if (!d.targetClasses.includes(user.class)) return false;
        // If sections exist, filter by section too
        if (d.targetSections && d.targetSections.length > 0) {
          const userSection = user.section || "A";
          const sectionKey = `${user.class}-${userSection}`;
          return d.targetSections.includes(sectionKey);
        }
        return true;
      });

  const handleDelete = async (id: string) => {
    try {
      await deleteDiaryEntry(id);
      toast({ title: "🗑️ Diary entry deleted" });
    } catch {
      toast({ title: "❌ Delete failed", variant: "destructive" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">📓 School Diary</h1>
        <p className="text-muted-foreground font-body">
          {isAdmin ? "All diary entries sent to classes" : `Homework & notes for Class ${user?.class}`}
        </p>
      </div>

      {entries.length === 0 ? (
        <Card className="shadow-card border-border/50 rounded-2xl backdrop-blur-sm bg-card/80">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-display font-bold text-lg text-foreground">No Diary Entries Yet!</p>
            <p className="text-muted-foreground font-body mt-1">Check back later for homework updates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-card border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-card/80">
                <div className="h-1.5 gradient-warm" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange" />
                      {new Date(entry.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-wrap">
                        {entry.targetClasses.map((c) => (
                          <span key={c} className="text-[10px] font-body font-bold px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {classDisplayName(c)}
                          </span>
                        ))}
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.subjects.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-foreground font-body">{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-body font-bold text-sm text-foreground">{s.subject}</p>
                        <p className="text-sm text-muted-foreground font-body">{s.homework}</p>
                      </div>
                    </div>
                  ))}
                  {entry.note && (
                    <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                      <p className="text-sm font-body font-semibold text-foreground">💡 Note: {entry.note}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground font-body text-right">— {entry.createdBy}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Diary;
