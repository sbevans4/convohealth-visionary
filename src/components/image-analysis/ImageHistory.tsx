import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageHistoryProps {
  images: {
    id: string;
    src: string;
    timestamp: Date;
  }[];
  onSelectImage: (imageSrc: string) => void;
  onClearHistory: () => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({
  images,
  onSelectImage,
  onClearHistory
}) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Recent Images</CardTitle>
          <button
            onClick={onClearHistory}
            className="text-muted-foreground hover:text-destructive transition-colors text-sm flex items-center"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Clear History
          </button>
        </div>
        <CardDescription>
          Previously analyzed images
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="whitespace-nowrap pb-2">
          <div className="flex gap-2 pb-2">
            {images.map((image) => (
              <motion.div
                key={image.id}
                className="relative shrink-0 cursor-pointer group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectImage(image.src)}
              >
                <div className="overflow-hidden rounded-md border w-20 h-20">
                  <img
                    src={image.src}
                    alt={`Analyzed on ${image.timestamp.toLocaleString()}`}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 rounded-md bg-black/40 opacity-0 transition-opacity flex items-center justify-center group-hover:opacity-100">
                  <span className="text-white text-xs">Use</span>
                </div>
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white text-[10px] py-0.5 px-1.5 rounded-full shadow-sm">
                    {image.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ImageHistory; 