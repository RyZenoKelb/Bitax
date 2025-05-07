'use client';
import React from 'react';
import { useEffect, useState } from 'react';

export default function Stars() {
  const [stars, setStars] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const starArray: React.ReactElement[] = [];
      const starCount = 80;

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
