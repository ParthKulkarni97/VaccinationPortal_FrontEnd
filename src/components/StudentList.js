import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField,
  Grid, Box, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  MenuItem, Select, Pagination, CircularProgress, Alert,
  Snackbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { api } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    className: '',
    section: '',
    dateOfBirth: ''
  });
  const [csvFile, setCsvFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchStudents();
  }, [page, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.getStudents(page, rowsPerPage, searchTerm);
      setStudents(response.content || []);
      setTotalPages(response.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        studentId: student.studentId,
        name: student.name,
        className: student.className,
        section: student.section,
        dateOfBirth: student.dateOfBirth
      });
    } else {
      setSelectedStudent(null);
      setFormData({
        studentId: '',
        name: '',
        className: '',
        section: '',
        dateOfBirth: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setCsvFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedStudent) {
        await api.updateStudent(selectedStudent.id, formData);
        showSnackbar('Student updated successfully', 'success');
      } else {
        await api.addStudent(formData);
        showSnackbar('Student added successfully', 'success');
      }
      handleCloseDialog();
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      showSnackbar('Failed to save student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setLoading(true);
        await api.deleteStudent(id);
        showSnackbar('Student deleted successfully', 'success');
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        showSnackbar('Failed to delete student', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUploadCsv = async () => {
    if (!csvFile) {
      showSnackbar('Please select a file', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.uploadStudentsCsv(csvFile);
      showSnackbar('Students uploaded successfully', 'success');
      handleCloseUploadDialog();
      fetchStudents();
    } catch (err) {
      console.error('Error uploading students:', err);
      showSnackbar('Failed to upload students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
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
      case 'Fully Vaccinated': return 'success';
      case 'Partially Vaccinated': return 'warning';
      case 'Not Vaccinated': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
        <Typography variant="h4">Students</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<UploadIcon />}
            onClick={handleOpenUploadDialog}
            sx={{ mr: 2 }}
          >
            Upload CSV
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Student
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Students"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                endAdornment: <SearchIcon color="action" />
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading && !students.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="table-header-cell">Student ID</TableCell>
                  <TableCell className="table-header-cell">Name</TableCell>
                  <TableCell className="table-header-cell">Class</TableCell>
                  <TableCell className="table-header-cell">Section</TableCell>
                  <TableCell className="table-header-cell">Date of Birth</TableCell>
                  <TableCell className="table-header-cell">Vaccination Status</TableCell>
                  <TableCell className="table-header-cell">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={student.vaccinationStatus || 'Not Vaccinated'} 
                          color={getStatusColor(student.vaccinationStatus || 'Not Vaccinated')}
                          size="small"
                          className="status-chip"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(student)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(student.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages} 
                page={page + 1} 
                onChange={handlePageChange}
                color="primary" 
              />
            </Box>
          )}
        </>
      )}

      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                name="studentId"
                variant="outlined"
                value={formData.studentId}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Class</InputLabel>
                <Select
                  label="Class"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                >
                  <MenuItem value="10">Class 10</MenuItem>
                  <MenuItem value="9">Class 9</MenuItem>
                  <MenuItem value="8">Class 8</MenuItem>
                  <MenuItem value="7">Class 7</MenuItem>
                  <MenuItem value="6">Class 6</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Section</InputLabel>
                <Select
                  label="Section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                >
                  <MenuItem value="A">Section A</MenuItem>
                  <MenuItem value="B">Section B</MenuItem>
                  <MenuItem value="C">Section C</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
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
            {loading ? <CircularProgress size={24} /> : (selectedStudent ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload CSV Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Students CSV</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Upload a CSV file with student data. The file should have the following columns:
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 2 }}>
              <ul>
                <li>studentId</li>
                <li>name</li>
                <li>className</li>
                <li>section</li>
                <li>dateOfBirth (YYYY-MM-DD format)</li>
              </ul>
            </Typography>
            <TextField
              type="file"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onChange={handleFileChange}
              inputProps={{ accept: '.csv' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUploadCsv}
            disabled={!csvFile || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
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

export default Students;