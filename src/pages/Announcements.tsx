import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, classDisplayName } from "@/contexts/AuthContext";
import { Megaphone, Calendar } from "lucide-react";

const Announcements = () => {
  const { user, announcements } = useAuth();
  const isAdmin = user?.role === "admin";

  const filtered = isAdmin
    ? announcements
    : announcements.filter((a) => user && a.targetClasses.includes(user.class));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">📢 Announcements</h1>
        <p className="text-muted-foreground font-body">
          {isAdmin ? "All announcements sent" : `Notices for Class ${user?.class}`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card rounded-2xl">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-display font-bold text-lg">No Announcements!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-card border-border/50 rounded-2xl overflow-hidden">
                <div className={`h-2 ${a.priority === "high" ? "bg-destructive" : a.priority === "medium" ? "bg-orange" : "bg-green"}`} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground text-lg">{a.title}</h3>
                      <p className="text-sm text-muted-foreground font-body mt-2 leading-relaxed">{a.content}</p>
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {a.date}
                        </span>
                        <span className="text-xs text-muted-foreground font-body">By: {a.createdBy}</span>
                        <div className="flex gap-1 flex-wrap">
                          {a.targetClasses.length === 11 ? (
                            <span className="text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">All Classes</span>
                          ) : (
                            a.targetClasses.slice(0, 4).map((c) => (
                              <span key={c} className="text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {classDisplayName(c)}
                              </span>
                            ))
                          )}
                          {a.targetClasses.length > 4 && a.targetClasses.length !== 11 && (
                            <span className="text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              +{a.targetClasses.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Announcements;
