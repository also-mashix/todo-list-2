import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../TodoItem';

describe('TodoItem', () => {
  const mockTask = {
    taskId: '1',
    text: 'Test task',
    isComplete: false
  };

  const mockProps = {
    task: mockTask,
    isEditing: false,
    deleteTask: jest.fn(),
    toggleComplete: jest.fn(),
    updateTaskText: jest.fn(),
    onStartEditing: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task text', () => {
    render(<TodoItem {...mockProps} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('toggles completion status when checkbox is clicked', () => {
    render(<TodoItem {...mockProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockProps.toggleComplete).toHaveBeenCalledWith('1');
  });

  it('calls deleteTask when delete button is clicked', () => {
    render(<TodoItem {...mockProps} />);
    const deleteButton = screen.getByRole('button', { name: /delete task/i });
    fireEvent.click(deleteButton);
    expect(mockProps.deleteTask).toHaveBeenCalledWith('1');
  });

  it('enters edit mode on double click', () => {
    render(<TodoItem {...mockProps} />);
    const taskText = screen.getByText('Test task');
    fireEvent.doubleClick(taskText);
    expect(mockProps.onStartEditing).toHaveBeenCalledWith('1');
  });

  describe('when in edit mode', () => {
    const editProps = {
      ...mockProps,
      isEditing: true
    };

    it('shows edit form', () => {
      render(<TodoItem {...editProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('updates task text on save', () => {
      render(<TodoItem {...editProps} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Updated task' } });
      
      // Submit using the form's class name
      const form = document.querySelector('.edit-form');
      fireEvent.submit(form);
      
      expect(mockProps.updateTaskText).toHaveBeenCalledWith('1', 'Updated task');
    });

    it('cancels edit on cancel button click', () => {
      render(<TodoItem {...editProps} />);
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      expect(mockProps.onStartEditing).toHaveBeenCalledWith(null);
    });
  });

  it('applies complete class when task is completed', () => {
    const completedProps = {
      ...mockProps,
      task: { ...mockTask, isComplete: true }
    };
    render(<TodoItem {...completedProps} />);
    const todoItem = screen.getByText('Test task').closest('div');
    expect(todoItem).toHaveClass('complete');
  });
});
