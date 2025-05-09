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
  const streamRef = useRef<MediaStream | null>(null);

  // Check if the device has camera support
  useEffect(() => {
    const checkCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support camera access. Please try a different browser or device.');
        setIsCheckingCamera(false);
        return;
      }

      // Ensure the app is served over HTTPS to access the camera
      if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
        setError('Camera access requires HTTPS. Please ensure your app is served over HTTPS.');
        setIsCheckingCamera(false);
        return;
      }

      try {
        setIsCheckingCamera(true);
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          setError('No camera detected on your device. Please connect a camera and try again.');
          setIsCheckingCamera(false);
          return;
        }
        
        // Camera is available, now try to access it
        await setupCamera();
      } catch (err) {
        console.error('Error checking camera availability:', err);
        setError('Failed to check camera availability. Please ensure you have granted the necessary permissions.');
        setIsCheckingCamera(false);
      }
    };

    checkCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const setupCamera = async () => {
    try {
      let stream: MediaStream;
      
      // Try rear camera first
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: 'environment' } },
          audio: false,
        });
      } catch {
        // Fallback to any available camera (e.g. front on laptop)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // Wait for the video element to be available
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      videoRef.current.srcObject = stream;

      // Wait for the video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return reject('Video element not found');
        
        videoRef.current.onloadedmetadata = () => resolve();
        videoRef.current.onerror = () => reject('Video loading error');
        
        // Fallback in case onloadedmetadata doesn't fire
        setTimeout(() => {
          if (videoRef.current?.readyState >= HTMLMediaElement.HAVE_METADATA) {
            resolve();
          } else {
            reject('Video loading timeout');
          }
        }, 5000);
      });

      setIsCameraReady(true);
      setIsCheckingCamera(false);
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError(`Could not access the camera: ${err.message || 'Unknown error'}`);
      setIsCheckingCamera(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
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