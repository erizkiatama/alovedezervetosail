'use client'

import { useState, useEffect, useRef } from 'react'

const PASSWORD = 'alovedezervetosail'
const BASE_URL = 'https://alovedezervetosail.in'

type Guest = {
    id: number
    name: string
    lenient: boolean
    fingerprints: string[]
    first_opened_at: string | null
    created_at: string
    wa_number: string | null
}

function generateMessage(name: string) {
    const link = `${BASE_URL}/?name=${encodeURIComponent(name)}`

    const rawMessage = `Kepada Yth. 
Bapak/Ibu/Saudara/i
*_${name}_*

Assalamualaikum Warahmatullahi Wabarakatuh.

Bismillahirahmanirrahim.
Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

Muhammad Ezra Rizkiatama Putra, S.Kom.
&
Hefa Salsabila Iskandar, S.I.Kom. 

Berikut link untuk info lengkap dari acara kami:

${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon untuk tidak menyebarluaskan undangan ini. 

Wassalamualaikum Warahmatullahi Wabarakatuh.

Terima Kasih.

Hormat kami,
Ezra & Salsa`

    return rawMessage.split('\n').map(line => encodeURIComponent(line)).join('%0A')
}

export default function AdminPage() {
    const [authed, setAuthed] = useState(false)
    const [input, setInput] = useState('')
    const [error, setError] = useState('')
    const inputRef = useRef('')
    const [guests, setGuests] = useState<Guest[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [copiedId, setCopiedId] = useState<number | null>(null)
    const [newName, setNewName] = useState('')
    const [newWaNumber, setNewWaNumber] = useState('')
    const [newLenient, setNewLenient] = useState(false)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('admin_authed') === 'true') {
            setAuthed(true)
        }
    }, [])

    function login() {
        if (inputRef.current === PASSWORD) {
            setAuthed(true)
            setError('')
            localStorage.setItem('admin_authed', 'true')
        } else {
            setError('Wrong password')
        }
    }

    useEffect(() => {
        if (authed) fetchGuests()
    }, [authed])

    async function fetchGuests() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/guests')
            const data = await res.json()
            setGuests(data.guests ?? [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    async function addGuest() {
        if (!newName.trim()) return
        setAdding(true)
        try {
            const res = await fetch('/api/admin/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim(), lenient: newLenient, wa_number: newWaNumber.trim() || null }),
            })
            if (res.ok) {
                setNewName('')
                setNewWaNumber('')
                setNewLenient(false)
                fetchGuests()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setAdding(false)
        }
    }

    async function resetGuest(id: number) {
        if (!confirm('Reset fingerprint for this guest?')) return
        await fetch(`/api/admin/guests/${id}/reset`, { method: 'POST' })
        fetchGuests()
    }

    async function deleteGuest(id: number, name: string) {
        if (!confirm(`Delete ${name}?`)) return
        await fetch(`/api/admin/guests/${id}`, { method: 'DELETE' })
        fetchGuests()
    }

    function openWA(guest: Guest) {
        const msg = generateMessage(guest.name)
        const url = guest.wa_number
            ? `https://wa.me/${guest.wa_number}?text=${msg}`
            : `https://wa.me/?text=${msg}`
        window.open(url, '_blank')
    }

    async function copyLink(name: string, id: number) {
        const link = `${BASE_URL}/?name=${encodeURIComponent(name)}`
        await navigator.clipboard.writeText(link)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filtered = guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    const opened = guests.filter(g => g.first_opened_at).length

    if (!authed) {
        return (
            <main style={{ minHeight: '100vh', background: '#1a1f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ width: '100%', maxWidth: 360, background: '#243024', borderRadius: 16, padding: 32 }}>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: '#C9F5BE', marginBottom: 8, textAlign: 'center' }}>ES Admin</h1>
                    <p style={{ fontSize: 13, color: '#7a9a7a', textAlign: 'center', marginBottom: 24 }}>Ezra & Salsa Wedding</p>
                    <input
                        type="password"
                        value={input}
                        onChange={e => { setInput(e.target.value); inputRef.current = e.target.value }}
                        onKeyDown={e => e.key === 'Enter' && login()}
                        placeholder="Password"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #354B39', background: '#1a1f1a', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
                    />
                    {error && <p style={{ color: '#ff7070', fontSize: 13, marginBottom: 12 }}>{error}</p>}
                    <button onClick={login} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#354B39', color: '#C9F5BE', fontSize: 15, cursor: 'pointer' }}>
                        Login
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main style={{ minHeight: '100vh', background: '#1a1f1a', color: '#fff', padding: 24 }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: '#C9F5BE', marginBottom: 4 }}>ES Admin</h1>
                        <p style={{ fontSize: 13, color: '#7a9a7a' }}>Ezra & Salsa · 30 Mei 2026</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('admin_authed'); setAuthed(false) }}
                        style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #354B39', background: 'transparent', color: '#7a9a7a', fontSize: 12, cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                    {[
                        { label: 'Total Guests', value: guests.length },
                        { label: 'Opened', value: opened },
                        { label: 'Not Yet', value: guests.length - opened },
                    ].map(s => (
                        <div key={s.label} style={{ flex: 1, background: '#243024', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
                            <p style={{ fontSize: 28, fontWeight: 700, color: '#C9F5BE' }}>{s.value}</p>
                            <p style={{ fontSize: 11, color: '#7a9a7a', marginTop: 4 }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Add guest */}
                <div style={{ background: '#243024', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                    <p style={{ fontSize: 13, color: '#7a9a7a', marginBottom: 12 }}>Add Guest</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addGuest()}
                            placeholder="Guest name..."
                            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #354B39', background: '#1a1f1a', color: '#fff', fontSize: 14, outline: 'none' }}
                        />
                        <button onClick={addGuest} disabled={adding || !newName.trim()}
                            style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#354B39', color: '#C9F5BE', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {adding ? '...' : '+ Add'}
                        </button>
                    </div>
                    <input
                        value={newWaNumber}
                        onChange={e => setNewWaNumber(e.target.value)}
                        placeholder="WA number (e.g. 628123456789)"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #354B39', background: '#1a1f1a', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#7a9a7a', cursor: 'pointer' }}>
                        <input type="checkbox" checked={newLenient} onChange={e => setNewLenient(e.target.checked)} />
                        Lenient (group — multiple devices allowed)
                    </label>
                </div>

                {/* Search */}
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search guests..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #354B39', background: '#243024', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
                />

                {/* Guest list */}
                {loading ? (
                    <p style={{ color: '#7a9a7a', textAlign: 'center', padding: 40 }}>Loading...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {filtered.map(guest => (
                            <div key={guest.id} style={{ background: '#243024', borderRadius: 12, padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div>
                                        <p style={{ fontSize: 15, fontWeight: 600, color: '#C9F5BE' }}>{guest.name}</p>
                                        <p style={{ fontSize: 11, color: '#7a9a7a', marginTop: 2 }}>
                                            {guest.lenient ? '👥 Lenient' : '🔒 Strict'} ·{' '}
                                            {guest.first_opened_at
                                                ? `✅ Opened ${new Date(guest.first_opened_at).toLocaleDateString('id-ID')}`
                                                : '⏳ Not opened yet'
                                            }
                                        </p>
                                        {guest.wa_number && (
                                            <p style={{ fontSize: 11, color: '#7a9a7a', marginTop: 2 }}>📱 {guest.wa_number}</p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button onClick={() => openWA(guest)}
                                        style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: '#25D366', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                        {guest.wa_number ? '💬 WA' : '💬 WA (no number)'}
                                    </button>
                                    <button onClick={() => copyLink(guest.name, guest.id)}
                                        style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #354B39', background: 'transparent', color: '#C9F5BE', fontSize: 12, cursor: 'pointer' }}>
                                        {copiedId === guest.id ? '✓ Copied' : 'Copy Link'}
                                    </button>
                                    <button onClick={() => resetGuest(guest.id)}
                                        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #354B39', background: 'transparent', color: '#7a9a7a', fontSize: 12, cursor: 'pointer' }}>
                                        Reset
                                    </button>
                                    <button onClick={() => deleteGuest(guest.id, guest.name)}
                                        style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: '#4a2020', color: '#ff9090', fontSize: 12, cursor: 'pointer' }}>
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <p style={{ color: '#7a9a7a', textAlign: 'center', padding: 40 }}>No guests found</p>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}
