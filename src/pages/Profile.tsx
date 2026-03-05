import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, Shield } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  const info = [
    { icon: User, label: "Full Name", value: user?.name || "N/A" },
    { icon: Mail, label: "Email", value: user?.email || "N/A" },
    { icon: Hash, label: "Roll Number", value: user?.rollNumber || "N/A" },
    { icon: GraduationCap, label: "Class", value: user?.class || "N/A" },
    { icon: Shield, label: "Role", value: user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || "") },
    { icon: Phone, label: "Phone", value: "+92 300 1234567" },
    { icon: MapPin, label: "Address", value: "Karachi, Pakistan" },
    { icon: Calendar, label: "Date of Birth", value: "January 15, 2010" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground font-body">Personal & academic information</p>
      </div>

      <Card className="shadow-card border-border/50 overflow-hidden">
        <div className="h-28 gradient-primary" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-20 h-20 rounded-xl gradient-gold flex items-center justify-center text-3xl font-display font-bold text-navy shadow-elevated">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="mt-2">
              <h2 className="text-xl font-display font-bold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground font-body">{user?.class} · {user?.rollNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {info.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <item.icon className="w-5 h-5 text-gold flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-body font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Guardian Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Father's Name", value: "Mr. Hassan Ahmed" },
              { label: "Mother's Name", value: "Mrs. Ayesha Hassan" },
              { label: "Guardian Phone", value: "+92 321 9876543" },
              { label: "Emergency Contact", value: "+92 312 5551234" },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-body font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Profile;
