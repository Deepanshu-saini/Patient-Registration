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
import type { SelectChangeEvent } from '@mui/material';
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
      if (!formData.patientId || !formData.visitDate || !formData.doctorName || !formData.reason) {
        throw new Error('Please fill in all required fields');
      }

      await addVisit({
        patient_id: parseInt(formData.patientId),
        visit_date: formData.visitDate,
        doctor_name: formData.doctorName,
        reason: formData.reason,
        notes: formData.notes || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      patientId: e.target.value,
    }));
  };

  return (
    <Paper sx={{ p: 3, width: '96vw' }}>
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
            onChange={handleSelectChange}
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
          label="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              !formData.patientId ||
              !formData.visitDate ||
              !formData.doctorName ||
              !formData.reason
            }
          >
            Record Visit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RecordVisit; 