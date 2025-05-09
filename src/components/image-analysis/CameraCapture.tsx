import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    // Start camera when component mounts
    startCamera();

    // Cleanup function
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if video element exists
      if (!videoRef.current) {
        throw new Error('Camera view not initialized');
      }

      // Get camera stream
      const constraints = {
        video: {
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Assign stream to video element
      videoRef.current.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            resolve(true);
          };
        }
      });

      setIsCameraReady(true);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !isCameraReady) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL and pass it back
    const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(imageSrc);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full rounded-lg shadow-lg"
        />
        
        <div className="mt-4 flex justify-center">
          <Button
            disabled={!isCameraReady}
            onClick={captureImage}
            size="lg"
            className="rounded-full h-16 w-16 p-0 flex items-center justify-center"
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;