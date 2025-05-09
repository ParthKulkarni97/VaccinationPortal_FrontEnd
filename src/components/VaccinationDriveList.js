import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField,
  Grid, Box, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  MenuItem, Select, Tabs, Tab, CircularProgress, Alert,
  Snackbar, Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { api } from '../services/api';

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openVaccinateDialog, setOpenVaccinateDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [formData, setFormData] = useState({
    vaccineName: '',
    driveDate: '',
    availableDoses: '',
    applicableClasses: [],
    status: 'Scheduled'
  });
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchDrives();
  }, [tabValue]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      let response;
      if (tabValue === 0) {
        response = await api.getUpcomingDrives();
      } else {
        response = await api.getCompletedDrives();
      }
      setDrives(response || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching drives:', err);
      setError('Failed to load vaccination drives. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.getStudents(0, 1000); // Get all students for vaccination
      setStudents(response.content || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      showSnackbar('Failed to load students', 'error');
    }
  };

  const handleOpenDialog = (drive = null) => {
    if (drive) {
      setSelectedDrive(drive);
      setFormData({
        vaccineName: drive.vaccineName,
        driveDate: drive.driveDate,
        availableDoses: drive.availableDoses,
        applicableClasses: drive.applicableClasses || [],
        status: drive.status
      });
    } else {
      setSelectedDrive(null);
      setFormData({
        vaccineName: '',
        driveDate: '',
        availableDoses: '',
        applicableClasses: [],
        status: 'Scheduled'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDrive(null);
  };

  const handleOpenVaccinateDialog = (drive) => {
    setSelectedDrive(drive);
    setSelectedStudents([]);
    fetchStudents();
    setOpenVaccinateDialog(true);
  };

  const handleCloseVaccinateDialog = () => {
    setOpenVaccinateDialog(false);
    setSelectedDrive(null);
    setSelectedStudents([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleClassesChange = (e) => {
    setFormData({
      ...formData,
      applicableClasses: e.target.value
    });
  };

  const handleStudentSelection = (e) => {
    setSelectedStudents(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedDrive) {
        await api.updateDrive(selectedDrive.id, formData);
        showSnackbar('Vaccination drive updated successfully', 'success');
      } else {
        await api.addDrive(formData);
        showSnackbar('Vaccination drive scheduled successfully', 'success');
      }
      handleCloseDialog();
      fetchDrives();
    } catch (err) {
      console.error('Error saving drive:', err);
      showSnackbar('Failed to save vaccination drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vaccination drive?')) {
      try {
        setLoading(true);
        await api.deleteDrive(id);
        showSnackbar('Vaccination drive deleted successfully', 'success');
        fetchDrives();
      } catch (err) {
        console.error('Error deleting drive:', err);
        showSnackbar('Failed to delete vaccination drive', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVaccinate = async () => {
    if (selectedStudents.length === 0) {
      showSnackbar('Please select at least one student', 'error');
      return;
    }

    try {
      setLoading(true);
      const promises = selectedStudents.map(studentId => 
        api.updateStudentVaccination(studentId, selectedDrive.id)
      );
      await Promise.all(promises);
      showSnackbar(`${selectedStudents.length} students vaccinated successfully`, 'success');
      handleCloseVaccinateDialog();
      fetchDrives();
    } catch (err) {
      console.error('Error vaccinating students:', err);
      showSnackbar('Failed to vaccinate students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return 'primary';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const isDateInPast = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
        <Typography variant="h4">Vaccination Drives</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Schedule Drive
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            icon={<EventIcon />} 
            label="Upcoming Drives" 
            iconPosition="start"
          />
          <Tab 
            icon={<CheckCircleIcon />} 
            label="Completed Drives" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {loading && !drives.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell">Vaccine Name</TableCell>
                <TableCell className="table-header-cell">Date</TableCell>
                <TableCell className="table-header-cell">Available Doses</TableCell>
                <TableCell className="table-header-cell">Applicable Classes</TableCell>
                <TableCell className="table-header-cell">Status</TableCell>
                <TableCell className="table-header-cell">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drives.length > 0 ? (
                drives.map((drive) => (
                  <TableRow key={drive.id}>
                    <TableCell>{drive.vaccineName}</TableCell>
                    <TableCell>{new Date(drive.driveDate).toLocaleDateString()}</TableCell>
                    <TableCell>{drive.availableDoses}</TableCell>
                    <TableCell>{drive.applicableClasses?.join(', ') || 'All'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={drive.status} 
                        color={getStatusColor(drive.status)}
                        size="small"
                        className="status-chip"
                      />
                    </TableCell>
                    <TableCell>
                      {tabValue === 0 && (
                        <>
                          <Tooltip title="Vaccinate Students">
                            <IconButton 
                              size="small" 
                              color="success" 
                              onClick={() => handleOpenVaccinateDialog(drive)}
                            >
                              <PersonAddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Drive">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => handleOpenDialog(drive)}
                              disabled={isDateInPast(drive.driveDate)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Drive">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDelete(drive.id)}
                              disabled={isDateInPast(drive.driveDate)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {tabValue === 0 ? 'No upcoming vaccination drives' : 'No completed vaccination drives'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Schedule Drive Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedDrive ? 'Edit Vaccination Drive' : 'Schedule Vaccination Drive'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vaccine Name"
                name="vaccineName"
                variant="outlined"
                value={formData.vaccineName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Drive Date"
                name="driveDate"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={formData.driveDate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Available Doses"
                name="availableDoses"
                type="number"
                variant="outlined"
                value={formData.availableDoses}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Applicable Classes</InputLabel>
                <Select
                  multiple
                  label="Applicable Classes"
                  name="applicableClasses"
                  value={formData.applicableClasses}
                  onChange={handleClassesChange}
                >
                  <MenuItem value="10">Class 10</MenuItem>
                  <MenuItem value="9">Class 9</MenuItem>
                  <MenuItem value="8">Class 8</MenuItem>
                  <MenuItem value="7">Class 7</MenuItem>
                  <MenuItem value="6">Class 6</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (selectedDrive ? 'Update' : 'Schedule')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vaccinate Students Dialog */}
      <Dialog open={openVaccinateDialog} onClose={handleCloseVaccinateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Vaccinate Students</DialogTitle>
        <DialogContent>
          {selectedDrive && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Vaccination Drive: {selectedDrive.vaccineName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Date: {new Date(selectedDrive.driveDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Available Doses: {selectedDrive.availableDoses}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                Applicable Classes: {selectedDrive.applicableClasses?.join(', ') || 'All'}
              </Typography>

              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <InputLabel>Select Students to Vaccinate</InputLabel>
                <Select
                  multiple
                  label="Select Students to Vaccinate"
                  value={selectedStudents}
                  onChange={handleStudentSelection}
                  renderValue={(selected) => {
                    const selectedNames = selected.map(id => {
                      const student = students.find(s => s.id === id);
                      return student ? student.name : '';
                    }).join(', ');
                    return selectedNames;
                  }}
                >
                  {students
                    .filter(student => 
                      !student.vaccinationStatus || 
                      student.vaccinationStatus !== 'Fully Vaccinated'
                    )
                    .filter(student => 
                      !selectedDrive.applicableClasses?.length || 
                      selectedDrive.applicableClasses.includes(student.className)
                    )
                    .map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name} - Class {student.className}{student.section}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              
              {selectedStudents.length > 0 && (
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Selected {selectedStudents.length} students for vaccination
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVaccinateDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleVaccinate}
            disabled={loading || selectedStudents.length === 0}
            color="success"
          >
            {loading ? <CircularProgress size={24} /> : 'Vaccinate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VaccinationDrives;