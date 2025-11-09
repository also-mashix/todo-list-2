import React, {useState, useEffect} from "react";
import TodoItem from "./TodoItem.js";
import TaskForm from "./TaskForm.js";

/**
 * TodoList component - Manages and displays a list of todo items with filtering and sorting capabilities
 * @returns {JSX.Element} The rendered todo list interface
 */
function TodoList() {
    const [editingTaskId, setEditingTaskId] = useState(null);
    /**
     * State for tasks with localStorage persistence
     * @type {[Array<{taskId: number, text: string, isComplete: boolean}>, Function]}
     */
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [
            {
                taskId: 1,
                text: 'build a react project',
                isComplete: true
            },
            {
                taskId: 2,
                text: 'build out a basic to do app',
                isComplete: false
            },
            {
                taskId: 3,
                text: 'integrate the to do app in a chrome extension',
                isComplete: false
            }
        ];
    });

    const [text, setText] = useState('');
    const [filter, setFilter] = useState('all');

    /**
     * Effect to persist tasks to localStorage whenever they change
     */
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    /**
     * Adds a new task to the list
     * @param {string} text - The text content of the new task
     */
    function addTask(text) {
        const newTask = {
            taskId: Date.now(),
            text,
            isComplete: false
        };
        setTasks([...tasks, newTask]);
        setText('');
    }

    /**
     * Removes a task from the list
     * @param {number} taskId - The ID of the task to remove
     */
    function deleteTask(taskId) {
        setTasks(tasks.filter(task => task.taskId !== taskId));
    }

    /**
     * Toggles the completion status of a task
     * @param {number} taskId - The ID of the task to toggle
     */
    function toggleComplete(taskId) {
        setTasks(tasks.map(task => {
            if(task.taskId === taskId) {
                return {...task, isComplete: !task.isComplete};
            } else {
                return task;
            }
        }));
    }

    /**
     * Updates the text of an existing task
     * @param {number} taskId - The ID of the task to update
     * @param {string} newText - The new text content for the task
     */
    function updateTaskText(taskId, newText) {
        setTasks(tasks.map(task => {
            if(task.taskId === taskId) {
                return {...task, text: newText};
            } else {
                return task;
            }
        }));
        setEditingTaskId(null);
    }

    /**
     * Handles the start of task editing, ensuring any in-progress edits are saved
     * @param {number} taskId - The ID of the task to start editing
     */
    function handleStartEditing(taskId) {
        // If there's already an edited task, save it first
        if (editingTaskId !== null && editingTaskId !== taskId) {
            const editedTask = tasks.find(t => t.taskId === editingTaskId);
            if (editedTask) {
                // Get the current edit text from the input field
                const editInput = document.querySelector(`[data-task-id="${editingTaskId}"] .edit-input`);
                if (editInput) {
                    updateTaskText(editingTaskId, editInput.value);
                }
            }
        }
        setEditingTaskId(taskId);
    }

    /**
     * Filters tasks based on the current filter setting
     * @type {Array<{taskId: number, text: string, isComplete: boolean}>}
     */
    const filteredTasks = tasks.filter(task => {
        if(filter === 'all') return true;
        if(filter === 'active') return !task.isComplete;
        if(filter === 'completed') return task.isComplete;
    });

    /**
     * Sorts tasks with incomplete tasks first
     * @type {Array<{taskId: number, text: string, isComplete: boolean}>}
     */
    const sortedTasks = filteredTasks.slice().sort((a, b) => {
        if (a.isComplete === b.isComplete) return 0;
        return a.isComplete ? 1 : -1;
    });

    return (
        <div className="todo-list">
            <div className="filters" data-active-filter={filter}>
                <button 
                    onClick={() => setFilter('all')}
                    data-active={filter === 'all'}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('active')}
                    data-active={filter === 'active'}
                >
                    Active
                </button>
                <button 
                    onClick={() => setFilter('completed')}
                    data-active={filter === 'completed'}
                >
                    Completed
                </button>
            </div>
            {sortedTasks.map(task => (
                <TodoItem
                    key={task.taskId}
                    task={task}
                    isEditing={editingTaskId === task.taskId}
                    deleteTask={deleteTask}
                    toggleComplete={toggleComplete}
                    updateTaskText={updateTaskText}
                    onStartEditing={handleStartEditing}
                />
            ))}
            <TaskForm text={text} setText={setText} addTask={addTask} />
        </div>
    );
}

export default TodoList;