import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  MapPin,
  Clock,
  Camera,
  ArrowLeft,
  Shield,
  Loader2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

interface TeamMember extends Profile {
  role?: string;
  attendance?: Attendance[];
}

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [allAttendance, setAllAttendance] = useState<(Attendance & { profile_name?: string })[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    todayAttendance: 0,
    activeMembers: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData?.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await fetchAllData();
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("joined_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Fetch all attendance records
      const { data: attendance, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .order("timestamp_utc", { ascending: false });

      if (attendanceError) throw attendanceError;

      // Combine profiles with roles
      const membersWithRoles: TeamMember[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        const userAttendance = attendance?.filter((a) => a.user_id === profile.user_id);
        return {
          ...profile,
          role: userRole?.role || "unknown",
          attendance: userAttendance || [],
        };
      });

      setTeamMembers(membersWithRoles);

      // Combine attendance with profile names
      const attendanceWithNames = (attendance || []).map((record) => {
        const profile = profiles?.find((p) => p.user_id === record.user_id);
        return {
          ...record,
          profile_name: profile?.name || "Unknown",
        };
      });

      setAllAttendance(attendanceWithNames);

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const todayAttendance = attendance?.filter(
        (a) => a.timestamp_utc.split("T")[0] === today
      ).length || 0;

      setStats({
        totalMembers: profiles?.length || 0,
        todayAttendance,
        activeMembers: profiles?.filter((p) => p.active).length || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "marketing_manager":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "coder":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                  <p className="text-sm text-muted-foreground">Team Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-glass/50 backdrop-blur-xl border-glass-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMembers}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-glass/50 backdrop-blur-xl border-glass-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Attendance</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todayAttendance}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-glass/50 backdrop-blur-xl border-glass-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeMembers}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="bg-glass/50 border border-glass-border">
            <TabsTrigger value="members" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Attendance Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card className="bg-glass/50 backdrop-blur-xl border-glass-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Phone</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Check-ins</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {member.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(member.role || "")}>
                          {member.role === "marketing_manager"
                            ? "Marketing"
                            : member.role === "coder"
                            ? "Coder"
                            : member.role === "admin"
                            ? "Admin"
                            : "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.phone || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(member.joined_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            member.active
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {member.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {member.attendance?.length || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                  {teamMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No team members found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card className="bg-glass/50 backdrop-blur-xl border-glass-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Member</TableHead>
                    <TableHead className="text-muted-foreground">Date & Time</TableHead>
                    <TableHead className="text-muted-foreground">Location</TableHead>
                    <TableHead className="text-muted-foreground">Method</TableHead>
                    <TableHead className="text-muted-foreground">Photo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAttendance.map((record) => (
                    <TableRow key={record.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {record.profile_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {format(new Date(record.timestamp_utc), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold" />
                            <span className="truncate max-w-[200px]">{record.location}</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-muted text-muted-foreground">
                          {record.method || "web"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.photo_url ? (
                          <a
                            href={record.photo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gold hover:underline"
                          >
                            <Camera className="w-4 h-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {allAttendance.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
