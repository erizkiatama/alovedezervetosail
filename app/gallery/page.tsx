'use client'

import {Suspense} from 'react'
import {motion} from 'framer-motion'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {WEDDING} from '@/lib/wedding-data'

const fadeUp = {
    hidden: {opacity: 0, y: 24},
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: {delay: i * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1]}
    })
}

const photos = [
    {id: 1, src: null as string | null, rotate: -13, left: -15, width: 164, height: 188, photoH: 138},
    {id: 2, src: null as string | null, rotate: 3, left: null, width: 187, height: 215, photoH: 158},
    {id: 3, src: null as string | null, rotate: -8, left: -15, width: 164, height: 188, photoH: 138},
    {id: 4, src: null as string | null, rotate: 6, left: null, width: 187, height: 215, photoH: 158},
]

function Polaroid({photo, index}: { photo: typeof photos[0], index: number }) {
    const isRight = photo.left === null
    return (
        <motion.div
            custom={index + 6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
                position: 'relative',
                left: isRight ? 'auto' : photo.left!,
                right: isRight ? -15 : 'auto',
                marginLeft: isRight ? 'auto' : 0,
                width: photo.width,
                height: photo.height,
                background: '#FFFFFF',
                borderRadius: 4,
                boxShadow: '0 6px 28px rgba(0,0,0,0.4)',
                padding: 10,
                paddingBottom: 36,
                flexShrink: 0,
                transform: `rotate(${photo.rotate}deg)`,
            }}
        >
            <div style={{
                width: '100%',
                height: photo.photoH,
                borderRadius: 2,
                overflow: 'hidden',
                background: photo.src ? undefined : '#c8d8b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {photo.src
                    ? <img src={photo.src} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    : (
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" opacity={0.4}>
                            <rect x="2" y="5" width="24" height="18" rx="3" stroke="#354B39" strokeWidth="1.2"/>
                            <circle cx="14" cy="14" r="4" stroke="#354B39" strokeWidth="1.2"/>
                            <circle cx="21" cy="9" r="1.5" fill="#354B39"/>
                        </svg>
                    )
                }
            </div>
        </motion.div>
    )
}

function GalleryContent() {
    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const backHref = `/?opened=true${name ? `&name=${encodeURIComponent(name)}` : ''}`

    return (
        <main
            className="min-h-screen relative overflow-x-hidden"
            style={{background: '#354B39', color: '#FFFFFF'}}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img src="/bunga-2.png" alt="" style={{
                    position: 'absolute',
                    width: 167,
                    height: 167,
                    left: -24,
                    top: 500,
                    transform: 'rotate(-16deg)',
                    opacity: 0.8
                }}/>
                <img src="/bunga-2.png" alt="" style={{
                    position: 'absolute',
                    width: 167,
                    height: 167,
                    left: -24,
                    top: 1000,
                    transform: 'rotate(-16deg)',
                    opacity: 0.8
                }}/>
                <img src="/bunga-4.png" alt="" style={{
                    position: 'absolute',
                    width: 181,
                    height: 181,
                    right: -20,
                    top: 250,
                    transform: 'rotate(31deg)',
                    opacity: 0.8
                }}/>
                <img src="/bunga-4.png" alt="" style={{
                    position: 'absolute',
                    width: 181,
                    height: 181,
                    right: -20,
                    top: 750,
                    transform: 'rotate(31deg)',
                    opacity: 0.8
                }}/>
            </div>

            <div className="relative z-10 pb-20" style={{maxWidth: 402, margin: '0 auto', padding: '0 20px'}}>

                <motion.h1
                    className="text-center mt-16 mb-3"
                    style={{fontFamily: "'Lovers Quarrel', cursive", fontSize: 96, lineHeight: '108px'}}
                    custom={0} variants={fadeUp} initial="hidden" animate="visible"
                >
                    Gallery
                </motion.h1>

                <motion.div className="flex items-center mb-12" custom={1} variants={fadeUp} initial="hidden"
                            animate="visible">
                    <div style={{
                        width: 19,
                        height: 19,
                        background: '#FFFBED',
                        clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
                    }}/>
                    <div className="flex-1 mx-2" style={{height: 1, background: '#FFFFFF'}}/>
                    <div style={{
                        width: 19,
                        height: 19,
                        background: '#FFFBED',
                        clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
                    }}/>
                </motion.div>

                <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 60}}>
                    {photos.map((photo, i) => (
                        <Polaroid key={photo.id} photo={photo} index={i}/>
                    ))}
                </div>

                <motion.div className="flex items-center gap-3 mb-12" custom={11} variants={fadeUp} initial="hidden"
                            animate="visible">
                    <span style={{
                        fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif",
                        fontSize: 48,
                        color: '#FFFFFF'
                    }}>ES</span>
                    <div className="flex-1" style={{height: 1, background: '#FFFEEE'}}/>
                    <span style={{
                        fontFamily: "'Abhaya Libre', serif",
                        fontSize: 14,
                        color: '#FFFFFF'
                    }}>#alovedEZervetoSAil</span>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center mb-6"
                    custom={12} variants={fadeUp} initial="hidden" animate="visible"
                >
                    <Link href={backHref}>
                        <div
                            className="flex flex-col items-center gap-2 opacity-50 active:opacity-100 transition-opacity">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 19V5M5 12L12 5L19 12" stroke="#FFFFFF" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{
                                fontFamily: "'Times New Roman', serif",
                                fontSize: 12,
                                color: '#FFFFFF',
                                letterSpacing: 2
                            }}>
                                Go Back
                            </span>
                        </div>
                    </Link>
                </motion.div>

            </div>
        </main>
    )
}

export default function GalleryPage() {
    return (
        <Suspense>
            <GalleryContent/>
        </Suspense>
    )
}