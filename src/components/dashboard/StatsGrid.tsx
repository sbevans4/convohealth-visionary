
import { motion } from "framer-motion";
import { Mic, Clock, FileText, Image } from "lucide-react";
import StatCard from "./StatCard";

const StatsGrid = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    { 
      title: "Recordings This Month", 
      value: "24", 
      change: "+8% from last month", 
      icon: Mic,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100"
    },
    { 
      title: "Documentation Time Saved", 
      value: "32h 15m", 
      change: "This month", 
      icon: Clock,
      iconColor: "text-green-500",
      iconBg: "bg-green-100"
    },
    { 
      title: "SOAP Notes Generated", 
      value: "21", 
      change: "87% of recordings", 
      icon: FileText,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100"
    },
    { 
      title: "Image Analyses", 
      value: "9", 
      change: "+50% from last month", 
      icon: Image,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100"
    }
  ];

  return (
    <motion.div 
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <StatCard 
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          iconColor={stat.iconColor}
          iconBg={stat.iconBg}
        />
      ))}
    </motion.div>
  );
};

export default StatsGrid;
