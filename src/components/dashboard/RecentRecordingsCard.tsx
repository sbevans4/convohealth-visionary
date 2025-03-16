
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import RecentRecording from "./RecentRecording";

interface RecordingProps {
  id: string;
  title: string;
  date: Date;
  duration: number;
  hasNotes: boolean;
}

interface RecentRecordingsCardProps {
  recordings: RecordingProps[];
}

const RecentRecordingsCard = ({ recordings }: RecentRecordingsCardProps) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
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
            {recordings.map((recording) => (
              <RecentRecording key={recording.id} recording={recording} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentRecordingsCard;
