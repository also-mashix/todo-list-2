import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { useTheme } from '../context/ThemeContext';
import './ThemeSelector.css';

const textures = [
  { id: 'none', name: 'None' },
  { id: 'noise', name: 'Noise' },
  { id: 'grid', name: 'Grid' },
  { id: 'dots', name: 'Dots' }
];

const ThemeSelector = () => {
  const { theme, updateTheme, updateTextureIntensity, toggleDarkMode } = useTheme();
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleColorChange = (color) => {
    const newColors = [...theme.colors];
    newColors[activeColorIndex] = color.hex;
    updateTheme(newColors, theme.texture);
  };

  const handleTextureChange = (textureId) => {
    updateTheme(theme.colors, textureId, theme.textureIntensity);
  };

  const handleIntensityChange = (e) => {
    const intensity = parseFloat(e.target.value);
    updateTextureIntensity(intensity);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close color picker if open and click is outside
      if (showColorPicker) {
        const colorPicker = document.querySelector('.chrome-picker');
        if (colorPicker && !colorPicker.contains(event.target)) {
          setShowColorPicker(false);
        }
      }
      
      // Close theme panel if click is outside
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, showColorPicker]);

  return (
    <div className="theme-selector-container" ref={containerRef}>
      <button 
        className="theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: `linear-gradient(90deg, ${theme.colors.join(', ')})`,
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <span>Theme</span>
        <span style={{ fontSize: '18px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="theme-panel">
          <div className="color-selector">
            <h3>Color Theme</h3>
            <div className="color-palette">
              <button 
                className="color-control-btn remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (theme.colors.length > 1) {
                    const newColors = theme.colors.filter((_, i) => i !== activeColorIndex);
                    updateTheme(newColors, theme.texture);
                    setActiveColorIndex(Math.min(activeColorIndex, newColors.length - 1));
                  }
                }}
                disabled={theme.colors.length <= 1}
                aria-label="Remove color"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              
              <div className="color-swatches-container">
                {theme.colors.map((color, index) => (
                  <div 
                    key={index}
                    className="color-swatch"
                    style={{
                      backgroundColor: color,
                      border: activeColorIndex === index ? '3px solid white' : '1px solid rgba(0,0,0,0.2)',
                      boxShadow: activeColorIndex === index ? '0 0 0 2px var(--color-1)' : 'none'
                    }}
                    onClick={() => setActiveColorIndex(index)}
                  ></div>
                ))}
              </div>
              
              <button 
                className="color-control-btn add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (theme.colors.length < 3) {
                    updateTheme([...theme.colors, '#7C3AED'], theme.texture);
                  }
                }}
                disabled={theme.colors.length >= 3}
                aria-label="Add color"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            {showColorPicker && (
              <div className="color-picker-popup">
                <ChromePicker
                  color={theme.colors[activeColorIndex]}
                  onChange={handleColorChange}
                  disableAlpha={true}
                />
              </div>
            )}
            
            <button 
              className="color-picker-toggle"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              {showColorPicker ? 'Hide Color Picker' : 'Show Color Picker'}
            </button>
          </div>

          <div className="texture-selector">
            <h3>Texture</h3>
            <div className="texture-options">
              {textures.map((texture) => (
                <div 
                  key={texture.id}
                  className={`texture-option ${theme.texture === texture.id ? 'active' : ''}`}
                  onClick={() => handleTextureChange(texture.id)}
                >
                  <div className={`texture-preview ${texture.id}`}></div>
                  <span>{texture.name}</span>
                </div>
              ))}
            </div>
          </div>

          {theme.texture !== 'none' && (
            <div className="texture-intensity">
              <label htmlFor="intensitySlider">Texture Intensity</label>
              <input 
                type="range" 
                id="intensitySlider"
                min="0" 
                max="1" 
                step="0.1"
                value={theme.textureIntensity}
                onChange={handleIntensityChange}
              />
              <div className="intensity-value">
                {Math.round(theme.textureIntensity * 100)}%
              </div>
            </div>
          )}
          <div className="dark-mode-toggle">
            <input 
              type="checkbox" 
              id="darkModeToggle" 
              checked={theme.darkMode} 
              onChange={toggleDarkMode} 
            />
            <label htmlFor="darkModeToggle">Dark Mode</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
