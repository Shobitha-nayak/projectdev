// src/components/TaskFilter.js
import React, { useState } from 'react';
import { TextField, MenuItem, Button, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchTasks } from '../store/slices/tasksSlice';

const TaskFilter = () => {
    const dispatch = useDispatch();
    const [priority, setPriority] = useState('');
    const [completed, setCompleted] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleFilter = () => {
        // Build query params based on filters
        let query = '?';
        if (priority) query += `priority=${priority}&`;
        if (completed !== '') query += `completed=${completed}&`;
        if (dueDate) query += `due_date=${dueDate}&`;
        dispatch(fetchTasks(query));
    };

    const handleReset = () => {
        setPriority('');
        setCompleted('');
        setDueDate('');
        dispatch(fetchTasks());
    };

    return (
        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={3}>
                <TextField
                    select
                    label="Priority"
                    fullWidth
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    select
                    label="Completed"
                    fullWidth
                    value={completed}
                    onChange={(e) => setCompleted(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Completed</MenuItem>
                    <MenuItem value="false">Incomplete</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Due Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleFilter} style={{ marginRight: '10px' }}>
                    Filter
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                    Reset
                </Button>
            </Grid>
        </Grid>
    );
};

export default TaskFilter;
