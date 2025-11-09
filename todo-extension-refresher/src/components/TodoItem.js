import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TodoItem({task, deleteTask, toggleComplete, updateTaskText}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    function handleChange() {
        toggleComplete(task.taskId);
    }

    function handleDoubleClick() {
        setIsEditing(true);
    }

    function handleEditChange(e) {
        setEditText(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateTaskText(task.taskId, editText);
        setIsEditing(false);
    }

    function handleCancel() {
        setIsEditing(false);
        setEditText(task.text);
    }

    return (
        <div className={task.isComplete ? 'todo-item complete' : 'todo-item'}>
            {isEditing ? (
                <form className="edit-form" onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        className="edit-input"
                        value={editText}
                        onChange={handleEditChange}
                        autoFocus
                    />
                    <div className="edit-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    <input className='toggle-checkbox'
                        type="checkbox"
                        checked={task.isComplete}
                        onChange={handleChange}
                    />
                    <p className='task-text' onDoubleClick={handleDoubleClick}>{task.text}</p>
                    <button className='delete-task' onClick={() => deleteTask(task.taskId)}>X</button>
                </>
            )}
        </div>
    );
}

TodoItem.propTypes = {
    task: PropTypes.object.isRequired,
    deleteTask: PropTypes.func.isRequired,
    toggleComplete: PropTypes.func.isRequired,
    updateTaskText: PropTypes.func.isRequired
};

export default TodoItem;