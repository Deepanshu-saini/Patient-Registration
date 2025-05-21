import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { getAllPatients, searchPatients } from '../services/database';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      if (query.trim()) {
        const results = await searchPatients(query);
        setPatients(results);
      } else {
        await loadPatients();
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Patient List
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Patients"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>
                  {patient.first_name} {patient.last_name}
                </TableCell>
                <TableCell>
                  {new Date(patient.date_of_birth).toLocaleDateString()}
                </TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PatientList;