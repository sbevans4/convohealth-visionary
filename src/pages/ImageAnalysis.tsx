import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Camera, ImagePlus, Upload, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { analyzeImage } from "@/integrations/imageAnalysisService";
import {
  loadImageHistory,
  saveImageToHistory,
  clearImageHistory
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
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setSelectedImage(dataUrl);
          setAnalysisResults(null);
          setError(null);
          URL.revokeObjectURL(imageUrl);
        }
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
    if (!isCameraAvailable) {
      toast.error("No camera detected on your device. Please connect a camera and try again.");
      return;
    }
    setShowCamera(true);
  };

  const handleImageFromCamera = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setShowCamera(false);
    setAnalysisResults(null);
    setError(null);
    toast.success("Image captured successfully");
  };

  const closeCamera = () => setShowCamera(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6 sm:py-8"
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">Medical Image Analysis</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Upload or capture medical images for AI-powered analysis
        </p>
      </div>

      <Suspense fallback={<div className="h-8 mb-6"></div>}>
        <ImageHistory
          images={imageHistory}
          onSelectImage={handleSelectFromHistory}
          onClearHistory={handleClearHistory}
        />
      </Suspense>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Image Upload</CardTitle>
            <CardDescription>Select or capture a medical image</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {selectedImage ? (
              <div className="relative w-full overflow-x-auto">
                <button onClick={clearImage} className="absolute top-2 right-2 bg-background/80 p-1 rounded-full z-10">
                  <X className="h-5 w-5" />
                </button>
                <div className="overflow-x-auto max-w-full">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full object-contain rounded-md mx-auto border p-2 max-h-[300px] sm:max-h-[400px] md:max-h-[500px]"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
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
                    <Button variant="outline" className="w-full py-3 text-sm sm:text-base">
                      <ImagePlus className="mr-2 h-4 w-4" /> Select Image
                    </Button>
                  </label>
                  {isCameraAvailable === null ? (
                    <Button variant="outline" className="w-full" disabled>
                      <div className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin mr-2"></div>
                      Checking camera...
                    </Button>
                  ) : isCameraAvailable ? (
                    <Button variant="outline" className="w-full" onClick={handleCameraCapture}>
                      <Camera className="mr-2 h-4 w-4" /> Use Camera
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <Camera className="mr-2 h-4 w-4" /> Camera not available
                    </Button>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="w-full mt-2 bg-destructive/10 text-destructive p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={analyzeSelectedImage} disabled={!selectedImage || isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <div className="mr-2 h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Analyze Image
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered medical interpretation</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            }>
              {analysisResults ? (
                <AnalysisResults results={analysisResults} />
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-center px-4">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                      <p>Processing image...</p>
                    </div>
                  ) : (
                    <p>Upload and analyze an image to see results</p>
                  )}
                </div>
              )}
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {showCamera && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl p-6 rounded-lg shadow-lg">
              <p className="text-center">Loading camera...</p>
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin mt-4 mx-auto"></div>
            </div>
          </div>
        }>
          <CameraCapture onCapture={handleImageFromCamera} onClose={closeCamera} />
        </Suspense>
      )}
    </motion.div>
  );
};

export default ImageAnalysis;
