import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, classDisplayName } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">👤 My Profile</h1>
        <p className="text-muted-foreground font-body">Student information</p>
      </div>

      <Card className="shadow-card border-border/50 rounded-2xl overflow-hidden">
        <div className="h-24 gradient-fun" />
        <CardContent className="p-6 -mt-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl gradient-warm flex items-center justify-center text-3xl font-display font-bold text-primary-foreground shadow-elevated">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-display font-bold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground font-body">
                {classDisplayName(user?.class || "1")} · Section {user?.section || "A"} · {user?.rollNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: "👤", label: "Full Name", value: user?.name || "N/A" },
          { icon: "📧", label: "Email", value: user?.email || "N/A" },
          { icon: "🔢", label: "Roll Number", value: user?.rollNumber || "N/A" },
          { icon: "📚", label: "Class", value: classDisplayName(user?.class || "1") + " - " + (user?.section || "A") },
          { icon: "👨", label: "Father's Name", value: user?.fatherName || "Mr. Hassan Ahmed" },
          { icon: "📞", label: "Contact", value: "+92 300 1234567" },
          { icon: "🏠", label: "Address", value: "Karachi, Pakistan" },
          { icon: "🎂", label: "Date of Birth", value: "May 15, 2017" },
        ].map((item, i) => (
          <Card key={i} className="shadow-card border-border/50 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-body font-semibold text-foreground">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default Profile;
