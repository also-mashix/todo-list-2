/* global chrome */
// Content script for Todo Extension - Arc Browser Optimized
// This script runs in the context of web pages

console.log('Todo Extension content script loaded');

// Detect if running in Arc Browser
const isArcBrowser = navigator.userAgent.includes('Arc/');

// Listen for keyboard shortcut to open the extension
function handleKeydown(event) {
  // Alt+T shortcut to open the todo extension
  if (event.altKey && event.key === 't') {
    chrome.runtime.sendMessage({ action: 'openTodo' }, (response) => {
      if (response && response.success) {
        console.log('Todo opened via:', response.method);
      }
    });
  }
}

// Add listener only once
if (!document.todoKeydownListenerAdded) {
  document.addEventListener('keydown', handleKeydown);
  document.todoKeydownListenerAdded = true;
}

// Floating button for easy access (especially useful in Arc)
function createFloatingButton() {
  // Check if button already exists
  if (document.getElementById('todo-extension-floating-btn')) {
    return;
  }
  
  const button = document.createElement('div');
  button.id = 'todo-extension-floating-btn';
  button.innerHTML = '✓';
  button.title = 'Open To-Do List (Alt+T)';
  
  // Arc-optimized styling
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: isArcBrowser ? '#6366f1' : '#4285f4',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: '999999',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    userSelect: 'none'
  });
  
  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  });
  
  // Click handler
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openTodo' }, (response) => {
      if (response && response.success) {
        console.log('Todo opened via:', response.method);
        // Provide visual feedback
        button.style.backgroundColor = '#10b981';
        setTimeout(() => {
          button.style.backgroundColor = isArcBrowser ? '#6366f1' : '#4285f4';
        }, 200);
      }
    });
  });
  
  // Allow dragging the button
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  
  button.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);
  
  function dragStart(e) {
    if (e.shiftKey) { // Only drag when shift is held
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;
      button.style.cursor = 'move';
    }
  }
  
  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      
      button.style.transform = `translate(${currentX}px, ${currentY}px)`;
      button.style.bottom = 'auto';
      button.style.right = 'auto';
    }
  }
  
  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    button.style.cursor = 'pointer';
  }
  
  document.body.appendChild(button);
}

// Check user preference and Arc Browser status
chrome.storage.local.get(['showFloatingButton'], (result) => {
  // Show button by default in Arc, or if explicitly enabled
  const shouldShowButton = isArcBrowser || result.showFloatingButton !== false;
  
  if (shouldShowButton) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
      createFloatingButton();
    }
  }
});

// Log Arc Browser detection for debugging
if (isArcBrowser) {
  console.log('Arc Browser detected - Todo extension optimized for Arc');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createFloatingButton,
    isArcBrowser,
    handleKeydown,
  };
}
