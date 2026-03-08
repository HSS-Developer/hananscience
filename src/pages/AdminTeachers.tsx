import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AdminTeachers = () => {
  const { teachers, addTeacher, removeTeacher } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("teacher123");

  const handleAdd = async () => {
    if (!name || !email) {
      toast({ title: "❌ Name aur email fill karo!", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await addTeacher({ name, email, phone, password });
      toast({ title: "✅ Teacher add ho gaya!" });
      setName(""); setEmail(""); setPhone(""); setPassword("teacher123");
      setShowForm(false);
    } catch (err: any) {
      toast({ title: "❌ Error: " + (err?.message || "Failed"), variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, teacherName: string) => {
    try {
      await removeTeacher(id);
      toast({ title: `🗑️ ${teacherName} remove ho gaya` });
    } catch {
      toast({ title: "❌ Delete failed", variant: "destructive" });
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">📚 Teachers Management</h1>
          <p className="text-muted-foreground font-body text-sm">Total: {teachers.length} teachers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-fun text-primary-foreground rounded-xl font-body font-bold shadow-elevated">
          <UserPlus className="w-4 h-4 mr-2" /> Add Teacher
        </Button>
      </motion.div>

      {showForm && (
        <motion.div variants={item}>
          <Card className="shadow-elevated border-border/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="font-display text-lg">➕ Naya Teacher Add Karo</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Teacher Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Miss Ayesha" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Email *</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@hanan.edu" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03001234567" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Password</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl font-body" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button onClick={handleAdd} disabled={saving} className="gradient-fun text-primary-foreground rounded-xl font-body font-bold">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "✅ Save Teacher"}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl font-body">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={item} className="space-y-3">
        {teachers.length === 0 ? (
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-body font-semibold">Koi teacher nahi mila</p>
            </CardContent>
          </Card>
        ) : (
          teachers.map((teacher) => (
            <Card key={teacher.id} className="rounded-2xl shadow-card border-border/50 hover:shadow-elevated transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl gradient-fresh flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold font-body text-sm">{teacher.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-body font-bold text-foreground">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{teacher.email}</p>
                    {teacher.phone && <p className="text-xs text-muted-foreground font-body">📞 {teacher.phone}</p>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(teacher.id, teacher.name)}
                  className="text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminTeachers;
