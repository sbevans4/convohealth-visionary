import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import RecentRecording from "./RecentRecording";
import { SavedSoapNote } from "@/types/medical";
import { useState, useEffect } from "react";

interface RecentRecordingsCardProps {
  recordings: SavedSoapNote[];
}

const RecentRecordingsCard = ({ recordings }: RecentRecordingsCardProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check the window width on mount and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Change 768px to your desired breakpoint
    };

    // Initial check
    handleResize();

    // Set event listener for resizing
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
      <Card className="border shadow-soft w-full overflow-hidden">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto text-left sm:text-start">
              <CardTitle className="text-xl sm:text-2xl md:text-2xl lg:text-3xl">Recent Recordings</CardTitle>
              <CardDescription className="text-sm md:text-base">Your latest patient documentation sessions</CardDescription>
            </div>
            {/* Conditionally render the button for desktop */}
            {!isMobile && (
              <div className="sm:block sm:text-right sm:px-6 pb-6">
                            <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link to="/medical-documentation">
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          {recordings.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground text-sm">
              No recordings found. Start your first recording to see it here.
            </div>
          ) : (
            <div className="space-y-3">
              {recordings.map((recording) => (
                <RecentRecording key={recording.id} recording={recording} />
              ))}
            </div>
          )}

          {/* Show the "View all" button after the recordings for mobile view */}
          {isMobile && (
            <div className="mt-6 sm:mt-0 sm:hidden text-center">
              <Button variant="ghost" size="sm" className="gap-1 text-sm whitespace-nowrap" asChild>
                <Link to="/medical-documentation">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentRecordingsCard;
