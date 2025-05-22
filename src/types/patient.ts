export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    bloodGroup: string;
    insuranceProvider?: string;
    allergies?: string;
    conditions?: string;
    medications?: string;
    status: 'active' | 'inactive';
    visits?: Visit[];
  }
  
  export interface Visit {
    id: number;
    patientId: number;
    date: string;
    reason: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
    nextVisit?: string;
  } 