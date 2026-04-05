import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, ALL_CLASSES, classDisplayName, getSectionsForClass, type ClassLevel } from "@/contexts/AuthContext";
import { Send, Plus, Trash2, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminSendDiary = () => {
  const { user, addDiaryEntry } = useAuth();
  const [selectedClasses, setSelectedClasses] = useState<ClassLevel[]>([]);
  const [selectedSections, setSelectedSections] = useState<Record<ClassLevel, string[]>>({} as Record<ClassLevel, string[]>);
  const [subjects, setSubjects] = useState([{ subject: "", homework: "" }]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleClass = (c: ClassLevel) => {
    setSelectedClasses((prev) => {
      if (prev.includes(c)) {
        setSelectedSections((s) => { const n = { ...s }; delete n[c]; return n; });
        return prev.filter((x) => x !== c);
      }
      setSelectedSections((s) => ({ ...s, [c]: getSectionsForClass(c) }));
      return [...prev, c];
    });
  };

  const selectAll = () => {
    if (selectedClasses.length === ALL_CLASSES.length) {
      setSelectedClasses([]);
      setSelectedSections({} as Record<ClassLevel, string[]>);
    } else {
      setSelectedClasses([...ALL_CLASSES]);
      const allSections = {} as Record<ClassLevel, string[]>;
      ALL_CLASSES.forEach((c) => { allSections[c] = getSectionsForClass(c); });
      setSelectedSections(allSections);
    }
  };

  const toggleSection = (cls: ClassLevel, section: string) => {
    setSelectedSections((prev) => {
      const current = prev[cls] || [];
      const updated = current.includes(section)
        ? current.filter((s) => s !== section)
        : [...current, section];
      return { ...prev, [cls]: updated };
    });
  };

  const selectAllSections = (cls: ClassLevel) => {
    const allSections = getSectionsForClass(cls);
    const current = selectedSections[cls] || [];
    setSelectedSections((prev) => ({
      ...prev,
      [cls]: current.length === allSections.length ? [] : [...allSections],
    }));
  };

  const allSelectedSections = useMemo(() => {
    const sections: string[] = [];
    selectedClasses.forEach((c) => {
      (selectedSections[c] || []).forEach((s) => {
        const key = `${c}-${s}`;
        if (!sections.includes(key)) sections.push(key);
      });
    });
    return sections;
  }, [selectedClasses, selectedSections]);

  const addSubject = () => setSubjects((prev) => [...prev, { subject: "", homework: "" }]);
  const removeSubject = (i: number) => setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  const updateSubject = (i: number, field: "subject" | "homework", value: string) => {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setAttachments((prev) => [...prev, ...imageFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (selectedClasses.length === 0) {
      toast({ title: "⚠️ Select at least one class!", variant: "destructive" });
      return;
    }
    const hasSection = selectedClasses.some((c) => (selectedSections[c] || []).length > 0);
    if (!hasSection) {
      toast({ title: "⚠️ Select at least one section!", variant: "destructive" });
      return;
    }
    const validSubjects = subjects.filter((s) => s.subject.trim() && s.homework.trim());
    if (validSubjects.length === 0) {
      toast({ title: "⚠️ Add at least one subject with homework!", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      // Create diary entry first
      const { data: session } = await supabase.auth.getSession();
      const { data: newEntry, error } = await supabase
        .from("diary_entries")
        .insert({
          date: new Date().toISOString().split("T")[0],
          target_classes: selectedClasses,
          target_sections: allSelectedSections,
          note: note.trim() || null,
          created_by: user?.name || "Admin",
          created_by_user_id: session?.session?.user?.id || null,
        } as any)
        .select()
        .single();

      if (error || !newEntry) throw error || new Error("Failed to create entry");

      // Insert subjects
      if (validSubjects.length > 0) {
        await supabase.from("diary_subjects").insert(
          validSubjects.map((s) => ({
            diary_entry_id: newEntry.id,
            subject: s.subject,
            homework: s.homework,
          }))
        );
      }

      // Upload attachments
      for (const file of attachments) {
        const ext = file.name.split(".").pop();
        const filePath = `${newEntry.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("diary-attachments")
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("diary-attachments").getPublicUrl(filePath);
          await (supabase.from("diary_attachments" as any) as any).insert({
            diary_entry_id: newEntry.id,
            image_url: urlData.publicUrl,
            file_name: file.name,
          });
        }
      }

      // Refresh diary entries
      await (window as any).__refreshDiary?.();

      setSent(true);
      toast({ title: "✅ Diary sent successfully!" });

      setTimeout(() => {
        setSent(false);
        setSelectedClasses([]);
        setSelectedSections({} as Record<ClassLevel, string[]>);
        setSubjects([{ subject: "", homework: "" }]);
        setNote("");
        setAttachments([]);
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
        <p className="text-muted-foreground font-body">Send homework diary to specific classes & sections.</p>
      </div>

      <Card className="shadow-card border-border/50 rounded-2xl glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg">🏫 Select Classes</CardTitle>
            <Button variant="outline" size="sm" onClick={selectAll} className="rounded-xl font-body text-xs">
              {selectedClasses.length === ALL_CLASSES.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {selectedClasses.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border/30">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">📋 Select Sections</p>
              {selectedClasses.map((cls) => {
                const secs = getSectionsForClass(cls);
                const selected = selectedSections[cls] || [];
                return (
                  <div key={cls} className="p-3 rounded-xl bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-body font-bold text-sm text-foreground">{classDisplayName(cls)}</span>
                      <button
                        onClick={() => selectAllSections(cls)}
                        className="text-[10px] font-body font-semibold text-primary hover:underline"
                      >
                        {selected.length === secs.length ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {secs.map((sec) => (
                        <button
                          key={sec}
                          onClick={() => toggleSection(cls, sec)}
                          className={`px-3 py-1.5 rounded-lg font-body font-semibold text-xs transition-all ${
                            selected.includes(sec)
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-background text-muted-foreground border border-border/50 hover:border-primary/50"
                          }`}
                        >
                          {sec}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50 rounded-2xl glass-card">
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

      {/* Attachments */}
      <Card className="shadow-card border-border/50 rounded-2xl glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">📎 Attach Images (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl font-body"
          >
            <Upload className="w-4 h-4 mr-2" /> Select PNG Images
          </Button>

          {attachments.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {attachments.map((file, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-muted/30 border border-border/30">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-20 object-cover" />
                  <button
                    onClick={() => removeAttachment(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-[8px] font-body text-muted-foreground p-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50 rounded-2xl glass-card">
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
