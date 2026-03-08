import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, ALL_CLASSES, classDisplayName, type ClassLevel } from "@/contexts/AuthContext";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSendAnnouncement = () => {
  const { user, addAnnouncement } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<ClassLevel[]>([]);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
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

  const handleSend = async () => {
    if (!title.trim()) { toast({ title: "⚠️ Enter a title!", variant: "destructive" }); return; }
    if (!content.trim()) { toast({ title: "⚠️ Enter the announcement content!", variant: "destructive" }); return; }
    if (selectedClasses.length === 0) { toast({ title: "⚠️ Select at least one class!", variant: "destructive" }); return; }

    setSending(true);
    try {
      await addAnnouncement({
        title, content,
        date: new Date().toISOString().split("T")[0],
        targetClasses: selectedClasses,
        priority,
        createdBy: user?.name || "Admin",
      });

      setSent(true);
      toast({ title: "✅ Announcement sent successfully!" });

      setTimeout(() => {
        setSent(false);
        setTitle(""); setContent(""); setSelectedClasses([]); setPriority("medium");
      }, 2000);
    } catch {
      toast({ title: "❌ Failed to send", variant: "destructive" });
    }
    setSending(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">📢 Send Announcement</h1>
        <p className="text-muted-foreground font-body">Send notices & alerts to specific classes.</p>
      </div>

      <Card className="shadow-card border-border/50 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg">🏫 Target Classes</CardTitle>
            <Button variant="outline" size="sm" onClick={selectAll} className="rounded-xl font-body text-xs">
              {selectedClasses.length === ALL_CLASSES.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ALL_CLASSES.map((c) => (
              <button key={c} onClick={() => toggleClass(c)} className={`px-4 py-2 rounded-xl font-body font-bold text-sm transition-all ${
                selectedClasses.includes(c)
                  ? "gradient-sunset text-primary-foreground shadow-card"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}>
                {classDisplayName(c)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">✍️ Announcement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-body text-sm font-semibold">Title</Label>
            <Input placeholder="e.g. 🎉 Annual Sports Day!" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl font-body mt-1 h-12" />
          </div>
          <div>
            <Label className="font-body text-sm font-semibold">Message</Label>
            <Textarea placeholder="Write your announcement here..." value={content} onChange={(e) => setContent(e.target.value)} className="rounded-xl font-body mt-1" rows={4} />
          </div>
          <div>
            <Label className="font-body text-sm font-semibold">Priority Level</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as "high" | "medium" | "low")}>
              <SelectTrigger className="rounded-xl font-body mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high" className="font-body">🔴 High - Urgent</SelectItem>
                <SelectItem value="medium" className="font-body">🟡 Medium - Important</SelectItem>
                <SelectItem value="low" className="font-body">🟢 Low - General Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSend}
        disabled={sent || sending}
        className={`w-full h-14 text-lg font-display font-bold rounded-2xl shadow-elevated transition-all ${
          sent ? "bg-green text-primary-foreground" : "gradient-sunset text-primary-foreground hover:opacity-90"
        }`}
        size="lg"
      >
        {sent ? (
          <><CheckCircle2 className="w-6 h-6 mr-2" /> Sent Successfully! ✅</>
        ) : sending ? (
          <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-6 h-6 mr-2" /> Send to {selectedClasses.length > 0 ? `${selectedClasses.length} Class(es)` : "Selected Classes"} 📢</>
        )}
      </Button>
    </motion.div>
  );
};

export default AdminSendAnnouncement;
