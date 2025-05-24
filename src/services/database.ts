import { PGlite } from '@electric-sql/pglite';
import type { DebugLevel } from '@electric-sql/pglite';
import { DATABASE_CONFIG } from '../config/database';

// Initialize PGlite with IndexedDB storage
const db = new PGlite(DATABASE_CONFIG.pglite.storage, {
  debug: (DATABASE_CONFIG.pglite.debug || undefined) as DebugLevel | undefined
});

// Initialize database schema
export const initializeDatabase = async () => {
  try {
    // Create patients table
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        blood_group VARCHAR(5) NOT NULL,
        allergies TEXT,
        conditions TEXT,
        medications TEXT,
        insurance_provider VARCHAR(100),
        insurance_number VARCHAR(50),
        allowed_to_visit BOOLEAN DEFAULT true,
        visit_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create visits table
    await db.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id),
        visit_date TIMESTAMP NOT NULL,
        doctor_name VARCHAR(100) NOT NULL,
        reason TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
};

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  blood_group: string;
  allergies: string;
  conditions: string;
  medications: string;
  insurance_provider: string;
  insurance_number: string;
  allowed_to_visit: boolean;
  visit_count: number;
  created_at: string;
}

export interface Visit {
  id: number;
  patient_id: number;
  visit_date: string;
  doctor_name: string;
  reason: string;
  notes: string;
  created_at: string;
}

export interface PatientWithVisits extends Patient {
  visits: Visit[];
}

// Add a new patient
export const addPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'visit_count'>) => {
  try {
    const result = await db.query(`
      INSERT INTO patients (
        first_name, last_name, date_of_birth, gender, email, phone,
        address, blood_group, allergies, conditions, medications,
        insurance_provider, insurance_number, allowed_to_visit
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      patient.first_name, patient.last_name, patient.date_of_birth,
      patient.gender, patient.email, patient.phone, patient.address,
      patient.blood_group, patient.allergies, patient.conditions,
      patient.medications, patient.insurance_provider, patient.insurance_number,
      patient.allowed_to_visit
    ]);
    return result.rows[0] as Patient;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
};

// Get all patients
export const getAllPatients = async () => {
  try {
    const result = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    return result.rows as Patient[];
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Get a patient by ID with their visits
export const getPatientById = async (id: number) => {
  try {
    // Get patient details
    const patientResult = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (patientResult.rows.length === 0) {
      return null;
    }

    // Get patient's visits
    const visitsResult = await db.query(
      'SELECT * FROM visits WHERE patient_id = $1 ORDER BY visit_date DESC',
      [id]
    );

    const patient = patientResult.rows[0] as Patient;
    const visits = visitsResult.rows as Visit[];

    // Return patient with visits
    return {
      ...patient,
      visits
    };
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

// Update a patient
export const updatePatient = async (id: number, patient: Partial<Patient>) => {
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(patient).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'visit_count') {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) return null;

    values.push(id);
    const result = await db.query(`
      UPDATE patients
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);
    return result.rows[0] as Patient;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

// Delete a patient
export const deletePatient = async (id: number) => {
  try {
    // First delete all visits for this patient
    await db.query('DELETE FROM visits WHERE patient_id = $1', [id]);
    
    // Then delete the patient
    await db.query('DELETE FROM patients WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

// Add a visit
export const addVisit = async (visit: Omit<Visit, 'id' | 'created_at'>) => {
  try {
    const result = await db.query(`
      INSERT INTO visits (patient_id, visit_date, doctor_name, reason, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      visit.patient_id, visit.visit_date, visit.doctor_name,
      visit.reason, visit.notes
    ]);

    // Update visit count
    await db.query(`
      UPDATE patients
      SET visit_count = visit_count + 1
      WHERE id = $1
    `, [visit.patient_id]);

    return result.rows[0] as Visit;
  } catch (error) {
    console.error('Error adding visit:', error);
    throw error;
  }
};

// Get all visits for a patient
export const getPatientVisits = async (patientId: number) => {
  try {
    const result = await db.query(
      'SELECT * FROM visits WHERE patient_id = $1 ORDER BY visit_date DESC',
      [patientId]
    );
    return result.rows as Visit[];
  } catch (error) {
    console.error('Error fetching patient visits:', error);
    throw error;
  }
};

// Get all visits with patient information
export const getAllVisits = async () => {
  try {
    const result = await db.query(`
      SELECT v.*, p.first_name, p.last_name
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      ORDER BY v.visit_date DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all visits:', error);
    throw error;
  }
};

// Delete a visit
export const deleteVisit = async (id: number) => {
  try {
    const visit = await db.query('SELECT patient_id FROM visits WHERE id = $1', [id]);
    const row = visit.rows[0] as { patient_id: number } | undefined;
    if (row) {
      await db.query('DELETE FROM visits WHERE id = $1', [id]);
      await db.query(`
        UPDATE patients
        SET visit_count = visit_count - 1
        WHERE id = $1
      `, [row.patient_id]);
    }
  } catch (error) {
    console.error('Error deleting visit:', error);
    throw error;
  }
};

// Update patient's visit status
export const updateVisitStatus = async (id: number, allowedToVisit: boolean) => {
  try {
    const result = await db.query(
      'UPDATE patients SET allowed_to_visit = $1 WHERE id = $2 RETURNING *',
      [allowedToVisit, id]
    );
    return result.rows[0] as Patient;
  } catch (error) {
    console.error('Error updating visit status:', error);
    throw error;
  }
};

// Execute raw query (SELECT only)
export const executeRawQuery = async (query: string) => {
  try {
    if (!query.toLowerCase().trim().startsWith('select')) {
      throw new Error('Only SELECT queries are allowed');
    }
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error executing raw query:', error);
    throw error;
  }
}; 