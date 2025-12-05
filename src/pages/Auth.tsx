import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, LogIn, UserPlus, Briefcase, Code, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>("marketing_manager");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
      setCheckingSession(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name,
              role,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              user_id: data.user.id,
              name,
            });

          if (profileError && !profileError.message.includes("duplicate")) {
            console.error("Profile creation error:", profileError);
          }

          // Assign role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: data.user.id,
              role,
            });

          if (roleError && !roleError.message.includes("duplicate")) {
            console.error("Role assignment error:", roleError);
          }

          toast({
            title: "Account created!",
            description: `Welcome to Anuverse Studios as ${role === "marketing_manager" ? "Marketing Manager" : role === "admin" ? "Admin" : "Coder"}`,
          });
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = error.message;
      
      if (error.message.includes("User already registered")) {
        message = "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("Invalid login credentials")) {
        message = "Invalid email or password. Please try again.";
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gold/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gold/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold via-gold-light to-gold-dark shadow-[var(--shadow-gold)] mb-4"
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent mb-2">
            Anuverse Studios
          </h1>
          <p className="text-muted-foreground">Premium Team Portal</p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 bg-glass/50 backdrop-blur-xl border-glass-border shadow-[var(--shadow-glass)]">
          <div className="flex gap-2 mb-6">
            <Button
              variant={isLogin ? "gold" : "ghost"}
              size="sm"
              onClick={() => setIsLogin(true)}
              className="flex-1"
              disabled={loading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              variant={!isLogin ? "gold" : "ghost"}
              size="sm"
              onClick={() => setIsLogin(false)}
              className="flex-1"
              disabled={loading}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background/50 border-border"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@anuverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="bg-background/50 border-border"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("marketing_manager")}
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === "marketing_manager"
                        ? "border-gold bg-gold/10 shadow-[var(--shadow-gold)]"
                        : "border-border bg-background/30 hover:border-gold/50"
                    }`}
                  >
                    <Briefcase className={`w-6 h-6 mx-auto mb-2 ${role === "marketing_manager" ? "text-gold" : "text-muted-foreground"}`} />
                    <p className="text-sm font-medium">Marketing</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("coder")}
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === "coder"
                        ? "border-gold bg-gold/10 shadow-[var(--shadow-gold)]"
                        : "border-border bg-background/30 hover:border-gold/50"
                    }`}
                  >
                    <Code className={`w-6 h-6 mx-auto mb-2 ${role === "coder" ? "text-gold" : "text-muted-foreground"}`} />
                    <p className="text-sm font-medium">Coder</p>
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Premium workspace for Anuverse team members
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
