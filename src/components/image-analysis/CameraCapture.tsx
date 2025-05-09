import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCheckingCamera, setIsCheckingCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readyToSetupCamera, setReadyToSetupCamera] = useState(false);

  // Initial check for camera and permissions
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Your browser does not support camera access.');
      setIsCheckingCamera(false);
      return;
    }

    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');

        toast.error(`Camera access ${devices.length > 0 ? 'available' : 'not available'}`);

        toast.success(`Camera access granted. Ready to capture images. ${hasCamera}`);

        if (!hasCamera) {
          setError('No camera found.');
          setIsCheckingCamera(false);
          return;
        }

        setReadyToSetupCamera(true);
      } catch (err) {
        console.error('Camera check error:', err);
        setError('Camera access failed. Please check permissions.');
        setIsCheckingCamera(false);
      }
    };

    checkCameraAvailability();
  }, []);

  // Setup camera when videoRef becomes available
  useEffect(() => {
    if (readyToSetupCamera && videoRef.current) {
      setupCamera();
    }
  }, [readyToSetupCamera, videoRef.current]);

  const setupCamera = async () => {
    let stream: MediaStream | null = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });


      toast.success(`VAlue of stream: ${stream}`);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setIsCheckingCamera(false);
        };
      } else {
        setError('Video element not available.');
        setIsCheckingCamera(false);
      }
    } catch (err) {
      console.error('Camera setup error:', err);
      setError('Unable to access the camera. Please check permissions.');
      setIsCheckingCamera(false);
      if (stream) stream.getTracks().forEach(track => track.stop());
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (!isCameraReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(imageDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
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
