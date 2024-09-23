// src/components/TaskList.js (Updated)
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, setTasks, addTask, updateTask, deleteTask } from '../store/slices/tasksSlice';
import { Container, Typography, List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskFilter from './TaskFilter';
import axios from 'axios';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks);
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        if (auth.access) {
            dispatch(fetchTasks(auth.access));
        }
    }, [auth.access, dispatch]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/tasks/');

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const task = data.task;
            if (task.completed !== undefined) {
                dispatch(updateTask(task));
            } else {
                dispatch(addTask(task));
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            socket.close();
        };
    }, [dispatch]);

    const handleToggle = (task) => {
        // Toggle task completion
        axios.post(`http://localhost:8000/api/tasks/${task.id}/toggle_complete/`, {}, {
            headers: {
                Authorization: `Bearer ${auth.access}`,
            },
        });
    };

    const handleDelete = (taskId) => {
        // Delete task
        axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
            headers: {
                Authorization: `Bearer ${auth.access}`,
            },
        });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Tasks</Typography>
            <TaskFilter />
            <List>
                {tasks.map(task => (
                    <ListItem key={task.id} divider>
                        <Checkbox
                            checked={task.completed}
                            onChange={() => handleToggle(task)}
                        />
                        <ListItemText
                            primary={task.title}
                            secondary={`Due: ${new Date(task.due_date).toLocaleString()} | Priority: ${task.priority}`}
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default TaskList;
