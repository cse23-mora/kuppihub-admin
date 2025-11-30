'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  VideoLibrary,
  School,
  TrendingUp,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

interface Stats {
  users: number;
  modules: number;
  kuppis: number;
  tutors: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
        border: `1px solid ${color}33`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}22`,
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to KuppiHub Admin Panel. Here's an overview of your platform.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Users"
            value={stats?.users || 0}
            icon={<People sx={{ fontSize: 28 }} />}
            color="#6366f1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Modules"
            value={stats?.modules || 0}
            icon={<School sx={{ fontSize: 28 }} />}
            color="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Kuppis"
            value={stats?.kuppis || 0}
            icon={<VideoLibrary sx={{ fontSize: 28 }} />}
            color="#f59e0b"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Tutors"
            value={stats?.tutors || 0}
            icon={<TrendingUp sx={{ fontSize: 28 }} />}
            color="#ec4899"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              },
            }}
            onClick={() => window.location.href = '/dashboard/modules'}
          >
            <School sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Manage Modules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add, edit, or delete modules and assign them to faculties
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              },
            }}
            onClick={() => window.location.href = '/dashboard/kuppis'}
          >
            <VideoLibrary sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Manage Kuppis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review, approve, or manage video content
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              },
            }}
            onClick={() => window.location.href = '/dashboard/users'}
          >
            <People sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Manage Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage user accounts and permissions
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
