import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch all faculties
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('faculties')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ faculties: data });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json({ error: 'Failed to fetch faculties' }, { status: 500 });
  }
}

// POST - Create new faculty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('faculties')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ faculty: data });
  } catch (error) {
    console.error('Error creating faculty:', error);
    return NextResponse.json({ error: 'Failed to create faculty' }, { status: 500 });
  }
}
