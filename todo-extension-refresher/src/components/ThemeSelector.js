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

/**
 * ThemeSelector component - provides UI for customizing the app's theme
 * @param {Object} props - Component props
 * @param {Function} props.onThemeChange - Callback when theme changes (optional)
 */
const ThemeSelector = () => {
  const { theme, updateTheme, updateTextureIntensity, toggleDarkMode } = useTheme();
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  /**
   * Handles color change from color picker
   * @param {Object} color - The selected color object from react-color
   */
  const handleColorChange = (color) => {
    const newColors = [...theme.colors];
    newColors[activeColorIndex] = color.hex;
    updateTheme(newColors, theme.texture);
  };

  /**
   * Sets active color index and shows color picker
   * @param {number} index - Index of the color swatch clicked
   */
  const handleColorSwatchClick = (index) => {
    setActiveColorIndex(index);
    setShowColorPicker(true);
  };

  /**
   * Updates the selected texture
   * @param {string} textureId - ID of the selected texture
   */
  const handleTextureChange = (textureId) => {
    updateTheme(theme.colors, textureId, theme.textureIntensity);
  };

  /**
   * Updates texture intensity based on slider input
   * @param {Object} e - The event object from the input
   */
  const handleIntensityChange = (e) => {
    const intensity = parseFloat(e.target.value);
    updateTextureIntensity(intensity);
  };

  /**
   * Sets up click outside listeners to close color picker and theme panel
   */
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
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          alignSelf: 'center'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="theme-panel">
          <div className="color-selector">
            <div className="theme-header">
              <h3>Color Theme</h3>
              <div className="dark-mode-toggle-container">
                <span className="sun-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </span>
                <label className="dark-mode-toggle">
                  <input 
                    type="checkbox" 
                    checked={theme.darkMode} 
                    onChange={toggleDarkMode}
                    aria-label="Toggle dark mode"
                    role="switch"
                    aria-checked={theme.darkMode}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="moon-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </span>
              </div>
            </div>
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
                    onClick={() => handleColorSwatchClick(index)}
                  ></div>
                ))}
              </div>
              
              <button 
                className="color-control-btn add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (theme.colors.length < 3) {
                    const newColors = [...theme.colors, '#7C3AED'];
                    updateTheme(newColors, theme.texture);
                    setActiveColorIndex(newColors.length - 1);
                    setShowColorPicker(true);
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
                  <div 
                    className={`texture-preview ${texture.id}`}
                    style={{
                      '--texture-intensity': theme.textureIntensity,
                      '--texture-color': theme.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  ></div>
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
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
