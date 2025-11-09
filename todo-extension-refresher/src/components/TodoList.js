import React, {useState, useEffect} from "react";
import TodoItem from "./TodoItem.js";
import TaskForm from "./TaskForm.js";

function TodoList() {
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
    }

    const filteredTasks = tasks.filter(task => {
        if(filter === 'all') return true;
        if(filter === 'active') return !task.isComplete;
        if(filter === 'completed') return task.isComplete;
    });

    return (
        <div className="todo-list">
            <div className="filters">
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
            </div>
            {filteredTasks.map(task => (
                <TodoItem
                    key={task.taskId}
                    task={task}
                    deleteTask={deleteTask}
                    toggleComplete={toggleComplete}
                    updateTaskText={updateTaskText}
                />
            ))}
            <TaskForm text={text} setText={setText} addTask={addTask} />
        </div>
    );
}

export default TodoList;