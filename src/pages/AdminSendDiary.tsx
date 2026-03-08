import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, ALL_CLASSES, classDisplayName, type ClassLevel } from "@/contexts/AuthContext";
import { Send, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSendDiary = () => {
  const { user, addDiaryEntry } = useAuth();
  const [selectedClasses, setSelectedClasses] = useState<ClassLevel[]>([]);
  const [subjects, setSubjects] = useState([{ subject: "", homework: "" }]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const toggleClass = (c: ClassLevel) => {
    setSelectedClasses((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const selectAll = () => {
    setSelectedClasses(selectedClasses.length === ALL_CLASSES.length ? [] : [...ALL_CLASSES]);
  };

  const addSubject = () => setSubjects((prev) => [...prev, { subject: "", homework: "" }]);
  const removeSubject = (i: number) => setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  const updateSubject = (i: number, field: "subject" | "homework", value: string) => {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };

  const handleSend = async () => {
    if (selectedClasses.length === 0) {
      toast({ title: "⚠️ Select at least one class!", variant: "destructive" });
      return;
    }
    const validSubjects = subjects.filter((s) => s.subject.trim() && s.homework.trim());
    if (validSubjects.length === 0) {
      toast({ title: "⚠️ Add at least one subject with homework!", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      await addDiaryEntry({
        date: new Date().toISOString().split("T")[0],
        targetClasses: selectedClasses,
        subjects: validSubjects,
        note: note.trim() || undefined,
        createdBy: user?.name || "Admin",
      });

      setSent(true);
      toast({ title: "✅ Diary sent successfully!" });

      setTimeout(() => {
        setSent(false);
        setSelectedClasses([]);
        setSubjects([{ subject: "", homework: "" }]);
        setNote("");
      }, 2000);
    } catch {
      toast({ title: "❌ Failed to send diary", variant: "destructive" });
    }
    setSending(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">📓 Send Diary</h1>
        <p className="text-muted-foreground font-body">Send homework diary to specific classes.</p>
      </div>

      <Card className="shadow-card border-border/50 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg">🏫 Select Classes</CardTitle>
            <Button variant="outline" size="sm" onClick={selectAll} className="rounded-xl font-body text-xs">
              {selectedClasses.length === ALL_CLASSES.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ALL_CLASSES.map((c) => (
              <button
                key={c}
                onClick={() => toggleClass(c)}
                className={`px-4 py-2 rounded-xl font-body font-bold text-sm transition-all ${
                  selectedClasses.includes(c)
                    ? "gradient-fun text-primary-foreground shadow-card"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {classDisplayName(c)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg">📖 Subjects & Homework</CardTitle>
            <Button variant="outline" size="sm" onClick={addSubject} className="rounded-xl font-body text-xs">
              <Plus className="w-4 h-4 mr-1" /> Add Subject
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-body font-bold text-sm text-foreground">Subject {i + 1}</span>
                {subjects.length > 1 && (
                  <button onClick={() => removeSubject(i)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs font-semibold">Subject Name</Label>
                  <Input placeholder="e.g. Math, English..." value={s.subject} onChange={(e) => updateSubject(i, "subject", e.target.value)} className="rounded-xl font-body mt-1" />
                </div>
                <div>
                  <Label className="font-body text-xs font-semibold">Homework / Task</Label>
                  <Input placeholder="e.g. Do exercise 5.3" value={s.homework} onChange={(e) => updateSubject(i, "homework", e.target.value)} className="rounded-xl font-body mt-1" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">💡 Additional Note (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="e.g. Bring art supplies tomorrow!" value={note} onChange={(e) => setNote(e.target.value)} className="rounded-xl font-body" rows={3} />
        </CardContent>
      </Card>

      <Button
        onClick={handleSend}
        disabled={sent || sending}
        className={`w-full h-14 text-lg font-display font-bold rounded-2xl shadow-elevated transition-all ${
          sent ? "bg-green text-primary-foreground" : "gradient-warm text-primary-foreground hover:opacity-90"
        }`}
        size="lg"
      >
        {sent ? (
          <><CheckCircle2 className="w-6 h-6 mr-2" /> Sent Successfully! ✅</>
        ) : sending ? (
          <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-6 h-6 mr-2" /> Send Diary to {selectedClasses.length > 0 ? `${selectedClasses.length} Class(es)` : "Selected Classes"} 📓</>
        )}
      </Button>
    </motion.div>
  );
};

export default AdminSendDiary;
