import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@supabase/supabase-js'

const db = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
    const {name, fingerprint} = await req.json()

    if (!name || !fingerprint) {
        return NextResponse.json({valid: false, reason: 'missing'}, {status: 400})
    }

    const {data: guest, error} = await db
        .from('guests')
        .select('*')
        .ilike('name', name.trim())
        .single()

    if (error || !guest) {
        return NextResponse.json({valid: false, reason: 'invalid'})
    }

    const fingerprints: string[] = guest.fingerprints ?? []

    // Already registered on this device — let in
    if (fingerprints.includes(fingerprint)) {
        return NextResponse.json({valid: true, name: guest.name, lenient: guest.lenient})
    }

    // Lenient group — always allow new devices in
    if (guest.lenient) {
        await db
            .from('guests')
            .update({
                fingerprints: [...fingerprints, fingerprint],
                first_opened_at: guest.first_opened_at ?? new Date().toISOString(),
            })
            .eq('id', guest.id)
        return NextResponse.json({valid: true, name: guest.name, lenient: true})
    }

    // Strict — only allow if no fingerprint registered yet (first open)
    if (fingerprints.length >= 1) {
        return NextResponse.json({valid: false, reason: 'device_mismatch'})
    }

    // First time opening — register fingerprint
    await db
        .from('guests')
        .update({
            fingerprints: [fingerprint],
            first_opened_at: new Date().toISOString(),
        })
        .eq('id', guest.id)

    return NextResponse.json({valid: true, name: guest.name, lenient: false})
}
