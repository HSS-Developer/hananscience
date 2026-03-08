import { useState, useEffect } from "react";
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
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-fun flex items-center justify-center mx-auto mb-4 animate-pulse">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

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
            className="flex items-center gap-4"
          >
            <img src={schoolLogo} alt="HANAN SCIENCE SCHOOL" className="w-20 h-20 rounded-2xl object-contain bg-primary-foreground/95 p-1.5 shadow-fun" />
            <div>
              <h2 className="text-3xl font-display font-bold text-primary-foreground leading-tight">HANAN SCIENCE</h2>
              <p className="text-base font-display font-medium text-primary-foreground/85 tracking-wide">(Kids) School</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-primary-foreground leading-tight mb-3">
              We Promise, ✨<br />
              <span className="text-primary-foreground">We Deliver. 🚀</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-md">
              PG to Class 8 · Quality education with values that last a lifetime.
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
          <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
            <img src={schoolLogo} alt="HANAN SCIENCE SCHOOL" className="w-20 h-20 rounded-2xl object-contain bg-primary-foreground/95 p-1.5 shadow-fun" />
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-foreground">HANAN SCIENCE</h2>
              <p className="text-sm font-display font-medium text-muted-foreground tracking-wide">(Kids) School</p>
              <p className="text-xs font-body font-bold text-foreground mt-1 tracking-wide">We Promise, We Deliver.</p>
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

          <div className="mt-6 text-center">
            <p className="text-xs font-body font-bold text-foreground tracking-wide">
              We Promise, We Deliver.
            </p>
            <p className="text-[10px] text-muted-foreground font-body mt-1">
              HANAN SCIENCE (Kids) SCHOOL · PG to Class 8
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
