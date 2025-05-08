interface StoredImage {
  id: string;
  src: string;
  timestamp: string; // ISO string representation of date
}

interface ImageRecord {
  id: string;
  src: string;
  timestamp: Date;
}

const STORAGE_KEY = 'convohealth-image-history';
const MAX_IMAGES = 10; // Maximum number of images to store

// Helper to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Function to load images from localStorage
export const loadImageHistory = (): ImageRecord[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];

    const parsedData = JSON.parse(storedData) as StoredImage[];
    
    // Convert timestamp strings back to Date objects
    return parsedData.map(img => ({
      ...img,
      timestamp: new Date(img.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load image history:', error);
    return [];
  }
};

// Function to save an image to history
export const saveImageToHistory = (imageSrc: string): ImageRecord => {
  try {
    const currentHistory = loadImageHistory();
    
    // Check if this image already exists (by content)
    const existingImageIndex = currentHistory.findIndex(img => img.src === imageSrc);
    
    // If it exists, remove it so we can add it to the front (most recent)
    if (existingImageIndex !== -1) {
      currentHistory.splice(existingImageIndex, 1);
    }
    
    // Create new image record
    const newImage: ImageRecord = {
      id: generateId(),
      src: imageSrc,
      timestamp: new Date()
    };
    
    // Add to front of array
    const updatedHistory = [newImage, ...currentHistory];
    
    // Limit to MAX_IMAGES
    const trimmedHistory = updatedHistory.slice(0, MAX_IMAGES);
    
    // Prepare for storage (convert Date to string)
    const forStorage: StoredImage[] = trimmedHistory.map(img => ({
      ...img,
      timestamp: img.timestamp.toISOString()
    }));
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forStorage));
    
    return newImage;
  } catch (error) {
    console.error('Failed to save image to history:', error);
    // Return a fallback image record even if saving failed
    return {
      id: generateId(),
      src: imageSrc,
      timestamp: new Date()
    };
  }
};

// Function to clear all image history
export const clearImageHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear image history:', error);
  }
}; 