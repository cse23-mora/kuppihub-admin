import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// DELETE - Delete module assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('module_assignments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting module assignment:', error);
    return NextResponse.json({ error: 'Failed to delete module assignment' }, { status: 500 });
  }
}
