import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Registration System
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Register
          </Button>
          <Button color="inherit" component={RouterLink} to="/patients">
            Patients
          </Button>
          <Button color="inherit" component={RouterLink} to="/record-visit">
            Record Visit
          </Button>
          <Button color="inherit" component={RouterLink} to="/query">
            Raw Query
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth={false} sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 