
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentRecordingsCard from "@/components/dashboard/RecentRecordingsCard";
import AdditionalCardsGrid from "@/components/dashboard/AdditionalCardsGrid";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("Good day");
  const [recentRecordings, setRecentRecordings] = useState([
    {
      id: "1",
      title: "Patient Follow-up - Jane Doe",
      date: new Date(2023, 5, 15, 14, 30),
      duration: 840, // in seconds
      hasNotes: true
    },
    {
      id: "2",
      title: "Initial Consultation - John Smith",
      date: new Date(2023, 5, 14, 10, 15),
      duration: 1250,
      hasNotes: true
    },
    {
      id: "3",
      title: "Procedure Discussion - Alex Johnson",
      date: new Date(2023, 5, 13, 9, 0),
      duration: 600,
      hasNotes: false
    }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <DashboardHeader 
        title={`${greeting} 👋`}
        description="Here's what's happening with your account today."
      />

      {/* Stats Cards */}
      <StatsGrid />

      {/* Recent Recordings */}
      <RecentRecordingsCard recordings={recentRecordings} />

      {/* Additional Cards */}
      <AdditionalCardsGrid />
    </motion.div>
  );
};

export default Dashboard;
