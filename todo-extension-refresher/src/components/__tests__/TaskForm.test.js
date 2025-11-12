import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../TaskForm';
import { ThemeProvider } from '../../context/ThemeContext';

describe('TaskForm', () => {
  const mockSetText = jest.fn();
  const mockAddTask = jest.fn();
  
  const defaultProps = {
    text: '',
    setText: mockSetText,
    addTask: mockAddTask
  };

  // Helper function to render TaskForm with ThemeProvider
  const renderTaskForm = (props = defaultProps) => {
    return render(
      <ThemeProvider>
        <TaskForm {...props} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockSetText.mockClear();
    mockAddTask.mockClear();
  });

  it('renders input', () => {
    renderTaskForm();
    const input = screen.getByPlaceholderText('Type to add a task...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'todo-task');
  });

  it('calls setText when input changes', () => {
    renderTaskForm();
    const input = screen.getByPlaceholderText('Type to add a task...');
    fireEvent.change(input, { target: { value: 'New task' } });
    expect(mockSetText).toHaveBeenCalledWith('New task');
  });

  it('calls addTask with trimmed text when Enter is pressed', () => {
    renderTaskForm({ ...defaultProps, text: '  New task  ' });
    const input = screen.getByPlaceholderText('Type to add a task...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockAddTask).toHaveBeenCalledWith('New task');
    expect(mockSetText).toHaveBeenCalledWith('');
  });

  it('does not call addTask when Enter is pressed with empty input', () => {
    renderTaskForm({ ...defaultProps, text: '   ' });
    const input = screen.getByPlaceholderText('Type to add a task...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('focuses input when / is pressed', () => {
    renderTaskForm();
    const input = screen.getByPlaceholderText('Type to add a task...');
    
    // Mock focus method
    const focusMock = jest.fn();
    input.focus = focusMock;
    
    // Simulate global '/' key press
    fireEvent.keyDown(document, { key: '/' });
    
    expect(focusMock).toHaveBeenCalled();
  });
});
