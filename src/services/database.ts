import { neon } from '@neondatabase/serverless';

// Initialize the database connection
const sql = neon(import.meta.env.VITE_DATABASE_URL || '');

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
  reason: string;
  notes: string;
  created_at: string;
}

export interface PatientWithVisits extends Patient {
  visits: Visit[];
}

// Create the patients table if it doesn't exist
export const initializeDatabase = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth DATE NOT NULL,
      gender VARCHAR(10) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      blood_group VARCHAR(5),
      allergies TEXT,
      conditions TEXT,
      medications TEXT,
      insurance_provider VARCHAR(100),
      insurance_number VARCHAR(50),
      allowed_to_visit BOOLEAN DEFAULT true,
      visit_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL,
      visit_date TIMESTAMP NOT NULL,
      doctor_name VARCHAR(100) NOT NULL,
      reason TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );
  `;
};

// Add a new patient
export const addPatient = async (patient: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
  medications?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}) => {
  const result = await sql`
    INSERT INTO patients (
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone,
      address,
      blood_group,
      allergies,
      conditions,
      medications,
      insurance_provider,
      insurance_number
    ) VALUES (
      ${patient.firstName},
      ${patient.lastName},
      ${patient.dateOfBirth},
      ${patient.gender},
      ${patient.email},
      ${patient.phone},
      ${patient.address},
      ${patient.bloodGroup},
      ${patient.allergies},
      ${patient.conditions},
      ${patient.medications},
      ${patient.insuranceProvider},
      ${patient.insuranceNumber}
    )
    RETURNING *;
  `;
  return result[0];
};

// Get all patients
export const getAllPatients = async (): Promise<Patient[]> => {
  const result = await sql`
    SELECT * FROM patients
    ORDER BY created_at DESC;
  `;
  return result.map((row: any) => ({
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    date_of_birth: row.date_of_birth,
    gender: row.gender,
    email: row.email,
    phone: row.phone,
    address: row.address,
    blood_group: row.blood_group,
    allergies: row.allergies,
    conditions: row.conditions,
    medications: row.medications,
    insurance_provider: row.insurance_provider,
    insurance_number: row.insurance_number,
    allowed_to_visit: Boolean(row.allowed_to_visit),
    visit_count: row.visit_count,
    created_at: row.created_at
  }));
};

// Add a new visit
export const addVisit = async (visit: {
  patientId: number;
  visitDate: string;
  doctorName: string;
  reason: string;
  notes?: string;
}) => {
  const result = await sql`
    WITH new_visit AS (
      INSERT INTO visits (
        patient_id,
        visit_date,
        doctor_name,
        reason,
        notes
      ) VALUES (
        ${visit.patientId},
        ${visit.visitDate},
        ${visit.doctorName},
        ${visit.reason},
        ${visit.notes}
      )
      RETURNING *
    )
    UPDATE patients
    SET visit_count = visit_count + 1
    WHERE id = ${visit.patientId}
    RETURNING *;
  `;
  return result[0];
};

// Update patient's visit status
export const updateVisitStatus = async (patientId: number, allowedToVisit: boolean) => {
  const result = await sql`
    UPDATE patients
    SET allowed_to_visit = ${allowedToVisit}
    WHERE id = ${patientId}
    RETURNING *;
  `;
  return result[0];
};

// Search patients
export const searchPatients = async (query: string) => {
  return await sql`
    SELECT * FROM patients
    WHERE 
      first_name ILIKE ${`%${query}%`} OR
      last_name ILIKE ${`%${query}%`} OR
      email ILIKE ${`%${query}%`} OR
      phone ILIKE ${`%${query}%`}
    ORDER BY created_at DESC;
  `;
};

// Execute raw SQL query
export const executeRawQuery = async (query: string) => {
    const result = await sql.query(query);
    return result;
  };