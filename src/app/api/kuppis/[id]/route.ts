import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch single kuppi
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        modules:module_id (id, code, name),
        students:student_id (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ kuppi: data });
  } catch (error) {
    console.error('Error fetching kuppi:', error);
    return NextResponse.json({ error: 'Failed to fetch kuppi' }, { status: 500 });
  }
}

// PATCH - Update kuppi
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('videos')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ kuppi: data });
  } catch (error) {
    console.error('Error updating kuppi:', error);
    return NextResponse.json({ error: 'Failed to update kuppi' }, { status: 500 });
  }
}

// DELETE - Delete kuppi
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting kuppi:', error);
    return NextResponse.json({ error: 'Failed to delete kuppi' }, { status: 500 });
  }
}
