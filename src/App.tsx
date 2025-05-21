import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import PatientRegistration from './components/PatientRegistration';
import PatientList from './components/PatientList';
import RawQuery from './components/RawQuery';
import { initializeDatabase } from './services/database';
import React from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  React.useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully.');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    setupDatabase();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<PatientRegistration />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/query" element={<RawQuery />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;