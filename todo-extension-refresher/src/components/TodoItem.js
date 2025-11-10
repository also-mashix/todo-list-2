import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * TodoItem component - renders an individual todo item
 * @param {Object} props - Component props
 * @param {Object} props.task - The task object
 * @param {boolean} props.isEditing - Whether this item is in edit mode
 * @param {Function} props.deleteTask - Function to delete the task
 * @param {Function} props.toggleComplete - Function to toggle task completion
 * @param {Function} props.updateTaskText - Function to update task text
 * @param {Function} props.onStartEditing - Function to initiate editing
 */
function TodoItem({task, isEditing, deleteTask, toggleComplete, updateTaskText, onStartEditing}) {
    const [editText, setEditText] = useState(task.text);

    /**
     * Resets edit text when task changes
     */
    useEffect(() => {
        setEditText(task.text);
    }, [task]);

    /**
     * Toggles task completion status
     */
    function handleChange() {
        toggleComplete(task.taskId);
    }

    /**
     * Initiates editing mode
     */
    function handleDoubleClick() {
        onStartEditing(task.taskId);
    }

    /**
     * Updates edit text state
     * @param {Object} e - The event object
     */
    function handleEditChange(e) {
        setEditText(e.target.value);
    }

    /**
     * Saves edited text
     * @param {Object} e - The event object
     */
    function handleSubmit(e) {
        e.preventDefault();
        updateTaskText(task.taskId, editText);
    }

    /**
     * Cancels editing and reverts to original text
     */
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
                    <button 
                        className='delete-task' 
                        onClick={() => deleteTask(task.taskId)}
                        aria-label={`Delete task ${task.text}`}
                    >
                        X
                    </button>
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