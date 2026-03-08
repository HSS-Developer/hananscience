import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth, ALL_CLASSES, ClassLevel, classDisplayName } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Trash2, Users, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AdminStudents = () => {
  const { students, addStudent, removeStudent, user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState<ClassLevel>("1");
  const [section, setSection] = useState("A");
  const [rollNumber, setRollNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("student123");

  const handleAdd = async () => {
    if (!name || !email || !rollNumber || !fatherName) {
      toast({ title: "❌ Sab fields fill karo!", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await addStudent({ name, email, class: studentClass, section, rollNumber, fatherName, phone, password });
      toast({ title: "✅ Student add ho gaya!" });
      setName(""); setEmail(""); setRollNumber(""); setFatherName(""); setPhone("");
      setShowForm(false);
    } catch (err: any) {
      toast({ title: "❌ Error: " + (err?.message || "Failed"), variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, studentName: string) => {
    try {
      await removeStudent(id);
      toast({ title: `🗑️ ${studentName} remove ho gaya` });
    } catch {
      toast({ title: "❌ Delete failed", variant: "destructive" });
    }
  };

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "all" || s.class === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">👥 Students Management</h1>
          <p className="text-muted-foreground font-body text-sm">Total: {students.length} students</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-fun text-primary-foreground rounded-xl font-body font-bold shadow-elevated">
          <UserPlus className="w-4 h-4 mr-2" /> Add Student
        </Button>
      </motion.div>

      {showForm && (
        <motion.div variants={item}>
          <Card className="shadow-elevated border-border/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="font-display text-lg">➕ Naya Student Add Karo</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Student Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ahmed Khan" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Email *</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ahmed@hanan.edu" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Class *</Label>
                <Select value={studentClass} onValueChange={(v) => setStudentClass(v as ClassLevel)}>
                  <SelectTrigger className="rounded-xl font-body"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>{classDisplayName(c)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Section</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger className="rounded-xl font-body"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Roll Number *</Label>
                <Input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="HSS-2026-0100" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Father Name *</Label>
                <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Mr. Khan" className="rounded-xl font-body" />
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
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "✅ Save Student"}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl font-body">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or roll number..."
            className="pl-10 rounded-xl font-body"
          />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-40 rounded-xl font-body"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {ALL_CLASSES.map((c) => (
              <SelectItem key={c} value={c}>{classDisplayName(c)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Student List */}
      <motion.div variants={item} className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-body font-semibold">Koi student nahi mila</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((student) => (
            <Card key={student.id} className="rounded-2xl shadow-card border-border/50 hover:shadow-elevated transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold font-body text-sm">{student.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-body font-bold text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      {classDisplayName(student.class)} · Sec {student.section} · {student.rollNumber}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">Father: {student.fatherName}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(student.id, student.name)}
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

export default AdminStudents;
