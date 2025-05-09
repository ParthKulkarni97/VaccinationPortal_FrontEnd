import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, 
  Card, CardContent, CircularProgress, Alert
} from '@mui/material';
import { 
  Person as PersonIcon,
  Vaccines as VaccineIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { fetchStudents, fetchDrives } from '../services/api';


const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await api.getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const dashboardCards = [
    { 
      title: 'Total Students', 
      value: metrics?.totalStudents || 0, 
      icon: <PersonIcon className="dashboard-icon" />,
      color: '#e3f2fd'
    },
    { 
      title: 'Vaccinated Students', 
      value: metrics?.vaccinatedStudents || 0, 
      icon: <CheckCircleIcon className="dashboard-icon" />,
      color: '#e8f5e9'
    },
    { 
      title: 'Upcoming Drives', 
      value: metrics?.upcomingDrives || 0, 
      icon: <EventIcon className="dashboard-icon" />,
      color: '#fff8e1'
    },
    { 
      title: 'Completed Drives', 
      value: metrics?.completedDrives || 0, 
      icon: <VaccineIcon className="dashboard-icon" />,
      color: '#f3e5f5'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, mt: 2 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              className="dashboard-card" 
              sx={{ backgroundColor: card.color }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                {card.icon}
                <Typography variant="h5" component="div" className="dashboard-stat">
                  {card.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Vaccination Status
            </Typography>
            {metrics?.totalStudents > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={(metrics.vaccinatedStudents / metrics.totalStudents) * 100} 
                    size={180}
                    thickness={5}
                    sx={{ color: '#4caf50' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" component="div" color="text.secondary">
                      {Math.round((metrics.vaccinatedStudents / metrics.totalStudents) * 100)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250 }}>
                <Typography variant="body1" color="text.secondary">
                  No student data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Vaccination Drives
            </Typography>
            {metrics?.upcomingDrivesList && metrics.upcomingDrivesList.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {metrics.upcomingDrivesList.map((drive, index) => (
                  <Box key={index} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2" color="text.primary">
                      {drive.vaccineName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(drive.driveDate).toLocaleDateString()} - {drive.availableDoses} doses available
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming drives
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;