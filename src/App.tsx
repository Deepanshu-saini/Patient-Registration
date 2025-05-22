import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import PatientList from './components/PatientList';
import PatientRegistration from './components/PatientRegistration';
import PatientDetails from './components/PatientDetails';
import RecordVisit from './components/RecordVisit';
import RawQuery from './components/RawQuery';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/register" element={<PatientRegistration />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/" element={<PatientRegistration />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/record-visit" element={<RecordVisit />} />
            <Route path="/query" element={<RawQuery />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
