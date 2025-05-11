import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Students
  getStudents: async (page = 0, size = 10, searchTerm = '') => {
    try {
      const response = await apiClient.get(`/students`, {
        params: { page, size, searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  
  addStudent: async (student) => {
    try {
      const response = await apiClient.post(`/students`, student);
      return response.data;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },
  
  updateStudent: async (id, student) => {
    try {
      const response = await apiClient.put(`/students/${id}`, student);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },
  
  deleteStudent: async (id) => {
    try {
      const response = await apiClient.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  // Vaccination Drives
  getDrives: async () => {
    try {
      const response = await apiClient.get(`/drives`);
      return response.data;
    } catch (error) {
      console.error('Error fetching drives:', error);
      throw error;
    }
  },
  
  getUpcomingDrives: async () => {
    try {
      const response = await apiClient.get(`/drives/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming drives:', error);
      throw error;
    }
  },
  
  getCompletedDrives: async () => {
    try {
      const response = await apiClient.get(`/drives/completed`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed drives:', error);
      throw error;
    }
  },
  
  addDrive: async (drive) => {
    try {
      const response = await apiClient.post(`/drives`, drive);
      return response.data;
    } catch (error) {
      console.error('Error adding drive:', error);
      throw error;
    }
  },
  
  updateDrive: async (id, drive) => {
    try {
      const response = await apiClient.put(`/drives/${id}`, drive);
      return response.data;
    } catch (error) {
      console.error('Error updating drive:', error);
      throw error;
    }
  },
  
  deleteDrive: async (id) => {
    try {
      const response = await apiClient.delete(`/drives/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting drive:', error);
      throw error;
    }
  },

  // Dashboard
  getDashboardMetrics: async () => {
    try {
      const response = await apiClient.get(`/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },
  
  // Student Vaccination
  updateStudentVaccination: async (studentId, driveId) => {
    try {
      const response = await apiClient.post(`/students/${studentId}/vaccinate`, { driveId });
      return response.data;
    } catch (error) {
      console.error('Error updating student vaccination:', error);
      throw error;
    }
  },
  
  // Reports
  generateVaccinationReport: async (filters) => {
    try {
      const response = await apiClient.get(`/reports/vaccination`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error generating vaccination report:', error);
      throw error;
    }
  },
  
  downloadReport: async (format, filters) => {
    try {
      const response = await apiClient.get(`/reports/download`, {
        params: { ...filters, format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },
  
  // CSV Upload
  uploadStudentsCsv: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post(`/students/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading students CSV:', error);
      throw error;
    }
  }
};

export default api;