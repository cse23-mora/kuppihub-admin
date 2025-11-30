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

    // Get users who have added kuppis but are not approved yet
    // First get all unique user IDs who have added videos
    const { data: videoUsers } = await supabase
      .from('videos')
      .select('added_by_user_id')
      .not('added_by_user_id', 'is', null);

    // Get unique user IDs
    const uniqueUserIds = [...new Set(videoUsers?.map(v => v.added_by_user_id).filter(Boolean))];

    // Get users who added kuppis but aren't approved
    let pendingUsers: any[] = [];
    if (uniqueUserIds.length > 0) {
      const { data: pending } = await supabase
        .from('users')
        .select('id, firebase_uid, email, display_name, photo_url, created_at, is_approved_for_kuppies')
        .in('id', uniqueUserIds)
        .eq('is_approved_for_kuppies', false);
      
      // Get kuppi count for each pending user
      if (pending && pending.length > 0) {
        const pendingWithCount = await Promise.all(
          pending.map(async (user) => {
            const { count } = await supabase
              .from('videos')
              .select('id', { count: 'exact', head: true })
              .eq('added_by_user_id', user.id);
            return { ...user, kuppi_count: count || 0 };
          })
        );
        pendingUsers = pendingWithCount;
      }
    }

    return NextResponse.json({
      users: usersRes.count || 0,
      modules: modulesRes.count || 0,
      kuppis: kuppisRes.count || 0,
      tutors: tutorsRes.count || 0,
      pendingUsers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
