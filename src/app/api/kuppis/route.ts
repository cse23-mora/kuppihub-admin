import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch all kuppis (videos with is_kuppi = true)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        modules:module_id (id, code, name),
        students:student_id (id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ kuppis: data });
  } catch (error) {
    console.error('Error fetching kuppis:', error);
    return NextResponse.json({ error: 'Failed to fetch kuppis' }, { status: 500 });
  }
}

// POST - Create new kuppi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      module_id,
      title,
      description,
      youtube_links,
      telegram_links,
      material_urls,
      student_id,
      language_code,
    } = body;

    if (!module_id || !title || !youtube_links) {
      return NextResponse.json(
        { error: 'module_id, title, and youtube_links are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('videos')
      .insert({
        module_id,
        title,
        description,
        youtube_links,
        telegram_links,
        material_urls,
        student_id,
        language_code: language_code || 'si',
        is_kuppi: true,
        is_approved: false,
        is_hidden: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ kuppi: data });
  } catch (error) {
    console.error('Error creating kuppi:', error);
    return NextResponse.json({ error: 'Failed to create kuppi' }, { status: 500 });
  }
}
