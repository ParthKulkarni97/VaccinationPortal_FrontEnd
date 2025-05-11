import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { api } from '../api';

function StudentVaccination() {
  const [students, setStudents] = useState({ content: [], totalElements: 0 });
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'info' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, drivesData] = await Promise.all([
          api.getStudents(),
          api.getDrives()
        ]);
        setStudents(studentsData);
        setDrives(drivesData);
      } catch (error) {
        setMessage({ text: 'Error loading data', severity: 'error' });
      }
    };
    fetchData();
  }, []);

  const handleVaccinate = async (studentId) => {
    if (!selectedDrive) {
      setMessage({ text: 'Please select a vaccination drive', severity: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const drive = drives.find(d => d.id === selectedDrive);
      const record = {
        driveId: drive.id,
        vaccineName: drive.vaccineName,
        dateAdministered: new Date().toISOString().slice(0, 10),
        status: 'Administered'
      };
      await api.vaccinateStudent(studentId, record);
      setMessage({ text: 'Vaccination recorded successfully!', severity: 'success' });
      // Refresh students list
      const updatedStudents = await api.getStudents();
      setStudents(updatedStudents);
    } catch (err) {
      setMessage({ 
        text: err.response?.data || 'Error marking vaccination', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Student Vaccination
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Vaccination Drive</InputLabel>
          <Select
            value={selectedDrive}
            onChange={(e) => setSelectedDrive(e.target.value)}
            label="Select Vaccination Drive"
          >
            <MenuItem value="">
              <em>-- Select Drive --</em>
            </MenuItem>
            {drives.map((drive) => (
              <MenuItem key={drive.id} value={drive.id}>
                {drive.vaccineName} ({drive.driveDate})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {message.text && (
          <Alert severity={message.severity} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Vaccination Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.content.map((student) => {
                const vaccinated = selectedDrive && student.vaccinations?.some(
                  v => v.driveId === selectedDrive && v.status === 'Administered'
                );
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>
                      {selectedDrive
                        ? (vaccinated ? 'Vaccinated' : 'Not Vaccinated')
                        : 'Select a drive'}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!selectedDrive || vaccinated || loading}
                        onClick={() => handleVaccinate(student.studentId)}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Mark as Vaccinated'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default StudentVaccination;