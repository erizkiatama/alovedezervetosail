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

function Stamp({
                   frameUrl, photoUrl, left, top, width, height,
                   photoLeft, photoTop, photoWidth, photoHeight,
                   shape = 'rect', zoom = 1, photoPosition = 'center'
               }: {
    frameUrl: string
    photoUrl?: string | null
    left: number
    top: number
    width: number
    height: number
    photoLeft: number
    photoTop: number
    photoWidth: number
    photoHeight: number
    shape?: 'rect' | 'circle' | 'oval'
    zoom?: number
    photoPosition?: string
}) {
    return (
        <>
            <img src={frameUrl} alt="" style={{
                position: 'absolute',
                left, top, width, height,
                mixBlendMode: 'screen',
            }}/>
            <div style={{
                position: 'absolute',
                left: photoLeft, top: photoTop,
                width: photoWidth, height: photoHeight,
                borderRadius: shape === 'rect' ? 4 : '50%',
                overflow: 'hidden',
                background: 'rgba(180,195,180,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {photoUrl
                    ? <img src={photoUrl} alt="" style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        objectPosition: photoPosition,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center',
                    }}/>
                    : <svg width="22" height="22" viewBox="0 0 28 28" fill="none" opacity={0.2}>
                        <rect x="2" y="5" width="24" height="18" rx="3" stroke="#fff" strokeWidth="1.2"/>
                        <circle cx="14" cy="14" r="4" stroke="#fff" strokeWidth="1.2"/>
                        <circle cx="21" cy="9" r="1.5" fill="#fff"/>
                    </svg>
                }
            </div>
        </>
    )
}

const star = {
    width: 19, height: 19, background: '#FFFBED',
    clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
}

function GalleryContent() {
    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const backHref = `/?opened=true${name ? `&name=${encodeURIComponent(name)}` : ''}`
    const scale = useScale(402)

    const W = 402
    const H = 3200

    const photos = {
        p1: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/1-1.webp',
        p2: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/1-2.webp',
        p3: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/1-3.webp',
        p4: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/1-4.webp',
        p5: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/1-5.webp',
        p6: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/2-1.webp',
        p7: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/2-2.webp',
        p8: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/2-3.webp',
        p9: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/2-4.webp',
        p10: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/2-5.webp',
        p11: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/3-1.webp',
        p12: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/3-2.webp',
        p13: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/3-3.webp',
        p14: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/3-4.webp',
        p15: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/3-5.webp',
        filmBg: 'https://cyrubgnnrqrwsapilqbz.supabase.co/storage/v1/object/public/wedding/end.webp',
    }

    return (
        <main style={{background: '#354B39', color: '#FFFFFF', display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '100%', maxWidth: W, height: H * scale, overflow: 'hidden', position: 'relative'}}>
                <div style={{
                    position: 'absolute', top: 0, left: '50%', marginLeft: `-${W / 2}px`,
                    width: W, height: H,
                    transform: `scale(${scale})`, transformOrigin: 'top center'
                }}>

                    {/* ── BACKGROUNDS ── */}
                    <div style={{position: 'absolute', inset: 0, background: '#354B39'}}/>
                    <div style={{
                        position: 'absolute',
                        left: -75,
                        top: 1159,
                        width: 536,
                        height: 510,
                        background: 'rgba(128,140,131,0.86)'
                    }}/>
                    <div style={{
                        position: 'absolute',
                        left: -75,
                        top: 1670,
                        width: 536,
                        height: 1530,
                        background: '#223726'
                    }}/>

                    {/* ── GALLERY TITLE ── */}
                    <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                                style={{
                                    position: 'absolute', left: 114, top: 77, width: 174, height: 108,
                                    fontFamily: "'Lovers Quarrel', cursive", fontSize: 96, lineHeight: '108px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                                }}>
                        Gallery
                    </motion.div>

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

                    {/* The Film */}
                    <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                                style={{
                                    position: 'absolute', left: 104, top: 251, width: 197, height: 57,
                                    fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif", fontSize: 48,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                                }}>
                        The Film
                    </motion.div>

                    {/* Film stamp */}
                    <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
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
                        <img src="/Stamp-1.png" alt="" style={{
                            position: 'absolute',
                            left: 33,
                            top: 311,
                            width: 336,
                            height: 247,
                            mixBlendMode: 'screen'
                        }}/>
                    </motion.div>

                    {/* The Photos title */}
                    <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                                style={{
                                    position: 'absolute', left: 111, top: 639, width: 182, height: 72,
                                    fontFamily: "'Lovers Quarrel', cursive", fontSize: 64, lineHeight: '72px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                                }}>
                        The Photos
                    </motion.div>

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

                    {/* ── ROW 1 ── */}
                    <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
                        <Stamp frameUrl="/Stamp-5.png" photoUrl={photos.p1}
                               left={4} top={763} width={150} height={150}
                               photoLeft={21} photoTop={778} photoWidth={116} photoHeight={119}
                               shape="circle" zoom={1.25}/>
                        <Stamp frameUrl="/Stamp-2.png" photoUrl={photos.p2}
                               left={107} top={774} width={194} height={142}
                               photoLeft={161} photoTop={795} photoWidth={95} photoHeight={98} photoPosition="0% 15%"/>
                        <Stamp frameUrl="/Stamp-4.png" photoUrl={photos.p3}
                               left={265} top={748} width={125} height={185}
                               photoLeft={276} photoTop={761} photoWidth={104} photoHeight={162}
                               shape="oval" zoom={1.5} photoPosition='-25% 0%'/>
                    </motion.div>

                    {/* ── ROW 2 ── */}
                    <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
                        <Stamp frameUrl="/Stamp-1.png" photoUrl={photos.p4}
                               left={-11} top={904} width={282} height={208}
                               photoLeft={18} photoTop={938} photoWidth={233} photoHeight={143}
                               photoPosition='0% 62.5%'/>
                        <img src="/rubber-stamp.png" alt="" style={{
                            position: 'absolute', left: -23, top: 1039, width: 159, height: 93,
                            transform: 'rotate(-16.27deg)', opacity: 0.85, mixBlendMode: 'screen',
                        }}/>
                        <Stamp frameUrl="/Stamp-2.png" photoUrl={photos.p5}
                               left={216} top={944} width={227} height={167}
                               photoLeft={279} photoTop={968} photoWidth={114} photoHeight={120} zoom={1.5}/>
                    </motion.div>

                    {/* ── GREY-GREEN: ROW 3 ── */}
                    <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
                        <Stamp frameUrl="/Stamp-3.png" photoUrl={photos.p6}
                               left={0} top={1166} width={261} height={154}
                               photoLeft={23} photoTop={1192} photoWidth={216} photoHeight={106}/>
                        <Stamp frameUrl="/Stamp-1.png" photoUrl={photos.p7}
                               left={266} top={1152} width={130} height={210}
                               photoLeft={279} photoTop={1180} photoWidth={107} photoHeight={148}/>
                    </motion.div>

                    {/* ── GREY-GREEN: ROW 4 ── */}
                    <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
                        <Stamp frameUrl="/Stamp-5.png" photoUrl={photos.p8}
                               left={5} top={1315} width={186} height={185}
                               photoLeft={26} photoTop={1333} photoWidth={147} photoHeight={150}
                               shape="circle" photoPosition='-25%'/>
                        <Stamp frameUrl="/Stamp-4.png" photoUrl={photos.p10}
                               left={185} top={1363} width={220} height={300}
                               photoLeft={208} photoTop={1387} photoWidth={175} photoHeight={250}
                               shape="oval" zoom={1.25} photoPosition='0% 250%'/>
                    </motion.div>

                    {/* ── GREY-GREEN: ROW 5 ── */}
                    <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
                        <Stamp frameUrl="/Stamp-2.png" photoUrl={photos.p9}
                               left={-40} top={1500} width={245} height={180}
                               photoLeft={25} photoTop={1525} photoWidth={125} photoHeight={125} zoom={1.45}
                               photoPosition='0% 110%'/>
                    </motion.div>

                    {/* ── DARK GREEN: ROW 6 ── */}
                    <motion.div custom={11} variants={fadeUp} initial="hidden" animate="visible">
                        <Stamp frameUrl="/Stamp-3.png" photoUrl={photos.p11}
                               left={5} top={1670} width={165} height={305}
                               photoLeft={23} photoTop={1710} photoWidth={127} photoHeight={225}/>
                        <Stamp frameUrl="/Stamp-4.png" photoUrl={photos.p12}
                               left={168} top={1675} width={235} height={150}
                               photoLeft={185} photoTop={1688} photoWidth={200} photoHeight={125}
                               shape="oval" photoPosition="0% 65%"/>
                    </motion.div>

                    {/* ── DARK GREEN: ROW 7 ── */}
                    <motion.div custom={12} variants={fadeUp} initial="hidden" animate="visible">
                        <Stamp frameUrl="/Stamp-1.png" photoUrl={photos.p13}
                               left={165} top={1812} width={227} height={165}
                               photoLeft={187} photoTop={1838} photoWidth={187} photoHeight={113} zoom={2.25}
                               photoPosition="0% 200%"/>
                        <Stamp frameUrl="/Stamp-2.png" photoUrl={photos.p14}
                               left={-60} top={1966} width={294} height={216}
                               photoLeft={21} photoTop={2000} photoWidth={143} photoHeight={143}/>
                        <Stamp frameUrl="/Stamp-5.png" photoUrl={photos.p15}
                               left={193} top={1970} width={200} height={200}
                               photoLeft={215} photoTop={1992} photoWidth={155} photoHeight={155}
                               shape="circle" zoom={1.25}/>
                    </motion.div>

                    {/* ── FULL BG PHOTO with gradient fade ── */}
                    <div style={{position: 'absolute', left: 0, top: 2200, width: 402, height: 1000}}>
                        <img src={photos.filmBg} alt="" style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', objectPosition: 'center top',
                        }}/>
                        {/* Fade from dark green → transparent */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(180deg, #223726 0%, rgba(34,55,38,0.8) 15%, rgba(34,55,38,0) 45%)',
                            pointerEvents: 'none',
                        }}/>
                    </div>

                    {/* Ezra & Salsa */}
                    <div style={{
                        position: 'absolute', left: 93, top: 2730, width: 220, height: 72,
                        fontFamily: "'Lovers Quarrel', cursive", fontSize: 64, lineHeight: '72px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', whiteSpace: 'nowrap'
                    }}>
                        Ezra &amp; Salsa
                    </div>

                    {/* Footer */}
                    <div style={{
                        position: 'absolute', left: 14, top: 3065,
                        fontFamily: "var(--font-imprint), 'Cormorant Garamond', serif",
                        fontSize: 48, lineHeight: '57px', color: '#FFFFFF'
                    }}>ES
                    </div>
                    <div style={{
                        position: 'absolute',
                        left: 81,
                        top: 3096,
                        width: 293,
                        borderTop: '1px solid #FFFEEE'
                    }}/>
                    <div style={{
                        position: 'absolute', left: 275, top: 3099,
                        fontFamily: "'Abhaya Libre', serif", fontSize: 14, color: '#FFFFFF'
                    }}>#alovedEZervetoSAil
                    </div>

                    {/* Go Back */}
                    <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 3140}}>
                        <Link href={backHref}>
                            <div
                                className="flex flex-col items-center gap-2 active:opacity-100 transition-opacity">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 19V5M5 12L12 5L19 12" stroke="#FFFFFF" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span style={{
                                    fontFamily: "'Times New Roman', serif",
                                    fontSize: 14,
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
