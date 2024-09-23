// src/components/TaskForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../store/slices/tasksSlice';
import { TextField, Button, Container, MenuItem } from '@mui/material';
import axios from 'axios';

const TaskForm = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = { title, description, due_date: dueDate, priority, assigned_to_id: auth.user.id };
        try {
            const response = await axios.post('http://localhost:8000/api/tasks/', newTask, {
                headers: {
                    Authorization: `Bearer ${auth.access}`,
                },
            });
            dispatch(addTask(response.data));
            // Reset form
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('medium');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Title" 
                    fullWidth 
                    margin="normal" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <TextField 
                    label="Description" 
                    fullWidth 
                    margin="normal" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
                <TextField 
                    label="Due Date" 
                    type="datetime-local" 
                    fullWidth 
                    margin="normal" 
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    required 
                />
                <TextField
                    select
                    label="Priority"
                    fullWidth
                    margin="normal"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary">Add Task</Button>
            </form>
        </Container>
    );
};

export default TaskForm;
