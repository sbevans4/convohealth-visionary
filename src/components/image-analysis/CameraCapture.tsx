import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingCamera, setIsCheckingCamera] = useState(true);

  // Check if the device has camera support
  useEffect(() => {
    // Check if mediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support camera access. Please try a different browser or device.');
      setIsCheckingCamera(false);
      return;
    }

    // Check if any video input devices are available
    const checkCameraAvailability = async () => {
      try {
        setIsCheckingCamera(true);
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          setError('No camera detected on your device. Please connect a camera and try again.');
          setIsCheckingCamera(false);
          return;
        }
        
        // Camera is available, now try to access it
        setupCamera();
      } catch (err) {
        console.error('Error checking camera availability:', err);
        setError('Failed to check camera availability. Please ensure you have granted the necessary permissions.');
        setIsCheckingCamera(false);
      }
    };

    checkCameraAvailability();
  }, []);

  const setupCamera = async () => {
    let stream: MediaStream | null = null;
    
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer rear camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setIsCheckingCamera(false);
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access the camera. Please ensure you have granted camera permissions.');
      setIsCheckingCamera(false);
      
      // Make sure to clean up any partial stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL and pass it back
        const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageSrc);
      }
    }
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

        {isCheckingCamera && (
          <div className="bg-black p-8 rounded-lg text-white text-center">
            <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin mb-4 mx-auto"></div>
            <p>Checking camera availability...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {!error && !isCheckingCamera && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full rounded-lg shadow-lg"
            />
            
            <canvas ref={canvasRef} className="hidden" />
            
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
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture; 