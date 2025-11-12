import React from 'react';
import './App.css';
import TodoList from './components/TodoList.js';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <div className="App">
          <TodoList />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
