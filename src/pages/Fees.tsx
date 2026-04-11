import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth, ALL_CLASSES, ClassLevel, classDisplayName } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Plus, Search, Upload, Download, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

interface FeeRecord {
  id: string;
  student_user_id: string;
  student_name: string;
  class: string;
  section: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: "pending" | "paid" | "overdue";
  month: string;
  description: string;
}

const Fees = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin" || user?.role === "principal";
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");

  // Form
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState<ClassLevel>("1");
  const [section, setSection] = useState("A");
  const [amount, setAmount] = useState("2000");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [month, setMonth] = useState(new Date().toLocaleString("en", { month: "long", year: "numeric" }));
  const [description, setDescription] = useState("Monthly Fee");

  // CSV import
  const [importing, setImporting] = useState(false);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fees")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setFees(data as unknown as FeeRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFees(); }, [fetchFees]);

  const handleAdd = async () => {
    if (!studentName || !amount || !month) {
      toast({ title: "❌ Sab fields fill karo!", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("fees").insert({
      student_user_id: user?.id || "",
      student_name: studentName,
      class: studentClass,
      section,
      amount: parseFloat(amount),
      due_date: dueDate,
      status: "pending" as any,
      month,
      description,
    } as any);
    if (error) {
      toast({ title: "❌ Error: " + error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Fee record added!" });
      setStudentName(""); setShowForm(false);
      fetchFees();
    }
    setSaving(false);
  };

  const markPaid = async (id: string) => {
    const { error } = await supabase.from("fees").update({
      status: "paid" as any,
      paid_date: new Date().toISOString().split("T")[0],
    } as any).eq("id", id);
    if (!error) {
      toast({ title: "✅ Fee paid marked!" });
      fetchFees();
    }
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);

    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length < 2) {
      toast({ title: "❌ CSV empty ya invalid hai", variant: "destructive" });
      setImporting(false);
      return;
    }

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const records: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      const row: any = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

      records.push({
        student_user_id: user?.id || "",
        student_name: row["student_name"] || row["name"] || "",
        class: row["class"] || "1",
        section: row["section"] || "A",
        amount: parseFloat(row["amount"] || "0"),
        due_date: row["due_date"] || new Date().toISOString().split("T")[0],
        status: (row["status"] || "pending") as any,
        month: row["month"] || new Date().toLocaleString("en", { month: "long", year: "numeric" }),
        description: row["description"] || "Monthly Fee",
      });
    }

    // Batch insert
    const BATCH = 500;
    let success = 0;
    for (let i = 0; i < records.length; i += BATCH) {
      const batch = records.slice(i, i + BATCH);
      const { error } = await supabase.from("fees").insert(batch as any);
      if (!error) success += batch.length;
    }

    toast({ title: `✅ ${success} fee records imported!` });
    fetchFees();
    setImporting(false);
    e.target.value = "";
  };

  const downloadTemplate = () => {
    const csv = "student_name,class,section,amount,due_date,month,status,description\nAhmed Khan,5,Boys,2000,2026-05-01,May 2026,pending,Monthly Fee\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fee_template.csv";
    a.click();
  };

  const filtered = fees.filter(f => {
    const matchSearch = f.student_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || f.status === filterStatus;
    const matchClass = filterClass === "all" || f.class === filterClass;
    return matchSearch && matchStatus && matchClass;
  });

  const totalPending = fees.filter(f => f.status === "pending").reduce((s, f) => s + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);

  const statusBadge = (status: string) => {
    if (status === "paid") return <Badge className="bg-green-500/15 text-green-700 border-green-200 font-body"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
    if (status === "overdue") return <Badge className="bg-red-500/15 text-red-700 border-red-200 font-body"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</Badge>;
    return <Badge className="bg-orange-500/15 text-orange-700 border-orange-200 font-body"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">💰 Fee Management</h1>
          <p className="text-muted-foreground font-body text-sm">
            {isAdmin ? `Total Records: ${fees.length}` : "Your fee status"}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setShowForm(!showForm)} className="gradient-fun text-primary-foreground rounded-xl font-body font-bold shadow-elevated">
              <Plus className="w-4 h-4 mr-2" /> Add Fee
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
              <Button asChild variant="outline" className="rounded-xl font-body" disabled={importing}>
                <span>{importing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importing...</> : <><Upload className="w-4 h-4 mr-2" />CSV Import</>}</span>
              </Button>
            </label>
            <Button variant="outline" onClick={downloadTemplate} className="rounded-xl font-body">
              <Download className="w-4 h-4 mr-2" /> Template
            </Button>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      {isAdmin && (
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-body font-semibold">Total Records</p>
              <p className="text-2xl font-display font-bold text-foreground">{fees.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-body font-semibold">💚 Paid</p>
              <p className="text-2xl font-display font-bold text-green-600">Rs {totalPaid.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-body font-semibold">🟠 Pending</p>
              <p className="text-2xl font-display font-bold text-orange-600">Rs {totalPending.toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add Form */}
      {showForm && isAdmin && (
        <motion.div variants={item}>
          <Card className="shadow-elevated border-border/50 rounded-2xl">
            <CardHeader><CardTitle className="font-display text-lg">➕ New Fee Record</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Student Name *</Label>
                <Input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Ahmed Khan" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Class</Label>
                <Select value={studentClass} onValueChange={v => setStudentClass(v as ClassLevel)}>
                  <SelectTrigger className="rounded-xl font-body"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_CLASSES.map(c => <SelectItem key={c} value={c}>{classDisplayName(c)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Section</Label>
                <Input value={section} onChange={e => setSection(e.target.value)} className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Amount (Rs) *</Label>
                <Input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Due Date</Label>
                <Input value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Month *</Label>
                <Input value={month} onChange={e => setMonth(e.target.value)} placeholder="April 2026" className="rounded-xl font-body" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm font-semibold">Description</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl font-body" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button onClick={handleAdd} disabled={saving} className="gradient-fun text-primary-foreground rounded-xl font-body font-bold">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "✅ Save"}
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
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student name..." className="pl-10 rounded-xl font-body" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 rounded-xl font-body"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        {isAdmin && (
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-36 rounded-xl font-body"><SelectValue placeholder="All Classes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {ALL_CLASSES.map(c => <SelectItem key={c} value={c}>{classDisplayName(c)}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </motion.div>

      {/* Fee List */}
      <motion.div variants={item} className="space-y-3">
        {loading ? (
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-3 animate-spin" />
              <p className="text-muted-foreground font-body">Loading fees...</p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-body font-semibold">Koi fee record nahi mila</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map(fee => (
            <Card key={fee.id} className="rounded-2xl shadow-card border-border/50 hover:shadow-elevated transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0 shadow-fun">
                    <DollarSign className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-body font-bold text-foreground">{fee.student_name}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      {classDisplayName(fee.class as ClassLevel)} · {fee.section} · {fee.month}
                    </p>
                    <p className="text-sm font-body font-bold text-foreground mt-0.5">Rs {fee.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(fee.status)}
                  {isAdmin && fee.status !== "paid" && (
                    <Button size="sm" onClick={() => markPaid(fee.id)} className="rounded-xl font-body text-xs bg-green-600 hover:bg-green-700 text-white">
                      ✅ Mark Paid
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Fees;
