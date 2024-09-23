// src/components/Login.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';

const Login = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ username, password }));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Login</Typography>
            {auth.error && <Alert severity="error">{JSON.stringify(auth.error)}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Username" 
                    fullWidth 
                    margin="normal" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    fullWidth 
                    margin="normal" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={auth.status === 'loading'}
                >
                    {auth.status === 'loading' ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </Container>
    );
};

export default Login;
