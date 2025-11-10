import React from 'react';
import './App.css';
import TodoList from './components/TodoList.js';
import ThemeSelector from './components/ThemeSelector';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <header className="App-header">
          <div className="header-content">
            <h1>Todo Extension Refresher</h1>
            <ThemeSelector />
          </div>
        </header>
        <div className="App">
          <TodoList />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
