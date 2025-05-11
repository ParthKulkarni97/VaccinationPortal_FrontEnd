import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Style for active navigation link
  const navLinkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  };

  const activeStyle = {
    borderBottom: '2px solid white'
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 4 }}>
          Vaccination Portal
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            component={NavLink} 
            to="/"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            Dashboard
          </Button>

          <Button 
            color="inherit" 
            component={NavLink} 
            to="/students"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            Students
          </Button>

          {/* New Vaccination Button */}
          <Button 
            color="inherit" 
            component={NavLink} 
            to="/students/vaccination"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            Vaccinate
          </Button>

          <Button 
            color="inherit" 
            component={NavLink} 
            to="/drives"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            Drives
          </Button>

          <Button 
            color="inherit" 
            component={NavLink} 
            to="/drives/add"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            Add Drive
          </Button>

          <Button 
            color="inherit" 
            component={NavLink} 
            to="/reports"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            Reports
          </Button>

          {/* New Vaccination Report Button */}
          <Button 
            color="inherit" 
            component={NavLink} 
            to="/vaccination-report"
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeStyle : {})
            })}
          >
            Vaccination Report
          </Button>
        </Box>

        {/* Logout button stays at the end */}
        <Button 
          color="inherit" 
          onClick={handleLogout}
          sx={{ ml: 2 }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;