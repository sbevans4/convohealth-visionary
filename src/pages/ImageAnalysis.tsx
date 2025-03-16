
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ImagePlus, Upload, X } from "lucide-react";
import { useState } from "react";

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    findings: string;
    suggestedCodes: string[];
  }>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would use the device camera
    console.log("Camera capture requested - would open native camera");
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysisResults(null);
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis with a timeout
    setTimeout(() => {
      setAnalysisResults({
        findings: "The image shows potential indications of mild cardiomegaly with normal lung fields. No significant pleural effusion observed.",
        suggestedCodes: ["R93.1", "I51.7", "Z01.89"]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Medical Image Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload or capture medical images for AI-powered analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>
                Select an image from your device or capture a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {selectedImage ? (
                <div className="relative w-full">
                  <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <img 
                    src={selectedImage} 
                    alt="Selected medical image" 
                    className="max-h-[300px] object-contain rounded-md mx-auto border p-2"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <p className="text-muted-foreground mb-4">No image selected</p>
                  <div className="flex flex-col gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button variant="outline" className="w-full">
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Select Image
                      </Button>
                    </label>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCameraCapture}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Use Camera
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="mr-2 h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Image
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-powered interpretation of the medical image
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResults ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Findings</h3>
                    <p className="mt-1 text-muted-foreground">{analysisResults.findings}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Suggested Codes</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysisResults.suggestedCodes.map((code, index) => (
                        <div key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageAnalysis;
