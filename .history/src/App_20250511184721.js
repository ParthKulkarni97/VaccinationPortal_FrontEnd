import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import VaccinationDrives from './pages/VaccinationDrives';
import Reports from './pages/Reports';
import Footer from './components/Footer';
import Login from './pages/Login';
import AddDrive from "./pages/AddDrive";
// Import new components
import StudentVaccination from './pages/StudentVaccination';
import VaccinationReport from './pages/VaccinationReport';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#388e3c' },
    background: { default: '#f5f6fa' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' } } },
  },
});

function AppContent() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="app-container">
      {isLoggedIn && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          {/* Add new routes for vaccination */}
          <Route
            path="/students/vaccination"
            element={
              <PrivateRoute>
                <StudentVaccination />
              </PrivateRoute>
            }
          />
          <Route
            path="/vaccination-report"
            element={
              <PrivateRoute>
                <VaccinationReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/drives"
            element={
              <PrivateRoute>
                <VaccinationDrives />
              </PrivateRoute>
            }
          />
          <Route
            path="/drives/add"
            element={
              <PrivateRoute>
                <AddDrive />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {isLoggedIn && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;