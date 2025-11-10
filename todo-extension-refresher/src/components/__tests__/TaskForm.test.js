import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../TaskForm';

describe('TaskForm', () => {
  const mockSetText = jest.fn();
  const mockAddTask = jest.fn();
  
  const defaultProps = {
    text: '',
    setText: mockSetText,
    addTask: mockAddTask
  };

  beforeEach(() => {
    mockSetText.mockClear();
    mockAddTask.mockClear();
  });

  it('renders input and button', () => {
    render(<TaskForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Type to add a task...')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls setText when input changes', () => {
    render(<TaskForm {...defaultProps} />);
    const input = screen.getByPlaceholderText('Type to add a task...');
    fireEvent.change(input, { target: { value: 'New task' } });
    expect(mockSetText).toHaveBeenCalledWith('New task');
  });

  it('calls addTask with trimmed text when Enter is pressed', () => {
    render(<TaskForm {...defaultProps} text="  New task  " />);
    const input = screen.getByPlaceholderText('Type to add a task...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockAddTask).toHaveBeenCalledWith('New task');
    expect(mockSetText).toHaveBeenCalledWith('');
  });

  it('does not call addTask when Enter is pressed with empty input', () => {
    render(<TaskForm {...defaultProps} text="   " />);
    const input = screen.getByPlaceholderText('Type to add a task...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('calls addTask and clears input when Add button is clicked', () => {
    render(<TaskForm {...defaultProps} text="  New task  " />);

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(mockAddTask).toHaveBeenCalledWith('New task');
    expect(mockSetText).toHaveBeenCalledWith('');
  });

  it('focuses input when / is pressed', () => {
    render(<TaskForm {...defaultProps} />);
    const input = screen.getByPlaceholderText('Type to add a task...');
    
    // Mock focus method
    const focusMock = jest.fn();
    input.focus = focusMock;
    
    // Simulate global '/' key press
    fireEvent.keyDown(document, { key: '/' });
    
    expect(focusMock).toHaveBeenCalled();
  });
});
