'use client'

import {Suspense, useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'

const fadeUp = {
    hidden: {opacity: 0, y: 24},
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: {delay: i * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1]}
    })
}

function useScale(designWidth = 402) {
    const [scale, setScale] = useState(1)
    useEffect(() => {
        function update() {
            setScale(Math.min(1, window.innerWidth / designWidth))
        }

        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [designWidth])
    return scale
}

// Photo slot — placed behind stamp frame
function Photo({src, style, shape = 'rect'}: {
    src?: string | null
    style: React.CSSProperties
    shape?: 'rect' | 'oval' | 'circle'
}) {
    return (
        <div style={{
            position: 'absolute',
            borderRadius: shape === 'rect' ? 4 : '50%',
            overflow: 'hidden',
            background: 'rgba(200,210,200,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...style,
        }}>
            {src
                ? <img src={src} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                : <svg width="22" height="22" viewBox="0 0 28 28" fill="none" opacity={0.2}>
                    <rect x="2" y="5" width="24" height="18" rx="3" stroke="#fff" strokeWidth="1.2"/>
                    <circle cx="14" cy="14" r="4" stroke="#fff" strokeWidth="1.2"/>
                    <circle cx="21" cy="9" r="1.5" fill="#fff"/>
                </svg>
            }
        </div>
    )
}

// Stamp frame — on top of photo
function StampImg({src, style}: { src: string, style: React.CSSProperties }) {
    return (
        <img src={src} alt="" style={{
            position: 'absolute',
            mixBlendMode: 'screen',
            ...style,
        }}/>
    )
}

const star = {
    width: 19,
    height: 19,
    background: '#FFFBED',
    clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
}

function GalleryContent() {
    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const backHref = `/?opened=true${name ? `&name=${encodeURIComponent(name)}` : ''}`
    const scale = useScale(402)

    const W = 402
    const H = 3200

    return (
        <main style={{background: '#354B39', color: '#FFFFFF', display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '100%', maxWidth: W, height: H * scale, overflow: 'hidden', position: 'relative'}}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    marginLeft: `-${W / 2}px`,
                    width: W,
                    height: H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center'
                }}>

                    {/* ── BACKGROUNDS ── */}
                    <div style={{position: 'absolute', inset: 0, background: '#354B39'}}/>
                    {/* Grey-green: top 1159, height 700 (expanded to fit stamps) */}
                    <div style={{
                        position: 'absolute',
                        left: -75,
                        top: 1159,
                        width: 536,
                        height: 510,
                        background: 'rgba(128,140,131,0.86)'
                    }}/>
                    {/* Dark green: top 1859, height 900 */}
                    <div style={{
                        position: 'absolute',
                        left: -75,
                        top: 1670,
                        width: 536,
                        height: 900,
                        background: '#223726'
                    }}/>

                    {/* ── GALLERY TITLE: top 77 ── */}
                    <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                                style={{
                                    position: 'absolute', left: 114, top: 77, width: 174, height: 108,
                                    fontFamily: "'Lovers Quarrel', cursive", fontSize: 96, lineHeight: '108px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                                }}>
                        Gallery
                    </motion.div>

                    {/* Star divider: top 188/198 */}
                    <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                        <div style={{position: 'absolute', left: 15, top: 188, ...star}}/>
                        <div style={{position: 'absolute', left: 369, top: 188, ...star}}/>
                        <div style={{
                            position: 'absolute',
                            left: 40,
                            top: 198,
                            width: 323,
                            borderTop: '1px solid #fff'
                        }}/>
                    </motion.div>

                    {/* The Film: top 251 */}
                    <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                                style={{
                                    position: 'absolute', left: 104, top: 251, width: 197, height: 57,
                                    fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif", fontSize: 48,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                                }}>
                        The Film
                    </motion.div>

                    {/* Film stamp: left 33, top 311, 336x247 */}
                    <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Video placeholder */}
                        <div style={{
                            position: 'absolute',
                            left: 67,
                            top: 354,
                            width: 275,
                            height: 163,
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="1.5" opacity={0.5}/>
                                <path d="M16 13L30 20L16 27V13Z" fill="white" opacity={0.5}/>
                            </svg>
                        </div>
                        <StampImg src="/Stamp-1.png" style={{left: 33, top: 311, width: 336, height: 247}}/>
                    </motion.div>

                    {/* ── THE PHOTOS: top 639 ── */}
                    <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                                style={{
                                    position: 'absolute', left: 111, top: 639, width: 182, height: 72,
                                    fontFamily: "'Lovers Quarrel', cursive", fontSize: 64, lineHeight: '72px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                                }}>
                        The Photos
                    </motion.div>

                    {/* Star divider: top 711/721 */}
                    <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
                        <div style={{position: 'absolute', left: 15, top: 711, ...star}}/>
                        <div style={{position: 'absolute', left: 369, top: 711, ...star}}/>
                        <div style={{
                            position: 'absolute',
                            left: 40,
                            top: 721,
                            width: 323,
                            borderTop: '1px solid #fff'
                        }}/>
                    </motion.div>

                    {/* ── PHOTO ROW 1 (top ~763) ── */}
                    <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Ellipse 3 photo: left 21, top 778, 116x119 */}
                        <Photo style={{left: 21, top: 778, width: 116, height: 119}} shape="circle"
                               src="https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/1-1.jpg"/>
                        <StampImg src="/Stamp-5.png" style={{left: 4, top: 763, width: 150, height: 150}}/>

                        {/* Rectangle 16 photo: left 161, top 795, 95x98 */}
                        <Photo style={{left: 161, top: 795, width: 95, height: 98}}/>
                        <StampImg src="/Stamp-2.png" style={{left: 107, top: 774, width: 194, height: 142}}/>

                        {/* Ellipse 4 photo: left 276, top 761, 104x162 */}
                        <Photo style={{left: 276, top: 761, width: 104, height: 162}} shape="oval"/>
                        <StampImg src="/Stamp-4.png" style={{left: 265, top: 748, width: 125, height: 185}}/>
                    </motion.div>

                    {/* ── PHOTO ROW 2 (top ~904) ── */}
                    <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Rectangle 14 photo: left 18, top 938, 233x143 */}
                        <Photo style={{left: 18, top: 938, width: 233, height: 143}}/>
                        <StampImg src="/Stamp-1.png" style={{left: -11, top: 904, width: 282, height: 208}}/>

                        {/* Rubber stamp decoration */}
                        <img src="/rubber-stamp.png" alt="" style={{
                            position: 'absolute', left: -23, top: 1039,
                            width: 159, height: 93,
                            transform: 'rotate(-16.27deg)',
                            opacity: 0.85, mixBlendMode: 'screen',
                        }}/>

                        {/* Rectangle 15 photo: left 279, top 968, 114x120 */}
                        <Photo style={{left: 279, top: 968, width: 114, height: 120}}/>
                        <StampImg src="/Stamp-2.png" style={{left: 216, top: 944, width: 227, height: 167}}/>
                    </motion.div>

                    {/* ── GREY-GREEN SECTION (top 1159) ── */}
                    <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Row 1: Stamp-3 landscape left + Stamp-1 portrait right */}
                        <Photo style={{left: 23, top: 1192, width: 216, height: 106}}/>
                        <StampImg src="/Stamp-3.png" style={{left: 0, top: 1166, width: 261, height: 154}}/>

                        <Photo style={{left: 288, top: 1180, width: 89, height: 148}}/>
                        <StampImg src="/Stamp-1.png" style={{left: 266, top: 1152, width: 130, height: 210}}/>
                    </motion.div>

                    <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Row 2: Stamp-5 circle left + Stamp-4 tall oval right */}
                        <Photo style={{left: 41, top: 1355, width: 147, height: 150}} shape="circle"/>
                        <StampImg src="/Stamp-5.png" style={{left: 20, top: 1315, width: 186, height: 185}}/>

                        <Photo style={{left: 222, top: 1370, width: 155, height: 240}} shape="oval"/>
                        <StampImg src="/Stamp-4.png" style={{left: 200, top: 1363, width: 200, height: 300}}/>
                    </motion.div>

                    <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Row 3: Stamp-2 landscape */}
                        <Photo style={{left: 50, top: 1525, width: 125, height: 125}}/>
                        <StampImg src="/Stamp-2.png" style={{left: -15, top: 1500, width: 245, height: 180}}/>
                    </motion.div>

                    {/* ── DARK GREEN SECTION (top 1859) ── */}
                    <motion.div custom={11} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Row 4: Stamp-3 portrait left + Stamp-4 landscape right */}
                        <Photo style={{left: 18, top: 1890, width: 127, height: 220}}/>
                        <StampImg src="/Stamp-3.png" style={{left: -2, top: 1870, width: 165, height: 270}}/>

                        <Photo style={{left: 185, top: 1900, width: 190, height: 120}} shape="oval"/>
                        <StampImg src="/Stamp-4.png" style={{left: 168, top: 1880, width: 225, height: 160}}/>
                    </motion.div>

                    <motion.div custom={12} variants={fadeUp} initial="hidden" animate="visible">
                        {/* Row 5: Stamp-1 right + Stamp-2 left + Stamp-5 right */}
                        <Photo style={{left: 192, top: 2090, width: 187, height: 113}}/>
                        <StampImg src="/Stamp-1.png" style={{left: 170, top: 2062, width: 227, height: 167}}/>

                        <Photo style={{left: 20, top: 2190, width: 143, height: 143}}/>
                        <StampImg src="/Stamp-2.png" style={{left: -60, top: 2155, width: 294, height: 216}}/>

                        <Photo style={{left: 210, top: 2175, width: 155, height: 155}} shape="circle"/>
                        <StampImg src="/Stamp-5.png" style={{left: 193, top: 2158, width: 192, height: 191}}/>
                    </motion.div>

                    {/* ── FULL BG PHOTO: top 2400 ── */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 2400,
                        width: 402,
                        height: 500,
                        background: '#2a3a2a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.6
                    }}>
                        <svg width="40" height="40" viewBox="0 0 28 28" fill="none" opacity={0.3}>
                            <rect x="2" y="5" width="24" height="18" rx="3" stroke="#fff" strokeWidth="1.2"/>
                            <circle cx="14" cy="14" r="4" stroke="#fff" strokeWidth="1.2"/>
                        </svg>
                    </div>

                    {/* Ezra & Salsa: top 2830 */}
                    <div style={{
                        position: 'absolute', left: 93, top: 2830, width: 220, height: 72,
                        fontFamily: "'Lovers Quarrel', cursive", fontSize: 64, lineHeight: '72px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                    }}>
                        Ezra &amp; Salsa
                    </div>

                    {/* ── FOOTER: top 3000 ── */}
                    <div style={{
                        position: 'absolute', left: 14, top: 3000,
                        fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif",
                        fontSize: 48, lineHeight: '57px', color: '#FFFFFF'
                    }}>ES
                    </div>
                    <div style={{
                        position: 'absolute',
                        left: 81,
                        top: 3048,
                        width: 293,
                        borderTop: '1px solid #FFFEEE'
                    }}/>
                    <div style={{
                        position: 'absolute', left: 291, top: 3051,
                        fontFamily: "'Abhaya Libre', serif", fontSize: 14, color: '#FFFFFF'
                    }}>EZRA &amp; SALSA
                    </div>

                    {/* Go Back */}
                    <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 3110}}>
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
                    </div>

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
