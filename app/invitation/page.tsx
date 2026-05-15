'use client'

import {Suspense, useState, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {WEDDING} from '@/lib/wedding-data'

const fadeUp = {
    hidden: {opacity: 0, y: 24},
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: {delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1]}
    })
}

type Wish = { id: number; name: string; message: string; created_at: string }

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Baru saja'
    if (mins < 60) return `${mins} menit lalu`
    if (hours < 24) return `${hours} jam lalu`
    return `${days} hari lalu`
}

function WishesSection({prefillName}: { prefillName: string }) {
    const [wishes, setWishes] = useState<Wish[]>([])
    const [total, setTotal] = useState(0)
    const [offset, setOffset] = useState(0)
    const [name, setName] = useState(prefillName)
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const LIMIT = 5

    useEffect(() => {
        fetchWishes(0, true)
    }, [])

    async function fetchWishes(newOffset: number, replace = false) {
        try {
            const res = await fetch(`/api/wishes?offset=${newOffset}&limit=${LIMIT}`)
            const data = await res.json()
            setWishes(prev => replace ? data.wishes : [...prev, ...data.wishes])
            setTotal(data.total)
            setOffset(newOffset + LIMIT)
        } catch (e) {
            console.error(e)
        } finally {
            setFetching(false)
            setLoadingMore(false)
        }
    }

    async function handleSubmit() {
        if (!name.trim() || !message.trim()) return
        setLoading(true)
        try {
            const res = await fetch('/api/wishes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: name.trim(), message: message.trim()}),
            })
            const data = await res.json()
            if (data.wish) {
                setWishes(prev => [data.wish, ...prev])
                setTotal(t => t + 1)
                setMessage('')
                setSubmitted(true)
                setTimeout(() => setSubmitted(false), 3000)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    function loadMore() {
        setLoadingMore(true)
        fetchWishes(offset)
    }

    const hasMore = wishes.length < total

    return (
        <div className="px-8 pb-16">
            <motion.div className="text-center mb-8" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2, duration: 0.6}}>
                <h2 style={{
                    fontFamily: "'Lovers Quarrel', cursive",
                    fontSize: 56,
                    lineHeight: '64px',
                    color: '#132617'
                }}>
                    Best Wishes
                </h2>
            </motion.div>

            <motion.div className="mb-8" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3, duration: 0.6}}>
                <div className="mb-3">
                    <label style={{
                        fontFamily: "'Times New Roman', serif",
                        fontSize: 13,
                        color: '#5a6b5c',
                        display: 'block',
                        marginBottom: 6
                    }}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your Name"
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: 10,
                            border: '1px solid #c8d8b8',
                            background: '#f8fdf5',
                            fontFamily: "'Times New Roman', serif",
                            fontSize: 15,
                            color: '#132617',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label style={{
                        fontFamily: "'Times New Roman', serif",
                        fontSize: 13,
                        color: '#5a6b5c',
                        display: 'block',
                        marginBottom: 6
                    }}>Best Wishes</label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Please type your best wishes here..."
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: 10,
                            border: '1px solid #c8d8b8',
                            background: '#f8fdf5',
                            fontFamily: "'Times New Roman', serif",
                            fontSize: 15,
                            color: '#132617',
                            outline: 'none',
                            resize: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !message.trim() || loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: 10,
                        border: 'none',
                        background: !name.trim() || !message.trim() ? '#c8d8b8' : '#45614B',
                        color: '#FFFEEE',
                        fontFamily: "'Abhaya Libre', serif",
                        fontSize: 15,
                        letterSpacing: 1,
                        cursor: !name.trim() || !message.trim() ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? 'Sending...' : submitted ? '✓ Sent!' : 'Send'}
                </button>
                <AnimatePresence>
                    {submitted && (
                        <motion.p initial={{opacity: 0, y: -8}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}
                                  style={{
                                      fontFamily: "'Times New Roman', serif",
                                      fontSize: 13,
                                      color: '#45614B',
                                      textAlign: 'center',
                                      marginTop: 10
                                  }}>
                            Thank you for your kind wishes 🤍
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.4, duration: 0.6}}>
                <p style={{fontFamily: "'Times New Roman', serif", fontSize: 13, color: '#7a8e7c', marginBottom: 16}}>
                    {total} wishes
                </p>
                {fetching ? (
                    <p style={{
                        fontFamily: "'Times New Roman', serif",
                        fontSize: 14,
                        color: '#9aaa9c',
                        textAlign: 'center'
                    }}>Loading...</p>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                        <AnimatePresence>
                            {wishes.map(wish => (
                                <motion.div key={wish.id} initial={{opacity: 0, y: -12}} animate={{opacity: 1, y: 0}}
                                            transition={{duration: 0.4}}
                                            style={{
                                                padding: '14px 16px',
                                                borderRadius: 12,
                                                background: '#f8fdf5',
                                                border: '1px solid #c8d8b8'
                                            }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: '#354B39'
                                        }}>{wish.name}</p>
                                        <p style={{
                                            fontFamily: "'Times New Roman', serif",
                                            fontSize: 11,
                                            color: '#9aaa9c'
                                        }}>{timeAgo(wish.created_at)}</p>
                                    </div>
                                    <p style={{
                                        fontFamily: "'Times New Roman', serif",
                                        fontSize: 14,
                                        lineHeight: '22px',
                                        color: '#132617'
                                    }}>{wish.message}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {hasMore && (
                    <motion.button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="w-full mt-6"
                        style={{
                            padding: '12px',
                            borderRadius: 10,
                            border: '1px solid #c8d8b8',
                            background: 'transparent',
                            fontFamily: "'Times New Roman', serif",
                            fontSize: 14,
                            color: '#45614B',
                            cursor: 'pointer'
                        }}
                        whileTap={{scale: 0.97}}
                    >
                        {loadingMore ? 'Loading...' : `Load more (${total - wishes.length} remaining)`}
                    </motion.button>
                )}
            </motion.div>
        </div>
    )
}

function InvitationContent() {
    const searchParams = useSearchParams()
    const name = searchParams.get('name') ?? ''
    const backHref = `/?opened=true${name ? `&name=${encodeURIComponent(name)}` : ''}`

    return (
        <main className="min-h-screen relative overflow-x-hidden" style={{background: '#FFFEEE', color: '#132617'}}>
            <div className="absolute pointer-events-none overflow-hidden inset-0">
                <img src="/bunga-1.png" alt="" style={{
                    position: 'absolute',
                    width: 346,
                    height: 346,
                    left: -185,
                    top: 56,
                    transform: 'rotate(30.3deg)',
                    opacity: 0.5
                }}/>
                <img src="/bunga-3.png" alt=""
                     style={{position: 'absolute', width: 334, height: 334, right: -80, top: 820, opacity: 0.5}}/>
                <img src="/bunga-1.png" alt=""
                     style={{position: 'absolute', width: 346, height: 346, right: -120, top: 1200, opacity: 0.4}}/>
                <img src="/bunga-3.png" alt=""
                     style={{position: 'absolute', width: 300, height: 300, right: -60, bottom: 200, opacity: 0.4}}/>
            </div>

            <div className="relative z-10 pb-16" style={{maxWidth: 402, margin: '0 auto'}}>

                {/* PAGE 1 — THE INVITATION */}
                <div className="px-8 pt-10">
                    <motion.p
                        className="text-center mb-8"
                        style={{
                            fontFamily: "'Times New Roman', serif",
                            fontSize: 28,
                            lineHeight: '48px',
                            color: '#6E6758',
                            direction: 'rtl'
                        }}
                        custom={0} variants={fadeUp} initial="hidden" animate="visible">
                        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </motion.p>
                    <motion.p className="mb-2 leading-relaxed"
                              style={{fontFamily: "'Times New Roman', serif", fontSize: 15, lineHeight: '24px'}}
                              custom={0} variants={fadeUp} initial="hidden"
                              animate="visible">{WEDDING.quran.text}</motion.p>
                    <motion.p className="mb-8 pl-4" style={{fontFamily: "'Times New Roman', serif", fontSize: 15}}
                              custom={1} variants={fadeUp} initial="hidden" animate="visible">({WEDDING.quran.source})
                    </motion.p>
                    <motion.p className="mb-10"
                              style={{fontFamily: "'Times New Roman', serif", fontSize: 15, lineHeight: '24px'}}
                              custom={2} variants={fadeUp} initial="hidden"
                              animate="visible">{WEDDING.opening}</motion.p>
                    <motion.div className="mb-1" custom={3} variants={fadeUp} initial="hidden" animate="visible">
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 32,
                            lineHeight: '40px',
                            color: '#6E6758',
                            fontWeight: 400
                        }}>{WEDDING.groomFull}</h2>
                    </motion.div>
                    <motion.p className="mb-8"
                              style={{fontFamily: "'Times New Roman', serif", fontSize: 14, lineHeight: '22px'}}
                              custom={4} variants={fadeUp} initial="hidden" animate="visible">
                        Putra dari Bapak Dr. Dwi Putra Buana Sakti, S.E., M.M.<br/>&amp; Ibu Dr. Siti Nurmayanti, S.E.,
                        M.M
                    </motion.p>
                    <motion.div className="mb-8" custom={5} variants={fadeUp} initial="hidden" animate="visible">
                        <span style={{
                            fontFamily: "'Gwendolyn', cursive",
                            fontSize: 64,
                            lineHeight: '77px',
                            color: '#000'
                        }}>&amp;</span>
                    </motion.div>
                    <motion.div className="mb-1" custom={6} variants={fadeUp} initial="hidden" animate="visible">
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 32,
                            lineHeight: '40px',
                            color: '#6E6758',
                            fontWeight: 400
                        }}>{WEDDING.brideFull}</h2>
                    </motion.div>
                    <motion.p className="mb-12"
                              style={{fontFamily: "'Times New Roman', serif", fontSize: 14, lineHeight: '22px'}}
                              custom={7} variants={fadeUp} initial="hidden" animate="visible">
                        Putri dari Bapak H. Heru Iskandar, Amd (Alm)<br/>&amp; Ibu Hj. Fardhiah Kahar, Amd
                    </motion.p>
                    <motion.p className="mb-16"
                              style={{fontFamily: "'Times New Roman', serif", fontSize: 15, lineHeight: '24px'}}
                              custom={8} variants={fadeUp} initial="hidden"
                              animate="visible">{WEDDING.closing}</motion.p>
                </div>

                {/* PAGE 2 — DATE AND PLACE */}
                <div className="px-8">
                    <motion.h2 className="text-center mb-12"
                               style={{fontFamily: "'Lovers Quarrel', cursive", fontSize: 64, lineHeight: '72px'}}
                               custom={10} variants={fadeUp} initial="hidden" animate="visible">Date and Place
                    </motion.h2>
                    <motion.div className="mb-10" custom={12} variants={fadeUp} initial="hidden" animate="visible">
                        <div style={{
                            fontFamily: "'Lavishly Yours', cursive",
                            fontSize: 80,
                            lineHeight: '100px',
                            color: '#132617'
                        }}>Sabtu
                        </div>
                        <div style={{
                            fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif",
                            fontSize: 64,
                            lineHeight: '75px',
                            color: '#6E6758',
                            fontWeight: 300
                        }}>30/05/26
                        </div>
                    </motion.div>
                    <motion.div className="mb-8" custom={13} variants={fadeUp} initial="hidden" animate="visible">
                        <p style={{
                            fontFamily: "'Abril Fatface', serif",
                            fontSize: 15,
                            lineHeight: '20px',
                            color: '#132617',
                            marginBottom: 6
                        }}>RECEPTION</p>
                        <p style={{
                            fontFamily: "'Times New Roman', serif",
                            fontSize: 15,
                            lineHeight: '24px',
                            color: '#132617'
                        }}>Sabtu, 30 Mei 2026<br/>Pukul 10.30 WITA – 13.30 WITA</p>
                    </motion.div>
                    <motion.div className="mb-6" custom={14} variants={fadeUp} initial="hidden" animate="visible">
                        <p style={{
                            fontFamily: "'Abril Fatface', serif",
                            fontSize: 15,
                            lineHeight: '20px',
                            color: '#132617',
                            marginBottom: 6
                        }}>ISLAMIC CENTER NTB</p>
                        <p style={{
                            fontFamily: "'Times New Roman', serif",
                            fontSize: 15,
                            lineHeight: '24px',
                            color: '#132617',
                            marginBottom: 16
                        }}>Jl. Udayana No. 1, Gomong, Selaparang, Mataram, NTB</p>
                        <a href={WEDDING.venue.mapsUrl} target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 px-5 py-3 rounded-xl"
                           style={{
                               background: '#45614B',
                               color: '#FFFEEE',
                               fontFamily: "'Abhaya Libre', serif",
                               fontSize: 14,
                               textDecoration: 'none'
                           }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z"
                                    stroke="#FFFEEE" strokeWidth="1.2" fill="none"/>
                                <circle cx="8" cy="6" r="1.5" stroke="#FFFEEE" strokeWidth="1.2" fill="none"/>
                            </svg>
                            Open in Maps
                        </a>
                    </motion.div>
                </div>

                {/* PAGE 3 — WISHES */}
                <div className="w-full" style={{background: '#f0f7ee', borderTop: '1px solid #c8d8b8', paddingTop: 40}}>
                    <WishesSection prefillName={name}/>
                </div>

                {/* FOOTER */}
                <div className="px-8 py-10" style={{borderTop: '1px solid #c8d8b8'}}>
                    <div className="flex items-center gap-3 mb-10">
                        <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 48,
                            color: '#6E6758',
                            fontWeight: 400
                        }}>ES</span>
                        <div className="flex-1" style={{height: 1, background: '#000'}}/>
                        <span style={{
                            fontFamily: "'Abhaya Libre', serif",
                            fontSize: 14,
                            color: '#564D3C'
                        }}>#alovedEZervetoSAil</span>
                    </div>

                    {/* Go Back */}
                    <Link href={backHref}>
                        <div
                            className="flex flex-col items-center gap-2 opacity-50 active:opacity-100 transition-opacity">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 19V5M5 12L12 5L19 12" stroke="#132617" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{
                                fontFamily: "'Times New Roman', serif",
                                fontSize: 12,
                                color: '#132617',
                                letterSpacing: 2
                            }}>Go Back</span>
                        </div>
                    </Link>
                </div>

            </div>
        </main>
    )
}

export default function InvitationPage() {
    return (
        <Suspense>
            <InvitationContent/>
        </Suspense>
    )
}
