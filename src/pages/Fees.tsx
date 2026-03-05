import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle2, AlertCircle, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const feeRecords = [
  { month: "March 2026", amount: 15000, status: "pending", dueDate: "Mar 10, 2026" },
  { month: "February 2026", amount: 15000, status: "paid", paidDate: "Feb 08, 2026", receipt: "REC-2026-0214" },
  { month: "January 2026", amount: 15000, status: "paid", paidDate: "Jan 05, 2026", receipt: "REC-2026-0112" },
  { month: "December 2025", amount: 15000, status: "paid", paidDate: "Dec 04, 2025", receipt: "REC-2025-1203" },
  { month: "November 2025", amount: 15000, status: "paid", paidDate: "Nov 06, 2025", receipt: "REC-2025-1105" },
  { month: "October 2025", amount: 15000, status: "paid", paidDate: "Oct 03, 2025", receipt: "REC-2025-1002" },
];

const Fees = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-gold" /> Fee Status
      </h1>
      <p className="text-muted-foreground font-body">Payment history & pending dues</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-foreground">Rs. 15,000</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Monthly Fee</p>
        </CardContent>
      </Card>
      <Card className="shadow-card border-border/50 ring-1 ring-warning/30">
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-warning">Rs. 15,000</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Pending Amount</p>
        </CardContent>
      </Card>
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-success">Rs. 75,000</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Total Paid (This Year)</p>
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {feeRecords.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">{f.month}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {f.status === "paid" ? `Paid on ${f.paidDate}` : `Due: ${f.dueDate}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display font-bold text-foreground">Rs. {f.amount.toLocaleString()}</p>
                {f.status === "paid" ? (
                  <Badge variant="secondary" className="bg-success/10 text-success border-0 font-body">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-0 font-body">
                    <AlertCircle className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default Fees;
