// Example usage in a page component
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { fetchStudents } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        setStudents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch students');
        setLoading(false);
      }
    };

    getStudents();
  }, []);

  if (loading) {
    return <Loading message="Loading students data..." />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Render your students data here
  return (
    <div>
      {/* Your students table or cards */}
    </div>
  );
};

export default Students;