# Patient Registration System

A modern web application for managing patient registrations and visit history in healthcare facilities. Built with React, TypeScript, and Material-UI.

## Features

- **Patient Registration**
  - Capture essential patient information
  - Required fields: First Name, Last Name, Date of Birth, Gender, Email, Phone, Address
  - Optional fields: Blood Group, Insurance details, Medical history
  - Form validation and error handling

- **Patient Management**
  - View list of registered patients
  - Search and filter patients
  - View detailed patient information
  - Track patient visit history

- **Visit Management**
  - Record patient visits
  - View visit history
  - Toggle visit permissions
  - Track visit dates and status

## Tech Stack

- React
- TypeScript
- Material-UI
- SQLite (via better-sqlite3)
- Express.js

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd patient-registration
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Database Setup

The application uses SQLite as its database. The database file will be created automatically when you first run the application.

## Usage

### Registering a Patient

1. Navigate to the Patient Registration page
2. Fill in the required fields:
   - First Name
   - Last Name
   - Date of Birth
   - Gender
   - Email
   - Phone
   - Address
3. Optionally fill in additional information
4. Click "Register Patient"

### Managing Patients

1. View the patient list on the main page
2. Use the search bar to find specific patients
3. Click "View Details" to see complete patient information
4. Click "View Visits" to see patient visit history

### Managing Visits

1. Access visit history through the patient list
2. Toggle "Allowed to Visit" status
3. View visit dates and status
4. Add new visits as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 