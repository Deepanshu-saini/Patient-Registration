export const DATABASE_CONFIG = {
  name: 'patient-registration-db',
  version: 1,
  storage: {
    type: 'idb',
    name: 'patient-registration-db'
  },
  // PGlite specific configuration
  pglite: {
    // Set the storage location
    storage: 'idb://patient-registration-db',
    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development' ? 'info' : undefined
  }
}; 