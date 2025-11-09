import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function TodoItem({task, isEditing, deleteTask, toggleComplete, updateTaskText, onStartEditing}) {
    const [editText, setEditText] = useState(task.text);

    // Update editText when task.text changes
    useEffect(() => {
        setEditText(task.text);
    }, [task.text]);

    function handleChange() {
        toggleComplete(task.taskId);
    }

    function handleDoubleClick() {
        onStartEditing(task.taskId);
    }

    function handleEditChange(e) {
        setEditText(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateTaskText(task.taskId, editText);
    }

    function handleCancel() {
        setEditText(task.text);
        onStartEditing(null);
    }

    return (
        <div className={task.isComplete ? 'todo-item complete' : 'todo-item'} data-task-id={task.taskId}>
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
    isEditing: PropTypes.bool,
    deleteTask: PropTypes.func.isRequired,
    toggleComplete: PropTypes.func.isRequired,
    updateTaskText: PropTypes.func.isRequired,
    onStartEditing: PropTypes.func.isRequired
};

TodoItem.defaultProps = {
    isEditing: false
};

export default TodoItem;