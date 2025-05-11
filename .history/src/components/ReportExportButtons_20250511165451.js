import React, { useState } from "react";
import { Button, Stack, CircularProgress, Alert } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const ReportExportButtons = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async (format) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE}/reports/download?format=${format}`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], {
        type:
          format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `report.${format === "excel" ? "xlsx" : "pdf"}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to export report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FileDownloadIcon />}
          onClick={() => handleExport("excel")}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Export Excel"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<FileDownloadIcon />}
          onClick={() => handleExport("pdf")}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Export PDF"}
        </Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </div>
  );
};

export default ReportExportButtons;