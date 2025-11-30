import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch all modules
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ modules: data });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}

// POST - Create new module
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, description } = body;

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('modules')
      .insert({ code, name, description })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ module: data });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}
