import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getPatientById } from '../services/database';
import type { PatientWithVisits } from '../services/database';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientWithVisits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (!id) return;
        const data = await getPatientById(parseInt(id, 10));
        setPatient(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch patient details');
        console.error('Error fetching patient:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Box sx={{ p: 3,width: '96vw'}}>
        <Alert severity="error">{error || 'Patient not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patients')}
          sx={{ mt: 2 }}
        >
          Back to Patient List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/patients')}
        sx={{ mb: 3 }}
      >
        Back to Patient List
      </Button>

      <Paper sx={{ p: 3, mb: 3,width: '92vw' }}>
        <Typography variant="h4" gutterBottom>
          Patient Details
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Name</Typography>
            <Typography variant="body1" gutterBottom>
              {`${patient.first_name} ${patient.last_name}`}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Status</Typography>
            <Chip
              label={patient.allowed_to_visit ? 'Active' : 'Inactive'}
              color={patient.allowed_to_visit ? 'success' : 'default'}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Date of Birth</Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(patient.date_of_birth).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Gender</Typography>
            <Typography variant="body1" gutterBottom>
              {patient.gender}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Email</Typography>
            <Typography variant="body1" gutterBottom>
              {patient.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Phone</Typography>
            <Typography variant="body1" gutterBottom>
              {patient.phone}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
            <Typography variant="subtitle1" color="text.secondary">Address</Typography>
            <Typography variant="body1" gutterBottom>
              {patient.address}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Blood Group</Typography>
            <Typography variant="body1" gutterBottom>
              {patient.blood_group || 'Not specified'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Insurance Provider</Typography>
            <Typography variant="body1" gutterBottom>
              {patient.insurance_provider || 'Not specified'}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
            <Typography variant="subtitle1" color="text.secondary">Medical Information</Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Allergies:</strong> {patient.allergies || 'None'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Conditions:</strong> {patient.conditions || 'None'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Medications:</strong> {patient.medications || 'None'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Visit History
        </Typography>
        {patient.visits && patient.visits.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{visit.doctor_name}</TableCell>
                    <TableCell>{visit.reason}</TableCell>
                    <TableCell>{visit.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary">No visit history available</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PatientDetails; 