
import { motion } from "framer-motion";
import { 
  Mic, 
  Image, 
  Clock, 
  FileText, 
  ChevronRight,
  BarChart3,
  CalendarClock,
  Users,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to format time
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1 
            variants={itemVariants} 
            className="text-3xl font-display font-semibold tracking-tight"
          >
            {greeting}, Dr. Thomas
          </motion.h1>
          <motion.p 
            variants={itemVariants} 
            className="text-muted-foreground"
          >
            Here's an overview of your recent activity
          </motion.p>
        </div>
        
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <Button className="h-10" asChild>
            <Link to="/medical-documentation">
              <Mic className="mr-2 h-4 w-4" />
              New Recording
            </Link>
          </Button>
          <Button variant="outline" className="h-10" asChild>
            <Link to="/medical-documentation/image">
              <Image className="mr-2 h-4 w-4" />
              Image Analysis
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
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
        ].map((stat, index) => (
          <Card key={index} className="border shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                </div>
                <div className={cn("p-2 rounded-full", stat.iconBg)}>
                  <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Recent Recordings */}
      <motion.div variants={itemVariants}>
        <Card className="border shadow-soft">
          <CardHeader className="px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Recordings</CardTitle>
                <CardDescription>Your latest patient documentation sessions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link to="/medical-documentation">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="space-y-4">
              {recentRecordings.map((recording) => (
                <div 
                  key={recording.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-medical-100 text-medical-600">
                      <Mic className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{recording.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          {recording.date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDuration(recording.duration)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0">
                    {recording.hasNotes ? (
                      <Button variant="outline" size="sm" className="h-8">
                        <FileText className="mr-1 h-3.5 w-3.5" />
                        View SOAP Note
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="h-8">
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Generate Note
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border shadow-soft h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BarChart3, label: "Analytics Dashboard", color: "bg-blue-100 text-blue-600" },
                  { icon: CalendarClock, label: "Scheduled Recordings", color: "bg-green-100 text-green-600" },
                  { icon: Users, label: "Patient Records", color: "bg-amber-100 text-amber-600" },
                  { icon: FileText, label: "Templates", color: "bg-purple-100 text-purple-600" },
                ].map((action, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent/50 transition-colors text-center cursor-pointer"
                  >
                    <div className={`p-3 rounded-full mb-2 ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border shadow-soft h-full">
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Current plan and usage information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h4 className="font-medium">Professional Plan</h4>
                  <p className="text-sm text-muted-foreground">Renews on July 15, 2023</p>
                </div>
                <Button size="sm" asChild>
                  <Link to="/subscription-plans">Manage</Link>
                </Button>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Recording Usage</span>
                  <span className="text-sm text-muted-foreground">12.5/20 hours</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-medical-500" style={{ width: '62.5%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">7.5 hours remaining this month</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
