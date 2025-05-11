import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField,
  Grid, Box, Chip, FormControl, InputLabel, MenuItem, Select,
  CircularProgress, Alert, Snackbar, Pagination
} from '@mui/material';
import { 
  FileDownload as FileDownloadIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { api } from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    vaccineName: '',
    className: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.generateVaccinationReport({
        ...filters,
        page,
        size: rowsPerPage
      });
      setReports(response.content || []);
      setTotalPages(response.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleApplyFilters = () => {
    setPage(0);
    fetchReports();
  };

  const handleResetFilters = () => {
    setFilters({
      vaccineName: '',
      className: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setPage(0);
    fetchReports();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleDownload = async (format) => {
    try {
      setLoading(true);
      const blob = await api.downloadReport(format, filters);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vaccination_report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      showSnackbar(`Report downloaded successfully as ${format.toUpperCase()}`, 'success');
    } catch (err) {
      console.error('Error downloading report:', err);
      showSnackbar('Failed to download report', 'error');
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
      case 'Fully Vaccinated': return 'success';
      case 'Partially Vaccinated': return 'warning';
      case 'Not Vaccinated': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
        <Typography variant="h4">Vaccination Reports</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />}
            onClick={() => handleDownload('csv')}
            sx={{ mr: 2 }}
          >
            Download CSV
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />}
            onClick={() => handleDownload('xlsx')}
          >
            Download Excel
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Filter Reports
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Vaccine Name"
              name="vaccineName"
              variant="outlined"
              value={filters.vaccineName}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Class</InputLabel>
              <Select
                label="Class"
                name="className"
                value={filters.className}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Classes</MenuItem>
                <MenuItem value="10">Class 10</MenuItem>
                <MenuItem value="9">Class 9</MenuItem>
                <MenuItem value="8">Class 8</MenuItem>
                <MenuItem value="7">Class 7</MenuItem>
                <MenuItem value="6">Class 6</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Fully Vaccinated">Fully Vaccinated</MenuItem>
                <MenuItem value="Partially Vaccinated">Partially Vaccinated</MenuItem>
                <MenuItem value="Not Vaccinated">Not Vaccinated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleApplyFilters}
            >
              Filter
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading && !reports.length ? (
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
                  <TableCell className="table-header-cell">Vaccine Name</TableCell>
                  <TableCell className="table-header-cell">Vaccination Date</TableCell>
                  <TableCell className="table-header-cell">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length > 0 ? (
                  reports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell>{report.studentId}</TableCell>
                      <TableCell>{report.studentName}</TableCell>
                      <TableCell>{report.className} {report.section}</TableCell>
                      <TableCell>{report.vaccineName}</TableCell>
                      <TableCell>{report.vaccinationDate ? new Date(report.vaccinationDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={report.vaccinationStatus || 'Not Vaccinated'} 
                          color={getStatusColor(report.vaccinationStatus || 'Not Vaccinated')}
                          size="small"
                          className="status-chip"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No vaccination records found
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

export default Reports;