
import { motion } from "framer-motion";
import { Mic, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  greeting: string;
}

const DashboardHeader = ({ greeting }: DashboardHeaderProps) => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
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
  );
};

export default DashboardHeader;
