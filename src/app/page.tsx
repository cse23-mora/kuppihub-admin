'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          KuppiHub
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Admin Panel
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in with your authorized admin account to access the dashboard.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          disabled={loading}
          fullWidth
          sx={{
            py: 1.5,
            fontSize: '1rem',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
          Only authorized administrators can access this panel.
        </Typography>
      </Paper>
    </Box>
  );
}
