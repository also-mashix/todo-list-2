import React, {useState, useEffect} from "react";
import TodoItem from "./TodoItem.js";
import TaskForm from "./TaskForm.js";

function TodoList() {
    const [editingTaskId, setEditingTaskId] = useState(null);
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

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    function addTask(text) {
        const newTask = {
            taskId: Date.now(),
            text,
            isComplete: false
        };
        setTasks([...tasks, newTask]);
        setText('');
    }

    function deleteTask(taskId) {
        setTasks(tasks.filter(task => task.taskId !== taskId));
    }

    function toggleComplete(taskId) {
        setTasks(tasks.map(task => {
            if(task.taskId === taskId) {
                return {...task, isComplete: !task.isComplete};
            } else {
                return task;
            }
        }));
    }

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

    const filteredTasks = tasks.filter(task => {
        if(filter === 'all') return true;
        if(filter === 'active') return !task.isComplete;
        if(filter === 'completed') return task.isComplete;
    });

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