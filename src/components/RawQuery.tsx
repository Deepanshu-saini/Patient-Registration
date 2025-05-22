import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { executeRawQuery } from '../services/database';

const RawQuery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);

  const validateQuery = (query: string): boolean => {
    // Convert to lowercase and trim for case-insensitive check
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if query starts with SELECT
    if (!normalizedQuery.startsWith('select')) {
      setError('Only SELECT queries are allowed for security reasons.');
      return false;
    }

    // Check for potentially dangerous keywords
    const dangerousKeywords = [
      'insert', 'update', 'delete', 'drop', 'alter', 'truncate',
      'create', 'replace', 'grant', 'revoke', 'commit', 'rollback'
    ];

    for (const keyword of dangerousKeywords) {
      if (normalizedQuery.includes(keyword)) {
        setError(`Query contains forbidden keyword: ${keyword}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setColumns([]);

    if (!validateQuery(query)) {
      return;
    }

    try {
      const data = await executeRawQuery(query);
      
      if (data && data.length > 0) {
        // Get column names from the first row
        setColumns(Object.keys(data[0]));
        setResults(data);
      } else {
        setResults([]);
        setError('Query executed successfully but returned no results.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute query');
    }
  };

  return (
    <Paper sx={{ p: 3, width: '96vw' }}>
      <Typography variant="h5" gutterBottom>
        Raw SQL Query
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Note: Only SELECT queries are allowed for security reasons.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SELECT query here..."
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!query.trim()}
        >
          Execute Query
        </Button>
      </Box>

      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={`${rowIndex}-${column}`}>
                        {row[column]?.toString() || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

export default RawQuery; 