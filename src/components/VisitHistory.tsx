import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { addVisit, updateVisitStatus } from '../services/database';

interface Visit {
  id: number;
  visit_date: string;
  doctor_name: string;
  reason: string;
  notes: string;
}

interface Patient {
  id: number;
  allowed_to_visit: boolean;
  visit_count: number;
  visits: Visit[];
}

interface VisitHistoryProps {
  patient: Patient;
  onUpdate: () => void;
}

const VisitHistory: React.FC<VisitHistoryProps> = ({ patient, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [newVisit, setNewVisit] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    doctorName: '',
    reason: '',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddVisit = async () => {
    try {
      if (!patient.allowed_to_visit) {
        setError('Patient is not allowed to visit');
        return;
      }

      await addVisit({
        patientId: patient.id,
        visitDate: newVisit.visitDate,
        doctorName: newVisit.doctorName,
        reason: newVisit.reason,
        notes: newVisit.notes,
      });

      setOpen(false);
      setNewVisit({
        visitDate: new Date().toISOString().split('T')[0],
        doctorName: '',
        reason: '',
        notes: '',
      });
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add visit');
    }
  };

  const handleToggleVisitStatus = async () => {
    try {
      setError(null);
      const updatedPatient = await updateVisitStatus(patient.id, !patient.allowed_to_visit);
      if (updatedPatient) {
        onUpdate();
      } else {
        setError('Failed to update visit status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update visit status');
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Visit History</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={patient.allowed_to_visit}
                onChange={handleToggleVisitStatus}
                color="primary"
              />
            }
            label="Allowed to Visit"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            disabled={!patient.allowed_to_visit}
          >
            Add Visit
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="subtitle1" gutterBottom>
        Total Visits: {patient.visit_count}
      </Typography>

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
                <TableCell>{new Date(visit.visit_date).toLocaleDateString()}</TableCell>
                <TableCell>{visit.doctor_name}</TableCell>
                <TableCell>{visit.reason}</TableCell>
                <TableCell>{visit.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Visit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Visit Date"
              type="date"
              value={newVisit.visitDate}
              onChange={(e) => setNewVisit({ ...newVisit, visitDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Doctor Name"
              value={newVisit.doctorName}
              onChange={(e) => setNewVisit({ ...newVisit, doctorName: e.target.value })}
              required
            />
            <TextField
              label="Reason"
              value={newVisit.reason}
              onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })}
              required
            />
            <TextField
              label="Notes"
              multiline
              rows={4}
              value={newVisit.notes}
              onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddVisit}
            variant="contained"
            disabled={!newVisit.doctorName || !newVisit.reason}
          >
            Add Visit
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default VisitHistory; 