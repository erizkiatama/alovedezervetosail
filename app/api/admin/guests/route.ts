import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function GET() {
    const { data, error } = await db
        .from('guests')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ guests: data })
}

export async function POST(req: NextRequest) {
    const { name, lenient, wa_number, responsibility } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const { data, error } = await db
        .from('guests')
        .insert({ name: name.trim(), lenient: lenient ?? false, wa_number: wa_number ?? null, responsibility: responsibility ?? null })
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ guest: data }, { status: 201 })
}
