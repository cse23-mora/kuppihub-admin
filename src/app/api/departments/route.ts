import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch all departments
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ departments: data });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

// POST - Create new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, faculty_id } = body;

    if (!name || !faculty_id) {
      return NextResponse.json(
        { error: 'Name and faculty_id are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('departments')
      .insert({ name, faculty_id })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ department: data });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}
