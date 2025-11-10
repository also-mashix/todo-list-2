import React, { useEffect, useRef } from 'react';

/**
 * TaskForm component - handles task input and submission
 * @param {string} props.text - Current text in the input field
 * @param {Function} props.setText - Function to update the text state
 * @param {Function} props.addTask - Function to add a new task
 */
function TaskForm({ text, setText, addTask }) {
    const inputRef = useRef(null);

    function handleSubmit() {
        const trimmedText = text.trim();
        if (!trimmedText) {
            return;
        }
        addTask(trimmedText);
        setText('');
    }

    /**
     * Sets up global key handler to focus input when '/' is pressed
     */
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            // Only trigger when '/' is pressed with no modifier keys
            if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [setText]);

    return (
        <div className="task-form">
            <input 
                ref={inputRef}
                className="todo-input"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
                placeholder="Type to add a task..."
            />
            <button className='add-task' onClick={handleSubmit}>Add</button>
        </div>
    );
}

export default TaskForm;
