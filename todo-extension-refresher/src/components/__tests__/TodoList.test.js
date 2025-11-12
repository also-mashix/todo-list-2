import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../TodoList';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock localStorage
let store = {};

const localStorageMock = {
  getItem: jest.fn((key) => store[key] || null),
  setItem: jest.fn((key, value) => {
    store[key] = value.toString();
  }),
  clear: jest.fn(() => {
    store = {};
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
  }),
  __setMockData: (key, value) => {
    store[key] = value;
  },
  __getStore: () => store,
};

// Set up mock implementations
localStorageMock.getItem.mockImplementation((key) => store[key] || null);
localStorageMock.setItem.mockImplementation((key, value) => {
  store[key] = value.toString();
});
localStorageMock.clear.mockImplementation(() => {
  store = {};
});
localStorageMock.removeItem.mockImplementation((key) => {
  delete store[key];
});

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock,
  writable: true 
});

// Mock chrome storage
const chrome = {
  storage: {
    local: {
      set: jest.fn(),
      get: jest.fn(),
    },
  },
};

Object.defineProperty(window, 'chrome', { 
  value: chrome,
  writable: true 
});

// Helper function to render TodoList with ThemeProvider
const renderTodoList = () => {
  return render(
    <ThemeProvider>
      <TodoList />
    </ThemeProvider>
  );
};

describe('TodoList', () => {
  beforeEach(() => {
    store = {};
    // Reset mock call history and restore implementations
    localStorage.getItem.mockClear();
    localStorage.getItem.mockImplementation((key) => store[key] || null);
    localStorage.setItem.mockClear();
    localStorage.setItem.mockImplementation((key, value) => {
      store[key] = value.toString();
    });
    localStorage.removeItem.mockClear();
    localStorage.removeItem.mockImplementation((key) => {
      delete store[key];
    });
    localStorage.clear.mockClear();
    localStorage.clear.mockImplementation(() => {
      store = {};
    });
    chrome.storage.local.set.mockClear();
    chrome.storage.local.get.mockClear();
  });

  it('renders with default tasks', () => {
    renderTodoList();
    expect(screen.getByText('build a react project')).toBeInTheDocument();
    expect(screen.getByText('build out a basic to do app')).toBeInTheDocument();
    expect(screen.getByText('integrate the to do app in a chrome extension')).toBeInTheDocument();
  });

  it('adds a new task', () => {
    renderTodoList();
    const input = screen.getByPlaceholderText('Type to add a task...');
    
    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(screen.getByText('New task')).toBeInTheDocument();
  });

  it('toggles task completion', () => {
    renderTodoList();

    const taskItem = screen.getByText('build out a basic to do app').closest('.todo-item');
    expect(taskItem).toBeInTheDocument();

    const checkbox = within(taskItem).getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('deletes a task', () => {
    renderTodoList();

    const deleteButton = screen.getByLabelText('Delete task build out a basic to do app');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('build out a basic to do app')).not.toBeInTheDocument();
  });

  it('filters tasks', () => {
    renderTodoList();
    
    // Check initial state (all tasks visible)
    expect(screen.getByText('build a react project')).toBeInTheDocument();
    expect(screen.getByText('build out a basic to do app')).toBeInTheDocument();
    
    // Filter active tasks
    fireEvent.click(screen.getByText('Active'));
    expect(screen.queryByText('build a react project')).not.toBeInTheDocument(); // Complete task
    expect(screen.getByText('build out a basic to do app')).toBeInTheDocument(); // Incomplete task
    
    // Filter completed tasks
    fireEvent.click(screen.getByText('Completed'));
    expect(screen.getByText('build a react project')).toBeInTheDocument(); // Complete task
    expect(screen.queryByText('build out a basic to do app')).not.toBeInTheDocument(); // Incomplete task
  });

  it('sorts tasks with incomplete first', () => {
    renderTodoList();
    
    // Get all task text elements
    const taskTexts = screen.getAllByText(/build|integrate/).map(el => el.textContent);
    
    // Incomplete tasks should come first
    expect(taskTexts[0]).toBe('build out a basic to do app');
    expect(taskTexts[1]).toBe('integrate the to do app in a chrome extension');
    // The completed task should be last
    expect(taskTexts[2]).toBe('build a react project');
  });

  it('persists tasks to storage', () => {
    renderTodoList();
    
    // Add a new task
    const input = screen.getByPlaceholderText('Type to add a task...');
    
    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Check if chrome.storage.local.set was called (since we're in extension context)
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { tasks: expect.any(Array) }
    );
    
    // Get the last call to set (which should be our new task)
    const setCalls = chrome.storage.local.set.mock.calls;
    const lastCall = setCalls[setCalls.length - 1];
    const storedTasks = lastCall[0].tasks;
    
    // Check if our new task is in the stored tasks
    const newTask = storedTasks.find(task => task.text === 'New task');
    expect(newTask).toBeTruthy();
  });

  it('loads tasks from storage', async () => {
    const mockTasks = [
      { taskId: 1, text: 'Test task from storage', isComplete: false }
    ];

    // Mock chrome storage
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ tasks: mockTasks });
    });

    renderTodoList();

    expect(await screen.findByText('Test task from storage')).toBeInTheDocument();
  });
});
