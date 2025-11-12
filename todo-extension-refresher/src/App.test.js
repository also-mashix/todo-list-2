import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the theme selector gear icon', () => {
    render(<App />);
    // Look for the gear icon SVG
    const gearIcon = document.querySelector('svg');
    expect(gearIcon).toBeInTheDocument();
  });

  it('renders the todo list', () => {
    render(<App />);
    const todoList = screen.getByTestId('todo-list');
    expect(todoList).toBeInTheDocument();
  });
});
