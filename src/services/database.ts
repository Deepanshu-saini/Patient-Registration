import { neon } from '@neondatabase/serverless';

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL || '');

// Create the patients table if it doesn't exist
export const initializeDatabase = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth DATE NOT NULL,
      gender VARCHAR(10) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
};

// Add a new patient
export const addPatient = async (patient: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  const result = await sql`
    INSERT INTO patients (
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone,
      address
    ) VALUES (
      ${patient.firstName},
      ${patient.lastName},
      ${patient.dateOfBirth},
      ${patient.gender},
      ${patient.email},
      ${patient.phone},
      ${patient.address}
    )
    RETURNING *;
  `;
  return result[0];
};

// Get all patients
export const getAllPatients = async () => {
  return await sql`
    SELECT * FROM patients
    ORDER BY created_at DESC;
  `;
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
  return await sql.unsafe(query);
};