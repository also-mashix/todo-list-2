import React from 'react';
import './App.css';
import TodoList from './components/TodoList.js';

function App() {
  return (
    <><header className="App-header">
      <h1>Todo Extension Refresher</h1>
    </header>
    <div className="App">
      <TodoList />
    </div></>
  );
}

export default App;
