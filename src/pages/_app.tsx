// Create a client-side only stars component
import { useEffect, useState } from 'react';

const StarsBackground = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Your star generation logic can go here if needed
    // This ensures it only runs on the client side
    
  }, []);
  
  // Only render the container when on client-side
  if (!mounted) return <div className="stars-container absolute inset-0"></div>;
  
  return <div className="stars-container absolute inset-0"></div>;
};
