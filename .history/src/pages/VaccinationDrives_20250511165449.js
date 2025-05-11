import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Alert } from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import api from "../services/api";

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDrives()
      .then(data => {
        setDrives(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load drives.");
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vaccination Drives
      </Typography>
      {loading && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Grid>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      )}
      {!loading && !error && drives.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          No vaccination drives found.
        </Typography>
      )}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {drives.map((drive, idx) => (
          <Grid item xs={12} sm={6} md={4} key={drive._id || idx}>
            <Card>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <VaccinesIcon color="primary" fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">{drive.vaccineName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Doses: {drive.availableDoses ?? "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {drive.status ?? "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VaccinationDrives;