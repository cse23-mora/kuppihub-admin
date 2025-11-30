import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch all module assignments
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('module_assignments')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ assignments: data });
  } catch (error) {
    console.error('Error fetching module assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch module assignments' }, { status: 500 });
  }
}

// POST - Create new module assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module_id, faculty_id, department_id, semester_id } = body;

    if (!module_id || !faculty_id || !department_id || !semester_id) {
      return NextResponse.json(
        { error: 'module_id, faculty_id, department_id, and semester_id are required' },
        { status: 400 }
      );
    }

    // Check if assignment already exists
    const { data: existing } = await supabase
      .from('module_assignments')
      .select('id')
      .eq('module_id', module_id)
      .eq('faculty_id', faculty_id)
      .eq('department_id', department_id)
      .eq('semester_id', semester_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This assignment already exists' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('module_assignments')
      .insert({ module_id, faculty_id, department_id, semester_id })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ assignment: data });
  } catch (error) {
    console.error('Error creating module assignment:', error);
    return NextResponse.json({ error: 'Failed to create module assignment' }, { status: 500 });
  }
}
