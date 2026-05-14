'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {motion} from 'framer-motion'

type Props = {
    name: string | null
    children: React.ReactNode
    onVerified?: (name: string) => React.ReactNode
}

export default function TokenGuard({name, children, onVerified}: Props) {
    const [status, setStatus] = useState<'checking' | 'valid' | 'no_name'>('checking')
    const [guestName, setGuestName] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!name) {
            router.replace('/locked')
            return
        }

        async function verify() {
            try {
                // Check localStorage first — if already verified on this device, skip fingerprint check
                const cacheKey = `verified_${name}`
                const cached = localStorage.getItem(cacheKey)
                if (cached === 'true') {
                    setGuestName(name)
                    setStatus('valid')
                    return
                }

                const FingerprintJS = await import('@fingerprintjs/fingerprintjs')
                const fp = await FingerprintJS.default.load()
                const result = await fp.get()
                const fingerprint = result.visitorId

                const res = await fetch('/api/verify-token', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, fingerprint}),
                })
                const data = await res.json()

                if (data.valid) {
                    // Cache verification so next visit skips the check
                    localStorage.setItem(cacheKey, 'true')
                    setGuestName(data.name)
                    setStatus('valid')
                } else {
                    router.replace(`/locked?reason=${data.reason ?? 'invalid'}`)
                }
            } catch (e) {
                console.error(e)
                setStatus('no_name')
            }
        }

        verify()
    }, [name])

    if (status === 'checking') {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center" style={{background: '#C9F5BE'}}>
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5}}
                >
                    <motion.div
                        animate={{rotate: 360}}
                        transition={{duration: 2, repeat: Infinity, ease: 'linear'}}
                    >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect x="4" y="10" width="32" height="22" rx="3" stroke="#2d5a3d" strokeWidth="1.5"
                                  fill="none"/>
                            <path d="M4 13L20 24L36 13" stroke="#2d5a3d" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </motion.div>
                    <p className="font-body italic text-sm" style={{color: '#2d5a3d', letterSpacing: 2}}>
                        Opening invitation...
                    </p>
                </motion.div>
            </main>
        )
    }

    if (status === 'valid' && onVerified && guestName) {
        return <>{onVerified(guestName)}</>
    }

    return <>{children}</>
}