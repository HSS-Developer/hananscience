import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, Lock, Mail, BookOpen, Star, Sparkles } from "lucide-react";
import schoolHero from "@/assets/school-hero.jpg";
import schoolLogo from "@/assets/school-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password ❌");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={schoolHero} alt="HANAN SCIENCE SCHOOL" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-fun opacity-85" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <img src={schoolLogo} alt="HSc Kids Logo" className="w-16 h-16 rounded-2xl object-contain bg-white/90 p-1 shadow-fun" />
            <div>
              <h2 className="text-2xl font-display font-bold text-primary-foreground">HANAN</h2>
              <p className="text-sm font-body text-primary-foreground/80 tracking-wider">Science School</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-primary-foreground leading-tight mb-4">
              Where Little Minds<br />
              <span className="text-accent">Grow Big! ✨</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-md">
              PG to Class 8 · A place where learning is fun and every child shines bright! 🌟
            </p>

            <div className="flex gap-4 mt-8">
              {[
                { icon: BookOpen, label: "Diary", color: "gradient-warm" },
                { icon: Star, label: "Grades", color: "gradient-fresh" },
                { icon: Sparkles, label: "Activities", color: "gradient-sunset" },
              ].map((f) => (
                <div key={f.label} className={`${f.color} p-3 rounded-2xl flex flex-col items-center gap-1 shadow-fun`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                  <span className="text-xs font-body font-bold text-primary-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Login */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src={schoolLogo} alt="HSc Kids Logo" className="w-12 h-12 rounded-2xl object-contain bg-white/90 p-0.5" />
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">HANAN</h2>
              <p className="text-xs font-body text-muted-foreground tracking-wider">Science School</p>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-3xl font-display font-bold text-foreground mb-2">Welcome Back! 👋</h3>
            <p className="text-muted-foreground font-body">Sign in to your school portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold font-body">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@hanan.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 font-body rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold font-body">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 font-body rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm font-body font-semibold">
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-body font-bold rounded-xl gradient-fun text-primary-foreground hover:opacity-90 transition-opacity shadow-elevated"
              size="lg"
            >
              {loading ? "Signing in... ⏳" : "Sign In 🚀"}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-2xl bg-muted/60 border border-border">
            <p className="text-xs text-muted-foreground font-body mb-2 font-semibold">🔑 Demo Logins:</p>
            <p className="text-xs font-body text-foreground"><strong>Student:</strong> student@hanan.edu / student123</p>
            <p className="text-xs font-body text-foreground"><strong>Admin:</strong> admin@hanan.edu / admin123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
