import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Vaccination Portal
        </Typography>
        <Button color="inherit" component={NavLink} to="/">Dashboard</Button>
        <Button color="inherit" component={NavLink} to="/students">Students</Button>
        <Button color="inherit" component={NavLink} to="/drives">Drives</Button>
        <Button color="inherit" component={NavLink} to="/reports">Reports</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;