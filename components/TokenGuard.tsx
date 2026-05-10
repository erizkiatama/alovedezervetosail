'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {motion} from 'framer-motion'

type Props = {
    token: string | null
    children: React.ReactNode
    onVerified?: (name: string) => React.ReactNode
}

export default function TokenGuard({token, children, onVerified}: Props) {
    const [status, setStatus] = useState<'checking' | 'valid' | 'no_token'>('checking')
    const [guestName, setGuestName] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!token) {
            setStatus('no_token')
            return
        }

        async function verify() {
            try {
                const FingerprintJS = await import('@fingerprintjs/fingerprintjs')
                const fp = await FingerprintJS.default.load()
                const result = await fp.get()
                const fingerprint = result.visitorId

                const res = await fetch('/api/verify-token', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({token, fingerprint}),
                })
                const data = await res.json()

                if (data.valid) {
                    setGuestName(data.name)
                    setStatus('valid')
                } else {
                    router.replace('/locked')
                }
            } catch (e) {
                console.error(e)
                setStatus('no_token')
            }
        }

        verify()
    }, [token])

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

    // Token verified — render with guest name
    if (status === 'valid' && onVerified && guestName) {
        return <>{onVerified(guestName)}</>
    }

    // No token or fallback
    return <>{children}</>
}