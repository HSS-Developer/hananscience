import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, classDisplayName, getSectionsForClass, ALL_CLASSES, type ClassLevel } from "@/contexts/AuthContext";
import { Calendar, Trash2, Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DiaryAttachment {
  id: string;
  diary_entry_id: string;
  image_url: string;
  file_name: string;
}

const Diary = () => {
  const { user, diaryEntries, deleteDiaryEntry } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin" || user?.role === "principal";
  const isTeacher = user?.role === "teacher";
  const isStaff = isAdmin || isTeacher;

  // Class/section selector for students
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(user?.class || "PG");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [attachments, setAttachments] = useState<DiaryAttachment[]>([]);

  const sections = getSectionsForClass(selectedClass);

  useEffect(() => {
    setSelectedSection(sections[0] || "A");
  }, [selectedClass]);

  // Fetch all attachments
  useEffect(() => {
    const fetchAttachments = async () => {
      const { data } = await supabase
        .from("diary_attachments" as any)
        .select("*");
      setAttachments((data as any as DiaryAttachment[]) || []);
    };
    fetchAttachments();
  }, [diaryEntries]);

  const entries = isStaff
    ? diaryEntries
    : diaryEntries.filter((d) => {
        if (!d.targetClasses.includes(selectedClass)) return false;
        if (d.targetSections && d.targetSections.length > 0) {
          const sectionKey = `${selectedClass}-${selectedSection}`;
          return d.targetSections.includes(sectionKey);
        }
        return true;
      });

  const getAttachments = (entryId: string) => attachments.filter((a) => a.diary_entry_id === entryId);

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
          {isStaff ? "All diary entries sent to classes" : "Select class & section to view homework"}
        </p>
      </div>

      {/* Class/Section selector for students */}
      {!isStaff && (
        <Card className="shadow-card border-border/50 rounded-2xl glass-card">
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-2">📚 Select Class</p>
              <div className="flex flex-wrap gap-2">
                {ALL_CLASSES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedClass(c)}
                    className={`px-3 py-1.5 rounded-xl font-body font-bold text-xs transition-all ${
                      selectedClass === c
                        ? "gradient-fun text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {classDisplayName(c)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-2">📋 Select Section</p>
              <div className="flex flex-wrap gap-2">
                {sections.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSection(sec)}
                    className={`px-3 py-1.5 rounded-lg font-body font-semibold text-xs transition-all ${
                      selectedSection === sec
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {entries.length === 0 ? (
        <Card className="shadow-card border-border/50 rounded-2xl glass-card">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-display font-bold text-lg text-foreground">No Diary Entries Yet!</p>
            <p className="text-muted-foreground font-body mt-1">Check back later for homework updates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const entryAttachments = getAttachments(entry.id);
            return (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="shadow-card border-border/50 rounded-2xl overflow-hidden glass-card">
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
                          {entry.targetSections && entry.targetSections.length > 0 && entry.targetSections.map((s) => {
                            const [cls, sec] = s.split("-");
                            return (
                              <span key={s} className="text-[10px] font-body font-bold px-2 py-1 rounded-full bg-accent/20 text-accent-foreground">
                                {classDisplayName(cls as any)}-{sec}
                              </span>
                            );
                          })}
                        </div>
                        {isStaff && (
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
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-foreground font-body">{i + 1}</span>
                        </div>
                        <div>
                          <p className="font-body font-bold text-sm text-foreground">{s.subject}</p>
                          <p className="text-sm text-muted-foreground font-body">{s.homework}</p>
                        </div>
                      </div>
                    ))}

                    {/* Attachments */}
                    {entryAttachments.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border/30">
                        <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">📎 Attachments</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {entryAttachments.map((att) => (
                            <div key={att.id} className="rounded-xl overflow-hidden bg-muted/30 border border-border/30">
                              <img src={att.image_url} alt={att.file_name} className="w-full h-32 object-cover" />
                              <div className="p-2 flex items-center justify-between">
                                <span className="text-[10px] font-body text-muted-foreground truncate flex-1">{att.file_name}</span>
                                <a
                                  href={att.image_url}
                                  download={att.file_name}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 ml-1"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.note && (
                      <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                        <p className="text-sm font-body font-semibold text-foreground">💡 Note: {entry.note}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground font-body text-right">— {entry.createdBy}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Diary;
