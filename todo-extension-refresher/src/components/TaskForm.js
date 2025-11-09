import React, { useEffect, useRef } from 'react';

function TaskForm({ text, setText, addTask }) {
    const inputRef = useRef(null);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            const activeElement = document.activeElement;
            // Only handle if no input/textarea is focused and key is a printable character
            if (activeElement.tagName !== 'INPUT' && 
                activeElement.tagName !== 'TEXTAREA' &&
                e.key.length === 1 && 
                !e.ctrlKey && 
                !e.metaKey && 
                !e.altKey) {
                e.preventDefault();
                inputRef.current.focus();
                // If input was empty, clear it first
                if (!text) {
                    setText(e.key);
                } else {
                    // Otherwise append to existing text
                    setText(prev => prev + e.key);
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [text, setText]);

    return (
        <div className="task-form">
            <input 
                ref={inputRef}
                className="todo-input"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter' && text.trim()) {
                        addTask(text);
                    }
                }}
                placeholder="Type to add a task..."
            />
            <button className='add-task' onClick={() => addTask(text)}>Add</button>
        </div>
    );
}

export default TaskForm;
