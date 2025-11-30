import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch hierarchy data
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('faculty_hierarchy')
      .select('data')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return NextResponse.json({ data: data?.data || null });
  } catch (error) {
    console.error('Error fetching hierarchy:', error);
    return NextResponse.json({ error: 'Failed to fetch hierarchy' }, { status: 500 });
  }
}

// PUT - Update hierarchy data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { data: hierarchyData } = body;

    if (!hierarchyData) {
      return NextResponse.json({ error: 'Hierarchy data is required' }, { status: 400 });
    }

    // Get the current hierarchy record ID
    const { data: current } = await supabase
      .from('faculty_hierarchy')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (current) {
      // Update existing record
      const { data, error } = await supabase
        .from('faculty_hierarchy')
        .update({ 
          data: hierarchyData,
          updated_at: new Date().toISOString()
        })
        .eq('id', current.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data: data?.data });
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('faculty_hierarchy')
        .insert({ data: hierarchyData })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data: data?.data });
    }
  } catch (error) {
    console.error('Error updating hierarchy:', error);
    return NextResponse.json({ error: 'Failed to update hierarchy' }, { status: 500 });
  }
}
