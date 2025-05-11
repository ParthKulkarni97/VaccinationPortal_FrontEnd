import React, { useState } from "react";
import { Container, Typography, TextField, Button, MenuItem, Alert, Box } from "@mui/material";
import api from "../services/api";

const classOptions = ["5", "6", "7", "8", "9", "10", "11", "12"];

const AddDrive = () => {
  const [form, setForm] = useState({
    vaccineName: "",
    driveDate: "",
    availableDoses: "",
    applicableClasses: []
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassChange = (e) => {
    setForm(prev => ({
      ...prev,
      applicableClasses: Array.from(e.target.selectedOptions, option => option.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.addDrive({
        ...form,
        availableDoses: Number(form.availableDoses),
        applicableClasses: form.applicableClasses
      });
      setSuccess("Drive created successfully!");
      setForm({ vaccineName: "", driveDate: "", availableDoses: "", applicableClasses: [] });
    } catch (err) {
      setError(err.response?.data || "Failed to create drive.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Add Vaccination Drive</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Vaccine Name"
          name="vaccineName"
          value={form.vaccineName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Drive Date"
          name="driveDate"
          type="date"
          value={form.driveDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Available Doses"
          name="availableDoses"
          type="number"
          value={form.availableDoses}
          onChange={handleChange}
          required
        />
        <TextField
          label="Applicable Classes"
          name="applicableClasses"
          select
          SelectProps={{ multiple: true, native: true }}
          value={form.applicableClasses}
          onChange={handleClassChange}
          required
        >
          {classOptions.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </TextField>
        <Button type="submit" variant="contained">Create Drive</Button>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default AddDrive;