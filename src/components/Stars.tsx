// src/components/Stars.tsx
'use client';
import { useEffect, useState } from 'react';

export default function Stars() {
  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      const starCount = 80; // ajuste selon tes besoins
      for (let i = 0; i < starCount; i++) {
        const size = ['tiny', 'small', 'medium', 'large'][Math.floor(Math.random() * 4)];
        const style = {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          '--star-opacity': Math.random().toFixed(8),
          '--star-travel': `${-10 - Math.random() * 40}px`,
          '--star-scale': `${0.75 + Math.random() * 0.5}`,
        } as React.CSSProperties;

        starArray.push(
          <div key={i} className={`star star--${size}`} style={style}></div>
        );
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  return <div className="stars-container absolute inset-0 pointer-events-none z-0">{stars}</div>;
}
