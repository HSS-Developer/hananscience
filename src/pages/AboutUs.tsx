import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, GraduationCap, Users, BookOpen, Award, Globe, Heart } from "lucide-react";
import schoolLogo from "@/assets/school-logo.png";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const AboutUs = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div variants={item}>
        <div className="relative p-8 lg:p-12 rounded-3xl gradient-fun shadow-elevated overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 text-8xl">🏫</div>
            <div className="absolute bottom-4 left-8 text-6xl">📚</div>
            <div className="absolute top-1/2 right-1/3 text-5xl">⭐</div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <img src={schoolLogo} alt="HANAN SCIENCE SCHOOL" className="w-24 h-24 rounded-2xl object-contain bg-white/90 p-2 shadow-fun flex-shrink-0" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground leading-tight">
                HANAN SCIENCE (Kids) SCHOOL
              </h1>
              <p className="text-primary-foreground/80 font-body text-lg mt-2">
                Where Little Minds Grow Big! ✨
              </p>
              <p className="text-primary-foreground/60 font-body text-sm mt-1">
                Established for Excellence in Education · PG to Class 8
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div variants={item}>
        <Card className="shadow-card border-border/40 rounded-3xl glass-card overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink" /> About Our School
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">HANAN SCIENCE (Kids) SCHOOL</strong> is a leading educational institution 
                dedicated to providing quality education from Play Group (PG) to Class 8. We believe every child has the 
                potential to shine, and our mission is to nurture young minds with knowledge, discipline, and moral values.
              </p>
              <p>
                Under the visionary leadership of <strong className="text-foreground">Miss. Shamila (Principal)</strong>, 
                our school has been committed to academic excellence, character building, and holistic development. We combine 
                modern teaching methods with traditional values to create an environment where students thrive.
              </p>
              <p>
                Our curriculum covers English, Urdu, Mathematics, Science, Islamiat, Social Studies, Computer Science, 
                and creative activities including Drawing and Physical Education. We focus on building strong foundations 
                that prepare students for future academic success.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: GraduationCap, label: "Classes", value: "PG - 8", color: "gradient-fun" },
          { icon: Users, label: "Happy Students", value: "500+", color: "gradient-warm" },
          { icon: BookOpen, label: "Subjects", value: "10+", color: "gradient-fresh" },
          { icon: Award, label: "Years of Trust", value: "10+", color: "gradient-sunset" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card border-border/40 rounded-2xl glass-card overflow-hidden hover:shadow-elevated transition-all hover:scale-[1.02]">
            <CardContent className="p-5 text-center">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-fun`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body font-semibold mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Our Values */}
      <motion.div variants={item}>
        <Card className="shadow-card border-border/40 rounded-3xl glass-card overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-5 flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky" /> Our Values & Vision
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { emoji: "📖", title: "Quality Education", desc: "Strong academic foundation with modern teaching methods" },
                { emoji: "🕌", title: "Islamic Values", desc: "Quran education and moral character building" },
                { emoji: "🎨", title: "Creative Learning", desc: "Art, activities & sports for holistic development" },
                { emoji: "💡", title: "Future Ready", desc: "Computer skills and critical thinking for tomorrow" },
                { emoji: "🤝", title: "Parent Partnership", desc: "Regular updates through digital diary & notices" },
                { emoji: "🌟", title: "Individual Attention", desc: "Small class sizes for personalized learning" },
              ].map((v) => (
                <div key={v.title} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/30 hover:bg-muted/50 transition-colors">
                  <span className="text-2xl flex-shrink-0">{v.emoji}</span>
                  <div>
                    <p className="font-body font-bold text-sm text-foreground">{v.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={item}>
        <Card className="shadow-elevated border-border/40 rounded-3xl overflow-hidden">
          <div className="h-2 gradient-sunset" />
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-5 flex items-center gap-2">
              📞 Contact Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: "Address", value: "HANAN SCIENCE (Kids) SCHOOL, Near Main Road, Karachi, Pakistan", color: "text-destructive" },
                { icon: Phone, label: "Phone", value: "+92 300 1234567 / +92 21 1234567", color: "text-green" },
                { icon: Mail, label: "Email", value: "info@hananscience.edu.pk", color: "text-sky" },
                { icon: Clock, label: "School Timing", value: "Monday - Saturday: 8:00 AM - 1:00 PM", color: "text-orange" },
              ].map((info) => (
                <div key={info.label} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/30">
                  <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center flex-shrink-0">
                    <info.icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-wider">{info.label}</p>
                    <p className="text-sm font-body font-semibold text-foreground mt-0.5">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Principal Message */}
      <motion.div variants={item}>
        <Card className="shadow-card border-border/40 rounded-3xl glass-card overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              👑 Principal's Message
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-16 h-16 rounded-2xl gradient-fun flex items-center justify-center text-2xl font-display font-bold text-primary-foreground shadow-fun flex-shrink-0">
                MS
              </div>
              <div className="font-body text-muted-foreground leading-relaxed">
                <p className="italic">
                  "At HANAN SCIENCE SCHOOL, we are committed to providing an environment where every child feels valued, 
                  inspired, and empowered to reach their full potential. Education is not just about books — it's about 
                  building character, confidence, and compassion. We welcome every family to be part of our growing community."
                </p>
                <p className="font-bold text-foreground mt-3">— Miss. Shamila</p>
                <p className="text-xs text-muted-foreground">Principal, HANAN SCIENCE (Kids) SCHOOL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-xs text-muted-foreground font-body">
          © 2026 HANAN SCIENCE (Kids) SCHOOL · All Rights Reserved
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;
