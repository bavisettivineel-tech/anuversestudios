import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Camera,
  CheckCircle2,
  MapPin,
  Plus,
  LogOut,
  Sparkles,
  Users,
  FileText,
  TrendingUp,
  Code2,
  GitBranch,
  Upload,
} from "lucide-react";
import AttendanceMarker from "@/components/AttendanceMarker";
import TaskList from "@/components/TaskList";
import LeadForm from "@/components/LeadForm";

interface User {
  email: string;
  name: string;
  role: "marketing_manager" | "coder";
  authenticated: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (!user) return null;

  const isMarketing = user.role === "marketing_manager";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border/50 bg-glass/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold via-gold-light to-gold-dark flex items-center justify-center shadow-[var(--shadow-gold)]">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Anuverse Studios</h1>
                <p className="text-xs text-muted-foreground">
                  {isMarketing ? "Marketing Manager" : "Developer"} Portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-3 hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="p-6 bg-glass/50 backdrop-blur-md border-glass-border hover:border-gold/30 transition-all cursor-pointer group shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-gold)]"
              onClick={() => setShowAttendance(true)}
            >
              <Camera className="w-8 h-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">Mark Attendance</h3>
              <p className="text-xs text-muted-foreground">Upload photo & check in</p>
            </Card>
          </motion.div>

          {isMarketing && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card
                  className="p-6 bg-glass/50 backdrop-blur-md border-glass-border hover:border-gold/30 transition-all cursor-pointer group shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-gold)]"
                  onClick={() => setShowLeadForm(true)}
                >
                  <Plus className="w-8 h-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground mb-1">Capture Lead</h3>
                  <p className="text-xs text-muted-foreground">Add new prospect</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-glass/50 backdrop-blur-md border-glass-border shadow-[var(--shadow-glass)]">
                  <Users className="w-8 h-8 text-gold mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Visits Today</h3>
                  <p className="text-2xl font-bold text-gold">8 / 12</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-glass/50 backdrop-blur-md border-glass-border shadow-[var(--shadow-glass)]">
                  <TrendingUp className="w-8 h-8 text-gold mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">This Week</h3>
                  <p className="text-2xl font-bold text-gold">₹45,000</p>
                </Card>
              </motion.div>
            </>
          )}

          {!isMarketing && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-glass/50 backdrop-blur-md border-glass-border shadow-[var(--shadow-glass)]">
                  <Code2 className="w-8 h-8 text-gold mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Active Tasks</h3>
                  <p className="text-2xl font-bold text-gold">5</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-glass/50 backdrop-blur-md border-glass-border shadow-[var(--shadow-glass)]">
                  <GitBranch className="w-8 h-8 text-gold mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Commits</h3>
                  <p className="text-2xl font-bold text-gold">23</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-glass/50 backdrop-blur-md border-glass-border hover:border-gold/30 transition-all cursor-pointer group shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-gold)]">
                  <Upload className="w-8 h-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground mb-1">Upload Build</h3>
                  <p className="text-xs text-muted-foreground">Deploy latest version</p>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TaskList userRole={user.role} />
        </motion.div>
      </main>

      {/* Modals */}
      {showAttendance && (
        <AttendanceMarker onClose={() => setShowAttendance(false)} userName={user.name} />
      )}
      {showLeadForm && <LeadForm onClose={() => setShowLeadForm(false)} />}
    </div>
  );
};

export default Dashboard;
