import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material';
import { Visibility as VisibilityIcon, History as HistoryIcon } from '@mui/icons-material';
import { getAllPatients, getPatientById } from '../services/database';
import type { Patient } from '../services/database';
import VisitHistory from './VisitHistory';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openVisitsDialog, setOpenVisitsDialog] = useState(false);

  const fetchPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleViewDetails = async (patientId: number) => {
    try {
      const patient = await getPatientById(patientId);
      if (patient) {
        setSelectedPatient(patient);
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
    }
  };

  const handleViewVisits = async (patientId: number) => {
    try {
      const patient = await getPatientById(patientId);
      if (patient) {
        setSelectedPatient(patient);
        setOpenVisitsDialog(true);
      }
    } catch (error) {
      console.error('Failed to fetch patient visits:', error);
    }
  };

  const handleVisitUpdate = async () => {
    if (selectedPatient) {
      const updatedPatient = await getPatientById(selectedPatient.id);
      if (updatedPatient) {
        setSelectedPatient(updatedPatient);
        fetchPatients(); // Refresh the patient list
      }
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.phone?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Paper sx={{ p: 3, width: '96vw', maxWidth: '100vw' }}>
      <Typography variant="h5" gutterBottom>
        Patient List
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Patients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone"
        />
      </Box>

      <TableContainer sx={{ width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Visit Status</TableCell>
              <TableCell>Visit Count</TableCell>
              <TableCell>Visit History</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  {patient.first_name} {patient.last_name}
                </TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>
                  <Chip
                    label={patient.allowed_to_visit ? 'Allowed' : 'Blocked'}
                    color={patient.allowed_to_visit ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{patient.visit_count}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewVisits(patient.id)}
                    startIcon={<HistoryIcon />}
                  >
                    View History
                  </Button>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(patient.id)}
                      title="View Details"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Patient Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Patient Details: {selectedPatient?.first_name} {selectedPatient?.last_name}
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <Typography variant="subtitle2">Date of Birth</Typography>
                  <Typography>{new Date(selectedPatient.date_of_birth).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <Typography variant="subtitle2">Gender</Typography>
                  <Typography>{selectedPatient.gender}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography>{selectedPatient.phone}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{selectedPatient.email}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 100%' }}>
                  <Typography variant="subtitle2">Address</Typography>
                  <Typography>{selectedPatient.address}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <Typography variant="subtitle2">Blood Group</Typography>
                  <Typography>{selectedPatient.blood_group}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <Typography variant="subtitle2">Insurance Provider</Typography>
                  <Typography>{selectedPatient.insurance_provider}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <Typography variant="subtitle2">Insurance Number</Typography>
                  <Typography>{selectedPatient.insurance_number}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 100%' }}>
                  <Typography variant="subtitle2">Allergies</Typography>
                  <Typography>{selectedPatient.allergies}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 100%' }}>
                  <Typography variant="subtitle2">Medical Conditions</Typography>
                  <Typography>{selectedPatient.conditions}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 100%' }}>
                  <Typography variant="subtitle2">Current Medications</Typography>
                  <Typography>{selectedPatient.medications}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Visit History Dialog */}
      <Dialog
        open={openVisitsDialog}
        onClose={() => setOpenVisitsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Visit History: {selectedPatient?.first_name} {selectedPatient?.last_name}
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <VisitHistory
              patient={selectedPatient}
              onUpdate={handleVisitUpdate}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVisitsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PatientList; 