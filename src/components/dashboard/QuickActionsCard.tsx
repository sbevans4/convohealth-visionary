import { motion } from "framer-motion";
import { BarChart3, CalendarClock, Users, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const QuickActionsCard = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const actions = [
    { icon: BarChart3, label: "Analytics Dashboard", color: "bg-blue-100 text-blue-600", link: "/dashboard" },
    { icon: CalendarClock, label: "Scheduled Recordings", color: "bg-green-100 text-green-600", link: "/voice-recording" },
    { icon: Users, label: "Patient Records", color: "bg-amber-100 text-amber-600", link: "/medical-documentation" },
    { icon: FileText, label: "Templates", color: "bg-purple-100 text-purple-600", link: "/medical-documentation" },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card className="border shadow-soft h-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Link 
                  key={index}
                  to={action.link}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent/50 transition-colors text-center cursor-pointer"
                >
                  <div className={`p-3 rounded-full mb-2 ${action.color}`}>
                    <ActionIcon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickActionsCard;
