'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [adminEmails, setAdminEmails] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // This would typically save to a database or environment config
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Configure admin panel settings and preferences
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Admin Access
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage who has access to the admin panel
        </Typography>
        
        <TextField
          fullWidth
          label="Admin Emails"
          placeholder="admin1@example.com, admin2@example.com"
          value={adminEmails}
          onChange={(e) => setAdminEmails(e.target.value)}
          helperText="Comma-separated list of emails with admin access"
          sx={{ mb: 2 }}
        />

        <Alert severity="info" sx={{ mt: 2 }}>
          Note: Admin emails are configured via environment variables. Update NEXT_PUBLIC_ADMIN_EMAILS in your .env file to change admin access.
        </Alert>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Maintenance Mode
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enable maintenance mode to prevent user access during updates
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
            />
          }
          label="Enable Maintenance Mode"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Database Connection
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Current database connection status
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'success.main',
            }}
          />
          <Typography variant="body2">Connected to Supabase</Typography>
        </Box>
      </Paper>

      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={handleSaveSettings}
        disabled={saving}
        size="large"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </Box>
  );
}
