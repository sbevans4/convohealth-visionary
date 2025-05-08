interface AnalysisResult {
  findings: string;
  suggestedCodes: string[];
}

// Function to convert base64 image to Blob for API upload
const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

// Mock analysis results for demo/fallback
const mockAnalysisResults: AnalysisResult[] = [
  {
    findings: "The image shows potential indications of mild cardiomegaly with normal lung fields. No significant pleural effusion observed.",
    suggestedCodes: ["R93.1", "I51.7", "Z01.89"]
  },
  {
    findings: "Mild degenerative changes observed in the right knee joint with slight narrowing of the medial compartment. No fracture or dislocation evident.",
    suggestedCodes: ["M17.11", "M19.041", "M25.561"]
  },
  {
    findings: "Bilateral pulmonary opacities noted, most prominent in the lower lobes. Pattern consistent with atypical pneumonia. Consider COVID-19 in differential diagnosis.",
    suggestedCodes: ["J18.9", "J12.89", "R05", "R06.02"]
  },
  {
    findings: "Normal brain parenchyma with no evidence of acute infarct, hemorrhage, or mass effect. Ventricles and sulci are age-appropriate.",
    suggestedCodes: ["Z01.84", "R90.89"]
  }
];

// Main analysis function that will try an API call first, with fallback to mock data
export const analyzeImage = async (imageData: string): Promise<AnalysisResult> => {
  try {
    // Uncomment the following code when you have a real API endpoint:
    /*
    const blob = base64ToBlob(imageData);
    const formData = new FormData();
    formData.append('image', blob);
    
    const response = await fetch('https://api.example.com/analyze-medical-image', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${API_KEY}` // Add your actual API key here
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
    */
    
    // For development or when API is unavailable, return a mock result
    // In production, you would want to replace this with actual API integration
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly select one of the mock results
        const randomIndex = Math.floor(Math.random() * mockAnalysisResults.length);
        resolve(mockAnalysisResults[randomIndex]);
      }, 2000); // Simulate network delay
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}; 