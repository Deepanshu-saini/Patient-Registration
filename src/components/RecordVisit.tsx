import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { addVisit, getAllPatients } from '../services/database';
import type { Patient } from '../services/database';

const RecordVisit: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patientId: '',
    visitDate: new Date().toISOString().split('T')[0],
    doctorName: '',
    reason: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVisit({
        patientId: parseInt(formData.patientId),
        visitDate: formData.visitDate,
        doctorName: formData.doctorName,
        reason: formData.reason,
        notes: formData.notes,
      });
      setSuccess('Visit recorded successfully!');
      setFormData({
        patientId: '',
        visitDate: new Date().toISOString().split('T')[0],
        doctorName: '',
        reason: '',
        notes: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record visit');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  return (
    <Paper sx={{ p: 3,width: '96vw' }}>
      <Typography variant="h5" gutterBottom>
        Record Patient Visit
      </Typography>

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

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Patient</InputLabel>
          <Select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            label="Select Patient"
            required
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          name="visitDate"
          label="Visit Date"
          value={formData.visitDate}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          name="doctorName"
          label="Doctor Name"
          value={formData.doctorName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          name="reason"
          label="Reason for Visit"
          value={formData.reason}
          onChange={handleChange}
          required
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          name="notes"
          label="Notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Record Visit
        </Button>
      </Box>
    </Paper>
  );
};

export default RecordVisit; 