import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CheckCircle2, Code2, GitCommit } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  location?: string;
  dueDate?: string;
}

interface TaskListProps {
  userRole: "marketing_manager" | "coder" | "admin";
}

const marketingTasks: Task[] = [
  {
    id: "1",
    title: "Visit Sri Electronics",
    description: "Demo latest LED display solutions",
    status: "pending",
    priority: "high",
    location: "Main Bazaar, Kakinada",
    dueDate: "Today, 2:00 PM",
  },
  {
    id: "2",
    title: "Follow-up: Tech World",
    description: "Discuss pricing for bulk order",
    status: "in_progress",
    priority: "medium",
    location: "DVR Complex",
    dueDate: "Today, 4:30 PM",
  },
  {
    id: "3",
    title: "New Lead: Digital Hub",
    description: "Initial consultation for digital signage",
    status: "pending",
    priority: "low",
    location: "Jawahar Street",
    dueDate: "Tomorrow, 11:00 AM",
  },
];

const coderTasks: Task[] = [
  {
    id: "1",
    title: "Implement authentication flow",
    description: "Add JWT-based auth with refresh tokens",
    status: "in_progress",
    priority: "high",
    dueDate: "Today",
  },
  {
    id: "2",
    title: "Fix dashboard API bug",
    description: "Resolve data loading issue on metrics page",
    status: "pending",
    priority: "high",
    dueDate: "Today",
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Document new API endpoints and usage",
    status: "pending",
    priority: "medium",
    dueDate: "Tomorrow",
  },
];

const TaskList = ({ userRole }: TaskListProps) => {
  const tasks = userRole === "marketing_manager" ? marketingTasks : coderTasks;
  const isMarketing = userRole === "marketing_manager";

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in_progress":
        return "bg-gold/20 text-gold border-gold/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-gold/20 text-gold border-gold/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          {isMarketing ? "Today's Visits" : "Active Tasks"}
        </h2>
        <Badge variant="outline" className="border-gold text-gold">
          {tasks.filter((t) => t.status !== "completed").length} Active
        </Badge>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 bg-glass/50 backdrop-blur-md border-glass-border hover:border-gold/30 transition-all shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-gold)]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {task.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold" />
                        <span>{task.location}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold" />
                        <span>{task.dueDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Badge className={getStatusColor(task.status)}>
                  {task.status === "completed" && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  {task.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex gap-2">
                {isMarketing ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="w-3 h-3 mr-2" />
                      Navigate
                    </Button>
                    <Button variant="gold" size="sm" className="flex-1">
                      <CheckCircle2 className="w-3 h-3 mr-2" />
                      Complete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Code2 className="w-3 h-3 mr-2" />
                      View Details
                    </Button>
                    <Button variant="gold" size="sm" className="flex-1">
                      <GitCommit className="w-3 h-3 mr-2" />
                      Update
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
