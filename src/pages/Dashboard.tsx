import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentRecordingsCard from "@/components/dashboard/RecentRecordingsCard";
import AdditionalCardsGrid from "@/components/dashboard/AdditionalCardsGrid";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("Good day");
  
  // Get dynamic dashboard data
  const { 
    isLoading, 
    error,
    recordingsThisMonth,
    monthlyChange,
    documentationTimeSaved,
    soapNotesGenerated,
    soapNotesPercentage,
    imageAnalyses,
    imageAnalysesChange,
    recentRecordings
  } = useDashboardStats();

  const queryClient = useQueryClient();

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

  // Refresh stats every 30 seconds to ensure accuracy
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [queryClient]);

  // Generate stats data for StatsGrid
  const getStatsData = () => [
    { 
      title: "Recordings This Month", 
      value: recordingsThisMonth.toString(), 
      change: monthlyChange >= 0 
        ? `+${monthlyChange}% from last month` 
        : `${monthlyChange}% from last month`, 
      isPositive: monthlyChange >= 0
    },
    { 
      title: "Documentation Time Saved", 
      value: documentationTimeSaved, 
      change: "This month", 
      isPositive: true
    },
    { 
      title: "SOAP Notes Generated", 
      value: soapNotesGenerated.toString(), 
      change: `${soapNotesPercentage}% of recordings`, 
      isPositive: soapNotesPercentage > 50
    },
    { 
      title: "Image Analyses", 
      value: imageAnalyses.toString(), 
      change: imageAnalysesChange >= 0 
        ? `+${imageAnalysesChange}% from last month` 
        : `${imageAnalysesChange}% from last month`, 
      isPositive: imageAnalysesChange >= 0
    }
  ];

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

  const handleRefresh = () => {
    window.location.reload();
  };

  // Show error UI if something goes wrong
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading dashboard data</AlertTitle>
        <AlertDescription>
          {error.message || "There was a problem loading your dashboard data."}
          <div className="mt-4">
            <Button onClick={handleRefresh} size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Dashboard
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 max-w-5xl mx-auto px-2 sm:px-6 md:px-10 lg:px-16 py-8 md:py-14"
    >
      <DashboardHeader 
        title={`${greeting} 👋`}
        description="Here's what's happening with your account today."
      />
      {isLoading ? (
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap- md:gap-8 lg:gap-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-background p-6 rounded-lg border shadow-soft">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <StatsGrid stats={getStatsData()} />
      )}  
      {isLoading ? (
        <div className="bg-background p-6 rounded-lg border shadow-soft mt-6 md:mt-8">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4 p-4 border rounded-md">
              <Skeleton className="h-6 w-52 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <RecentRecordingsCard recordings={recentRecordings} />
      )}
      {/* Additional Cards */}
      <div className="mt-6 md:mt-10">
        <AdditionalCardsGrid />
      </div>
    </motion.div>
  );
};

export default Dashboard;
