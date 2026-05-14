'use client'

import {Suspense} from 'react'
import {motion} from 'framer-motion'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'

const fadeUp = {
    hidden: {opacity: 0, y: 24},
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: {delay: i * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1]}
    })
}

function Stamp({frame, photo, width, height, clip = 'rect'}: {
    frame: string
    photo?: string | null
    width: number
    height: number
    clip?: 'rect' | 'oval' | 'circle'
}) {
    const borderRadius = clip === 'rect' ? 6 : '50%'
    // Inset % for each stamp type to align photo with the hole
    const inset = clip === 'rect' ? '11% 9%' : '8%'
    return (
        <div style={{position: 'relative', width, height, flexShrink: 0}}>
            <div style={{
                position: 'absolute', inset,
                borderRadius,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {photo
                    ? <img src={photo} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    : <svg width="22" height="22" viewBox="0 0 28 28" fill="none" opacity={0.25}>
                        <rect x="2" y="5" width="24" height="18" rx="3" stroke="#fff" strokeWidth="1.2"/>
                        <circle cx="14" cy="14" r="4" stroke="#fff" strokeWidth="1.2"/>
                        <circle cx="21" cy="9" r="1.5" fill="#fff"/>
                    </svg>
                }
            </div>
            <img src={frame} alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}/>
        </div>
    )
}

const star = {
    width: 19,
    height: 19,
    background: '#FFFBED',
    clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
}

function Divider() {
    return (
        <div className="flex items-center my-5 px-5">
            <div style={star}/>
            <div className="flex-1 mx-2" style={{height: 1, background: '#FFFFFF'}}/>
            <div style={star}/>
        </div>
    )
}

function GalleryContent() {
    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const backHref = `/?opened=true${name ? `&name=${encodeURIComponent(name)}` : ''}`

    return (
        <main style={{color: '#FFFFFF', overflowX: 'hidden'}}>

            {/* ═══ SECTION 1 — dark green ═══ */}
            <div style={{background: '#354B39'}}>
                <div style={{maxWidth: 402, margin: '0 auto', padding: '0 16px', paddingBottom: 32}}>

                    {/* Gallery title */}
                    <motion.h1 className="text-center pt-14"
                               style={{
                                   fontFamily: "'Lovers Quarrel', cursive",
                                   fontSize: 96,
                                   lineHeight: '108px',
                                   marginBottom: 0
                               }}
                               custom={0} variants={fadeUp} initial="hidden" animate="visible">
                        Gallery
                    </motion.h1>
                    <Divider/>

                    {/* The Film */}
                    <motion.h2 className="text-center mb-5"
                               style={{
                                   fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif",
                                   fontSize: 48,
                                   lineHeight: '57px'
                               }}
                               custom={1} variants={fadeUp} initial="hidden" animate="visible">
                        The Film
                    </motion.h2>

                    {/* Film stamp — full width landscape */}
                    <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                                className="flex justify-center mb-10">
                        <div style={{position: 'relative', width: '100%', maxWidth: 350, aspectRatio: '336/247'}}>
                            <div style={{
                                position: 'absolute', inset: '13% 8%',
                                background: 'rgba(0,0,0,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="1.5" opacity={0.5}/>
                                    <path d="M16 13L30 20L16 27V13Z" fill="white" opacity={0.5}/>
                                </svg>
                            </div>
                            <img src="/stamp-1.png" alt=""
                                 style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}/>
                        </div>
                    </motion.div>

                    {/* The Photos */}
                    <motion.h2 className="text-center"
                               style={{
                                   fontFamily: "'Lovers Quarrel', cursive",
                                   fontSize: 64,
                                   lineHeight: '72px',
                                   marginBottom: 0
                               }}
                               custom={3} variants={fadeUp} initial="hidden" animate="visible">
                        The Photos
                    </motion.h2>
                    <Divider/>

                    {/* Row 1: circle | portrait-rect | tall-oval
                        From Figma: stamp-5 (circle), stamp-2 (portrait rect), stamp-4 (tall oval) */}
                    <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                        <Stamp frame="/stamp-5.png" width={130} height={130} clip="circle"/>
                        <Stamp frame="/stamp-2.png" width={110} height={148} clip="rect"/>
                        <Stamp frame="/stamp-4.png" width={110} height={165} clip="oval"/>
                    </motion.div>

                    {/* Row 2: large landscape | small portrait + rubber stamp
                        stamp-1 large, stamp-2 small, rubber stamp decoration */}
                    <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8}}>
                        <Stamp frame="/stamp-1.png" width={240} height={177} clip="rect"/>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                            <Stamp frame="/stamp-2.png" width={110} height={130} clip="rect"/>
                            <img src="/rubber-stamp.png" alt="" style={{
                                width: 110, height: 64,
                                opacity: 0.8,
                                mixBlendMode: 'screen',
                            }}/>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* ═══ SECTION 2 — grey-green ═══ */}
            <div style={{background: 'rgba(128,140,131,0.9)', paddingBottom: 32}}>
                <div style={{maxWidth: 402, margin: '0 auto', padding: '24px 16px 0'}}>

                    {/* Row 3: two wide landscape stamps
                        stamp-3 (wide white), stamp-2 (landscape) */}
                    <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12}}>
                        <Stamp frame="/stamp-3.png" width={195} height={135} clip="rect"/>
                        <Stamp frame="/stamp-2.png" width={155} height={135} clip="rect"/>
                    </motion.div>

                    {/* Row 4: wide oval centered
                        stamp-4 rotated = landscape oval */}
                    <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', justifyContent: 'center', marginBottom: 12}}>
                        <Stamp frame="/stamp-5.png" width={220} height={220} clip="circle"/>
                    </motion.div>

                    {/* Row 5: circle left + landscape right
                        stamp-5 circle, stamp-2 landscape */}
                    <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <Stamp frame="/stamp-5.png" width={130} height={130} clip="circle"/>
                        <Stamp frame="/stamp-2.png" width={220} height={150} clip="rect"/>
                    </motion.div>

                </div>
            </div>

            {/* ═══ SECTION 3 — darkest green ═══ */}
            <div style={{background: '#223726'}}>
                <div style={{maxWidth: 402, margin: '0 auto', padding: '24px 16px 0', paddingBottom: 48}}>

                    {/* Row 6: portrait stamp left + large oval right
                        stamp-2 portrait, stamp-4 large oval */}
                    <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12}}>
                        <Stamp frame="/stamp-2.png" width={155} height={210} clip="rect"/>
                        <Stamp frame="/stamp-4.png" width={200} height={210} clip="oval"/>
                    </motion.div>

                    {/* Row 7: landscape stamp left + small stamp right
                        stamp-3, stamp-2 */}
                    <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12}}>
                        <Stamp frame="/stamp-3.png" width={215} height={150} clip="rect"/>
                        <Stamp frame="/stamp-2.png" width={140} height={150} clip="rect"/>
                    </motion.div>

                    {/* Row 8: circle centered
                        stamp-5 */}
                    <motion.div custom={11} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', justifyContent: 'center', marginBottom: 40}}>
                        <Stamp frame="/stamp-5.png" width={160} height={160} clip="circle"/>
                    </motion.div>

                    {/* Footer */}
                    <motion.div custom={12} variants={fadeUp} initial="hidden" animate="visible"
                                style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32}}>
                        <span style={{
                            fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif",
                            fontSize: 48,
                            color: '#FFFFFF',
                            lineHeight: 1
                        }}>ES</span>
                        <div style={{flex: 1, height: 1, background: '#FFFEEE'}}/>
                        <span style={{
                            fontFamily: "'Abhaya Libre', serif",
                            fontSize: 14,
                            color: '#FFFFFF'
                        }}>EZRA &amp; SALSA</span>
                    </motion.div>

                    {/* Go Back */}
                    <motion.div custom={13} variants={fadeUp} initial="hidden" animate="visible"
                                className="flex flex-col items-center">
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
                                }}>Go Back</span>
                            </div>
                        </Link>
                    </motion.div>

                </div>
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
