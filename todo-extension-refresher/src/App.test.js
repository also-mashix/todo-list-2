import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the todo app header', () => {
    render(<App />);
    const headerElement = screen.getByText('Todo Extension Refresher');
    expect(headerElement).toBeInTheDocument();
  });

  // it('renders the theme selector', () => {
  //   render(<App />);
  //   const themeButton = screen.getByText('Theme');
  //   expect(themeButton).toBeInTheDocument();
  // });

  it('renders the todo list', () => {
    render(<App />);
    const todoList = screen.getByTestId('todo-list');
    expect(todoList).toBeInTheDocument();
  });
});
