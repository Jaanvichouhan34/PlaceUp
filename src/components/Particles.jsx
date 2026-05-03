import React from 'react';

export default function Particles() {
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="particles-container">
      {particles.map((_, i) => (
        <div 
          key={i} 
          className="particle" 
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 10 + 15}s`
          }}
        />
      ))}
    </div>
  );
}
