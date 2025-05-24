import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Patient, Visit } from './database';

interface PatientRegistrationDB extends DBSchema {
  patients: {
    key: number;
    value: Patient;
  };
  visits: {
    key: number;
    value: Visit;
  };
}

class StorageService {
  private db: IDBPDatabase<PatientRegistrationDB> | null = null;

  async initialize() {
    if (!this.db) {
      this.db = await openDB<PatientRegistrationDB>('patient-registration-backup', 1, {
        upgrade(db) {
          // Create object stores
          if (!db.objectStoreNames.contains('patients')) {
            db.createObjectStore('patients', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('visits')) {
            db.createObjectStore('visits', { keyPath: 'id' });
          }
        },
      });
    }
    return this.db;
  }

  async savePatients(patients: Patient[]) {
    const db = await this.initialize();
    const tx = db.transaction('patients', 'readwrite');
    const store = tx.objectStore('patients');
    
    // Clear existing data
    await store.clear();
    
    // Save new data
    for (const patient of patients) {
      await store.put(patient);
    }
    
    await tx.done;
  }

  async saveVisits(visits: Visit[]) {
    const db = await this.initialize();
    const tx = db.transaction('visits', 'readwrite');
    const store = tx.objectStore('visits');
    
    // Clear existing data
    await store.clear();
    
    // Save new data
    for (const visit of visits) {
      await store.put(visit);
    }
    
    await tx.done;
  }

  async getPatients(): Promise<Patient[]> {
    const db = await this.initialize();
    const tx = db.transaction('patients', 'readonly');
    const store = tx.objectStore('patients');
    return store.getAll();
  }

  async getVisits(): Promise<Visit[]> {
    const db = await this.initialize();
    const tx = db.transaction('visits', 'readonly');
    const store = tx.objectStore('visits');
    return store.getAll();
  }

  async clearAll() {
    const db = await this.initialize();
    const tx = db.transaction(['patients', 'visits'], 'readwrite');
    await tx.objectStore('patients').clear();
    await tx.objectStore('visits').clear();
    await tx.done;
  }
}

export const storageService = new StorageService(); 