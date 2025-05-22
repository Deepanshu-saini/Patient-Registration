# Patient Registration System

A modern web application for managing patient records and visits in a healthcare facility. Built with React, TypeScript, and Material-UI, this system provides a user-friendly interface for healthcare administrators to manage patient information efficiently.

## Features

### Patient Management
- **Patient Registration**: Add new patients with comprehensive details
- **Patient List**: View all patients with sorting, filtering, and search capabilities
- **Patient Details**: View detailed patient information and visit history
- **Edit Patient**: Update patient information and status
- **Delete Patient**: Remove patient records from the system

### Visit Management
- **Record Visits**: Log patient visits with doctor information and notes
- **Visit History**: View complete visit history for each patient
- **Visit Details**: Access detailed information about each visit

### Advanced Features
- **Search & Filter**: Find patients quickly using multiple criteria
- **Sorting**: Sort patient list by any column
- **Pagination**: Navigate through large datasets efficiently
- **Status Management**: Track patient status (Active/Inactive)
- **Raw Query Interface**: Execute SELECT queries for data analysis (read-only)

## Technical Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router
- **Database**: pgLite (PostgreSQL-compatible in-memory database)
- **API**: RESTful API with Node.js/Express
- **Deployment**: Vercel

## Database: pgLite

This project uses pgLite, a lightweight PostgreSQL-compatible database that runs entirely in memory. pgLite provides several advantages:

### Benefits of pgLite
- **Zero Configuration**: No need to install or configure PostgreSQL
- **In-Memory Performance**: Fast data access and query execution
- **PostgreSQL Compatibility**: Supports standard PostgreSQL SQL syntax
- **Perfect for Development**: Ideal for development and testing environments
- **Easy Setup**: Automatically creates and manages the database

### How pgLite Works in This Project
1. **Database Initialization**: The database is automatically initialized when the application starts
2. **Schema Creation**: Tables are created using standard PostgreSQL syntax
3. **Data Persistence**: Data is stored in memory during the application's runtime
4. **Query Execution**: All database operations use standard PostgreSQL queries

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/patient-registration.git
   cd patient-registration
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Database Schema

### Patients Table
- `id`: Primary key
- `first_name`: Patient's first name
- `last_name`: Patient's last name
- `date_of_birth`: Patient's date of birth
- `gender`: Patient's gender
- `email`: Contact email
- `phone`: Contact phone number
- `address`: Physical address
- `blood_group`: Blood type
- `allergies`: Known allergies
- `conditions`: Medical conditions
- `medications`: Current medications
- `insurance_provider`: Insurance company name
- `insurance_number`: Insurance policy number
- `allowed_to_visit`: Visit status (boolean)
- `visit_count`: Number of visits
- `created_at`: Record creation timestamp

### Visits Table
- `id`: Primary key
- `patient_id`: Foreign key to patients table
- `visit_date`: Date of visit
- `doctor_name`: Name of the attending doctor
- `reason`: Purpose of visit
- `notes`: Additional notes
- `created_at`: Record creation timestamp

## Security Features

- Input validation and sanitization
- SQL injection prevention
- Read-only raw query interface
- Secure database connections
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email Deepanshu saini at saindeepansh@gmail.com or create an issue in the repository. 
