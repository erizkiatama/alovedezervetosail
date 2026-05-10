import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@supabase/supabase-js'

const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

// POST /api/verify-token
// Body: { token, fingerprint }
// Returns: { valid, name, reason }
export async function POST(req: NextRequest) {
    const {token, fingerprint} = await req.json()

    if (!token || !fingerprint) {
        return NextResponse.json({valid: false, reason: 'missing'}, {status: 400})
    }

    // Find the guest token
    const {data: guest, error} = await supabaseClient
        .from('guests')
        .select('*')
        .eq('token', token)
        .single()

    if (error || !guest) {
        return NextResponse.json({valid: false, reason: 'invalid'})
    }

    // First time opening — record fingerprint
    if (!guest.fingerprint) {
        await supabaseClient
            .from('guests')
            .update({
                fingerprint,
                first_opened_at: new Date().toISOString(),
            })
            .eq('token', token)

        return NextResponse.json({valid: true, name: guest.name})
    }

    // Returning visitor — check fingerprint matches
    if (guest.fingerprint === fingerprint) {
        return NextResponse.json({valid: true, name: guest.name})
    }

    // Different device — blocked
    return NextResponse.json({valid: false, reason: 'device_mismatch'})
}
