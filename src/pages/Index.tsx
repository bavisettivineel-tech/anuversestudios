import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-0 w-1/2 h-1/2 bg-gold/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gold/20 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-gold via-gold-light to-gold-dark shadow-[var(--shadow-gold)] mb-6"
            >
              <Sparkles className="w-16 h-16 text-primary-foreground" />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Anuverse Studios
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Premium team management portal. Track attendance, manage tasks, capture leads,
            and collaborate seamlessly.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-12 py-6 h-auto"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            <div className="p-6 rounded-xl bg-glass/50 backdrop-blur-md border border-glass-border shadow-[var(--shadow-glass)] hover:border-gold/30 transition-all">
              <Users className="w-8 h-8 text-gold mb-4 mx-auto" />
              <h3 className="font-semibold text-foreground mb-2">Team Management</h3>
              <p className="text-sm text-muted-foreground">
                Track attendance, assign tasks, and monitor progress in real-time
              </p>
            </div>

            <div className="p-6 rounded-xl bg-glass/50 backdrop-blur-md border border-glass-border shadow-[var(--shadow-glass)] hover:border-gold/30 transition-all">
              <TrendingUp className="w-8 h-8 text-gold mb-4 mx-auto" />
              <h3 className="font-semibold text-foreground mb-2">Lead Capture</h3>
              <p className="text-sm text-muted-foreground">
                Capture and manage leads on the go with integrated forms
              </p>
            </div>

            <div className="p-6 rounded-xl bg-glass/50 backdrop-blur-md border border-glass-border shadow-[var(--shadow-glass)] hover:border-gold/30 transition-all">
              <Shield className="w-8 h-8 text-gold mb-4 mx-auto" />
              <h3 className="font-semibold text-foreground mb-2">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security with role-based access control
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-0 right-0 text-center text-sm text-muted-foreground"
      >
        © 2025 Anuverse Studios. Premium team workspace.
      </motion.footer>
    </div>
  );
};

export default Index;
