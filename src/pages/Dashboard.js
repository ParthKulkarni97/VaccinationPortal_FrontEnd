import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { api } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    vaccinatedStudents: 0,
    upcomingDrives: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError('');
      try {
        const dashboardData = await api.getDashboardMetrics();
        setMetrics(dashboardData);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Total Students</Typography>
          <Typography variant="h4">{metrics.totalStudents ?? 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Vaccinated Students</Typography>
          <Typography variant="h4">{metrics.vaccinatedStudents ?? 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Upcoming Drives</Typography>
          <Typography variant="h4">{metrics.upcomingDrives ?? 0}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;