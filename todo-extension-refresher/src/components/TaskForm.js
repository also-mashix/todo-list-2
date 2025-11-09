import React from 'react';

function TaskForm({ text, setText, addTask }) {
    return (
        <div className="task-form">
            <input 
                className="todo-input"
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <button className='add-task' onClick={() => addTask(text)}>Add</button>
        </div>
    );
}

export default TaskForm;
