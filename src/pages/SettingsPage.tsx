import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Shield, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Settings className="w-6 h-6 text-gold" /> Settings
      </h1>
      <p className="text-muted-foreground font-body">Manage your preferences</p>
    </div>

    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-gold" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Email Notifications", desc: "Receive updates via email", default: true },
          { label: "Assignment Reminders", desc: "Get notified before deadlines", default: true },
          { label: "Grade Alerts", desc: "Notify when new grades are posted", default: true },
          { label: "Attendance Alerts", desc: "Alert on absence records", default: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <Label className="font-body font-medium text-foreground">{s.label}</Label>
              <p className="text-xs text-muted-foreground font-body">{s.desc}</p>
            </div>
            <Switch defaultChecked={s.default} />
          </div>
        ))}
      </CardContent>
    </Card>

    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold" /> Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Show Profile to Classmates", desc: "Others can view your profile", default: true },
          { label: "Show Grades to Parents", desc: "Parents can access your grades", default: true },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <Label className="font-body font-medium text-foreground">{s.label}</Label>
              <p className="text-xs text-muted-foreground font-body">{s.desc}</p>
            </div>
            <Switch defaultChecked={s.default} />
          </div>
        ))}
      </CardContent>
    </Card>
  </motion.div>
);

export default SettingsPage;
