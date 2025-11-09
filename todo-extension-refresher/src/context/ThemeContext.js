import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('todoTheme');
    return savedTheme ? JSON.parse(savedTheme) : {
      colors: ['#7C3AED', '#8B5CF6', '#A78BFA'],
      texture: 'none',
      textureIntensity: 0.5, // Default intensity
      darkMode: false
    };
  });

  useEffect(() => {
    localStorage.setItem('todoTheme', JSON.stringify(theme));
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    // Apply colors
    newTheme.colors.forEach((color, index) => {
      root.style.setProperty(`--color-${index + 1}`, color);
    });
    
    // Create gradient background
    const gradientColors = newTheme.colors
      .map((color, i) => {
        // Slightly lighten the color for the gradient
        const lightenedColor = lightenColor(color, 20);
        return `color-mix(in srgb, ${color} ${100 - (i * 10)}%, ${lightenedColor})`;
      })
      .join(', ');
    
    // Set CSS variables for the theme
    root.style.setProperty('--theme-gradient', `linear-gradient(135deg, ${gradientColors})`);
    root.style.setProperty('--theme-color-1', newTheme.colors[0]);
    
    // Set dark/light mode
    const isDark = newTheme.darkMode;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Set text colors based on brightness of primary color
    const isPrimaryDark = isColorDark(newTheme.colors[0]);
    root.style.setProperty('--text-on-primary', isPrimaryDark ? '#ffffff' : '#000000');
    root.style.setProperty('--text-on-bg', isDark ? '#ffffff' : '#1a1a1a');
    root.style.setProperty('--text-secondary', isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)');
    
    // Set card and UI colors
    root.style.setProperty('--card-bg', isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--border-color', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--shadow-color', isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)');
    
    // Apply texture with intensity
    applyTexture(newTheme.texture, isDark, newTheme.textureIntensity);
  };

  const lightenColor = (color, percent) => {
    // Expand shorthand hex to full form
    if (color.length === 4) {
      color = color.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3');
    }
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(
      0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1)}`;
  };

  const applyTexture = (texture, isDark, intensity = 0.5) => {
    // Ensure intensity is between 0 and 1
    const safeIntensity = Math.min(1, Math.max(0, intensity));
    const root = document.documentElement;
    
    // Reset any previous texture variables
    root.style.removeProperty('--texture-image');
    root.style.removeProperty('--texture-size');
    root.style.removeProperty('--texture-repeat');
    
    if (texture === 'none') {
      return;
    }
    
    switch(texture) {
      case 'noise':
        root.style.setProperty('--texture-image', `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0%25' y='0%25' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${0.6 * safeIntensity}'/%3E%3C/svg%3E")`);
        root.style.setProperty('--texture-size', '200px 200px');
        root.style.setProperty('--texture-repeat', 'repeat');
        break;
      case 'grid':
        const gridOpacity = 0.1 * safeIntensity;
        const gridColor = isDark ? `rgba(255, 255, 255, ${gridOpacity})` : `rgba(0, 0, 0, ${gridOpacity})`;
        const gridSize = 20 / (1 + safeIntensity);
        root.style.setProperty('--texture-image', `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`);
        root.style.setProperty('--texture-size', `${gridSize}px ${gridSize}px`);
        root.style.setProperty('--texture-repeat', 'repeat');
        break;
      case 'dots':
        const dotOpacity = 0.15 * safeIntensity;
        const dotColor = isDark ? `rgba(255, 255, 255, ${dotOpacity})` : `rgba(0, 0, 0, ${dotOpacity})`;
        const dotSize = 1 + (1 * safeIntensity);
        const dotSpacing = 15 - (5 * safeIntensity);
        root.style.setProperty('--texture-image', `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`);
        root.style.setProperty('--texture-size', `${dotSpacing}px ${dotSpacing}px`);
        root.style.setProperty('--texture-repeat', 'repeat');
        break;
      default:
        // Reset variables
        root.style.removeProperty('--texture-image');
        root.style.removeProperty('--texture-size');
        root.style.removeProperty('--texture-repeat');
    }
  };

  const isColorDark = (color) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate brightness (perceived luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 155; // Slightly higher threshold for better contrast
  };

  const updateTheme = (newColors, texture, textureIntensity) => {
    setTheme(prev => ({
      ...prev,
      colors: newColors,
      texture: texture !== undefined ? texture : prev.texture,
      textureIntensity: textureIntensity !== undefined ? textureIntensity : prev.textureIntensity
    }));
  };

  const updateTextureIntensity = (intensity) => {
    setTheme(prev => ({
      ...prev,
      textureIntensity: intensity
    }));
  };

  const toggleDarkMode = () => {
    setTheme(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  const value = {
    theme,
    updateTheme,
    updateTextureIntensity,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
