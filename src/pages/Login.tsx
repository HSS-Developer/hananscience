import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, Lock, Mail } from "lucide-react";
import schoolHero from "@/assets/school-hero.jpg";

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
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={schoolHero} alt="HANAN SCIENCE SCHOOL" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-primary opacity-80" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-navy" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-primary-foreground">HANAN</h2>
                <p className="text-sm font-body text-gold-light tracking-widest uppercase">Science School</p>
              </div>
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-primary-foreground leading-tight mb-4">
              Empowering Minds,<br />
              <span className="text-gold">Shaping Futures</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 font-body max-w-md">
              Access your academic portal to track grades, attendance, and stay connected with your school community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-navy" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">HANAN</h2>
              <p className="text-xs font-body text-muted-foreground tracking-widest uppercase">Science School</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-display font-bold text-foreground mb-2">Welcome Back</h3>
            <p className="text-muted-foreground font-body">Sign in to your student portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium font-body">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@hanan.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 font-body"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium font-body">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 font-body"
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
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm font-body"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-body font-semibold gradient-gold text-navy hover:opacity-90 transition-opacity"
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground font-body mb-2">Demo Credentials:</p>
            <p className="text-xs font-body text-foreground"><strong>Student:</strong> student@hanan.edu / student123</p>
            <p className="text-xs font-body text-foreground"><strong>Admin:</strong> admin@hanan.edu / admin123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
