import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  Avatar
} from '@mui/material';
import { addPatient } from '../services/database';

const PatientRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    conditions: '',
    medications: '',
    insuranceProvider: '',
    insuranceNumber: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPatient(formData);
      setSuccess('Patient registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        bloodGroup: '',
        allergies: '',
        conditions: '',
        medications: '',
        insuranceProvider: '',
        insuranceNumber: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register patient');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Paper sx={{ p: 3, width:'95vw' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            src="https://img.freepik.com/free-vector/medical-healthcare-logo-design_23-2149611238.jpg"
            alt="Medical Logo"
            sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Patient Registration
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Please fill in the patient's information below
          </Typography>
        </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={1}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              select
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </TextField>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Insurance Provider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
            <TextField
              fullWidth
              label="Allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              multiline
              rows={1}
              placeholder="List any allergies, separated by commas"
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
            <TextField
              fullWidth
              label="Medical Conditions"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              multiline
              rows={1}
              placeholder="List any medical conditions, separated by commas"
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
            <TextField
              fullWidth
              label="Current Medications"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              multiline
              rows={1}
              placeholder="List current medications, separated by commas"
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              !formData.firstName ||
              !formData.lastName ||
              !formData.dateOfBirth ||
              !formData.gender ||
              !formData.email ||
              !formData.phone ||
              !formData.address
            }
          >
            Register Patient
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PatientRegistration; 