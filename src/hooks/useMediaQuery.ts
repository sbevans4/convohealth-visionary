
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Add event listener
    mediaQuery.addEventListener("change", handler);
    
    // Remove event listener on cleanup
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);
  
  return matches;
}
