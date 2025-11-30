import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    // Get counts from different tables
    const [usersRes, modulesRes, kuppisRes, tutorsRes] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('modules').select('id', { count: 'exact', head: true }),
      supabase.from('videos').select('id', { count: 'exact', head: true }).eq('is_kuppi', true),
      supabase.from('students').select('id', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      users: usersRes.count || 0,
      modules: modulesRes.count || 0,
      kuppis: kuppisRes.count || 0,
      tutors: tutorsRes.count || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
