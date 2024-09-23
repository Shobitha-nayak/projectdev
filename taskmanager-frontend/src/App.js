// src/App.js (Updated with Toast Notifications)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { SnackbarProvider, useSnackbar } from 'notistack';

const AppContent = () => {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogout = () => {
        dispatch(logout());
        enqueueSnackbar('Logged out successfully', { variant: 'info' });
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Task Manager
                    </Typography>
                    {auth.access ? (
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    ) : null}
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/tasks" element={auth.access ? <TaskList /> : <Navigate to="/login" />} />
                <Route path="/add-task" element={auth.access ? <TaskForm /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/tasks" />} />
            </Routes>
        </>
    );
};

const App = () => (
    <SnackbarProvider maxSnack={3}>
        <Router>
            <AppContent />
        </Router>
    </SnackbarProvider>
);

export default App;
