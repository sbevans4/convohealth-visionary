import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, ImagePlus, Upload, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { analyzeImage } from "@/integrations/imageAnalysisService";
import {
  loadImageHistory,
  saveImageToHistory,
  clearImageHistory,
} from "@/integrations/imageHistoryService";
import { checkCameraAvailability } from "@/utils/deviceUtils";

const AnalysisResults = lazy(() => import("@/components/image-analysis/AnalysisResults"));
const CameraCapture = lazy(() => import("@/components/image-analysis/CameraCapture"));
const ImageHistory = lazy(() => import("@/components/image-analysis/ImageHistory"));

interface AnalysisResult {
  findings: string;
  suggestedCodes: string[];
}

interface ImageRecord {
  id: string;
  src: string;
  timestamp: Date;
}

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<ImageRecord[]>([]);
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean | null>(null);
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const imageUploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = loadImageHistory();
    setImageHistory(history);

    const checkCamera = async () => {
      try {
        const isAvailable = await checkCameraAvailability();
        setIsCameraAvailable(isAvailable);
      } catch (error) {
        console.error("Error checking camera:", error);
        setIsCameraAvailable(false);
      }
    };

    checkCamera();

    const handleClickOutside = (event: MouseEvent) => {
      if (imageUploadRef.current && !imageUploadRef.current.contains(event.target as Node)) {
        setIsSelectingImage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return toast.error("File size must be less than 10MB");
      if (!file.type.startsWith("image/")) return toast.error("Please select an image file");

      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width, height = img.height;
        const MAX_WIDTH = 1920, MAX_HEIGHT = 1080;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width *= ratio;
          height *= ratio;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          setSelectedImage(dataUrl);
          setAnalysisResults(null);
          setError(null);
        }
        URL.revokeObjectURL(imageUrl);
      };
      img.onerror = () => {
        setError("Failed to load the selected image. The file may be corrupted.");
        toast.error("Failed to load the selected image. Please try another file.");
        URL.revokeObjectURL(imageUrl);
      };
      img.src = imageUrl;
    }
  };

  const handleCameraCapture = () => {
    if (!isCameraAvailable) return toast.error("No camera detected on your device.");
    setShowCamera(true);
  };

  const handleImageFromCamera = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setShowCamera(false);
    setAnalysisResults(null);
    setError(null);
    toast.success("Image captured successfully");
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysisResults(null);
    setError(null);
  };

  const handleSelectFromHistory = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setAnalysisResults(null);
    setError(null);
  };

  const handleClearHistory = () => {
    clearImageHistory();
    setImageHistory([]);
    toast.success("Image history cleared");
  };

  const analyzeSelectedImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const results = await analyzeImage(selectedImage);
      setAnalysisResults(results);
      const newImage = saveImageToHistory(selectedImage);
      setImageHistory(current => {
        const exists = current.some(img => img.id === newImage.id);
        if (exists) return current;
        return [newImage, ...current.filter(img => img.src !== newImage.src)].slice(0, 10);
      });
      toast.success("Image analysis complete");
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze the image. Please try again.");
      toast.error("An error occurred while analyzing the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-2 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Medical Image Analysis</h1>
        <p className="text-muted-foreground">Upload or capture medical images for AI-powered analysis</p>
      </div>

      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <ImageHistory
          images={imageHistory}
          onSelectImage={handleSelectFromHistory}
          onClearHistory={handleClearHistory}
        />
      </Suspense>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Image Upload</CardTitle>
            <CardDescription>Select or capture a medical image</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {selectedImage ? (
              <div className="relative w-full">
                <button onClick={clearImage} className="absolute top-2 right-2 bg-background/80 p-1 rounded-full">
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full object-contain rounded-md border p-2 max-h-[500px]"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">No image selected</p>
                <div className="flex flex-col gap-4">
                  <label className="cursor-pointer">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <ImagePlus className="mr-2 h-4 w-4" /> Select Image
                    </Button>
                  </label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCameraCapture}
                    disabled={isCameraAvailable === false}
                  >
                    <Camera className="mr-2 h-4 w-4" /> Capture Image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          {selectedImage && (
            <CardFooter>
              <Button
                onClick={analyzeSelectedImage}  
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="px-0">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI findings based on the uploaded image</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-600 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" /> {error}
              </div>
            )}
            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
              {analysisResults && <AnalysisResults results={analysisResults} />}
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {showCamera && (
        <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-black/50">Loading camera...</div>}>
          <CameraCapture onCapture={handleImageFromCamera} onClose={() => setShowCamera(false)} />
        </Suspense>
      )}
    </motion.div>
  );
};

export default ImageAnalysis;
