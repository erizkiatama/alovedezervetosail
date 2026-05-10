'use client'

import {motion} from 'framer-motion'

export default function LockedPage() {
    return (
        <main
            className="min-h-screen flex flex-col items-center justify-center px-8"
            style={{background: '#1a1f1a'}}
        >
            <motion.div
                className="flex flex-col items-center text-center gap-6"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
            >
                {/* Lock icon */}
                <motion.div
                    initial={{scale: 0.8}}
                    animate={{scale: 1}}
                    transition={{duration: 0.5, type: 'spring'}}
                >
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <rect x="12" y="28" width="40" height="28" rx="6" stroke="#8aaa7a" strokeWidth="2" fill="none"/>
                        <path d="M20 28V22C20 13.6 27 8 32 8C37 8 44 13.6 44 22V28" stroke="#8aaa7a" strokeWidth="2"
                              strokeLinecap="round" fill="none"/>
                        <circle cx="32" cy="42" r="4" fill="#8aaa7a"/>
                    </svg>
                </motion.div>

                <div>
                    <h1 className="font-display text-2xl mb-3" style={{color: '#f5f0e8', letterSpacing: '2px'}}>
                        Private Invitation
                    </h1>
                    <p className="font-body italic text-sm leading-relaxed" style={{color: '#8aaa7a', fontSize: 15}}>
                        This link only can be opened by the intended invitee.
                    </p>
                </div>

                <div className="mt-4 px-6 py-4 rounded-2xl"
                     style={{background: 'rgba(138,170,122,0.08)', border: '1px solid rgba(138,170,122,0.2)'}}>
                    <p className="font-body text-sm" style={{color: '#8aaa7a', fontSize: 13, lineHeight: '22px'}}>
                        If you feel like anything's wrong,<br/>
                        please contact Ezra or Salsa.
                    </p>
                </div>

                <p className="font-body italic text-xs mt-2" style={{color: '#5a7060', letterSpacing: '2px'}}>
                    Ezra &amp; Salsa · 30 Mei 2026
                </p>
            </motion.div>
        </main>
    )
}