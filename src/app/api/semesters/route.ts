import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch all semesters
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ semesters: data });
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return NextResponse.json({ error: 'Failed to fetch semesters' }, { status: 500 });
  }
}

// POST - Create new semester
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('semesters')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ semester: data });
  } catch (error) {
    console.error('Error creating semester:', error);
    return NextResponse.json({ error: 'Failed to create semester' }, { status: 500 });
  }
}
