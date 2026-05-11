import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@supabase/supabase-js'

const db = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

// POST /api/verify-token
// Body: { name, fingerprint }
export async function POST(req: NextRequest) {
    const {name, fingerprint} = await req.json()

    if (!name || !fingerprint) {
        return NextResponse.json({valid: false, reason: 'missing'}, {status: 400})
    }

    // Find guest by name (case-insensitive)
    const {data: guest, error} = await db
        .from('guests')
        .select('*')
        .ilike('name', name.trim())
        .single()

    if (error || !guest) {
        return NextResponse.json({valid: false, reason: 'invalid'})
    }

    // First time opening — record fingerprint
    if (!guest.fingerprint) {
        await db
            .from('guests')
            .update({fingerprint, first_opened_at: new Date().toISOString()})
            .eq('id', guest.id)

        return NextResponse.json({valid: true, name: guest.name})
    }

    // Returning visitor — check fingerprint matches
    if (guest.fingerprint === fingerprint) {
        return NextResponse.json({valid: true, name: guest.name})
    }

    // Different device — blocked
    return NextResponse.json({valid: false, reason: 'device_mismatch'})
}