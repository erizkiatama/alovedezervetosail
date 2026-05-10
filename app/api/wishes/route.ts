import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

// GET /api/wishes?offset=0&limit=5
export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url)
    const offset = parseInt(searchParams.get('offset') ?? '0')
    const limit = parseInt(searchParams.get('limit') ?? '5')

    const {data, error, count} = await supabase
        .from('wishes')
        .select('*', {count: 'exact'})
        .order('created_at', {ascending: false})
        .range(offset, offset + limit - 1)

    if (error) return NextResponse.json({error: error.message}, {status: 500})

    return NextResponse.json({wishes: data, total: count})
}

// POST /api/wishes
export async function POST(req: NextRequest) {
    const {name, message} = await req.json()

    if (!name?.trim() || !message?.trim()) {
        return NextResponse.json({error: 'Name and message are required'}, {status: 400})
    }

    const {data, error} = await supabase
        .from('wishes')
        .insert({name: name.trim(), message: message.trim()})
        .select()
        .single()

    if (error) return NextResponse.json({error: error.message}, {status: 500})

    return NextResponse.json({wish: data}, {status: 201})
}