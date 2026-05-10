'use client'

import {useState, useEffect} from 'react'
import {motion, useAnimationControls, AnimatePresence} from 'framer-motion'
import {useRouter, useSearchParams} from 'next/navigation'
import Image from 'next/image'
import {Suspense} from 'react'
import TokenGuard from '@/components/TokenGuard'
import {WEDDING} from '@/lib/wedding-data'

function EnvelopePage({guestName}: { guestName: string | null }) {
    const [opened, setOpened] = useState(false)
    const [ready, setReady] = useState(false)
    const [selecting, setSelecting] = useState(false)
    const [flapSrc, setFlapSrc] = useState('/envelope/top-outer.png')
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const name = guestName || searchParams.get('name')

    const flapCtrl = useAnimationControls()
    const card1Ctrl = useAnimationControls()
    const card2Ctrl = useAnimationControls()
    const envelopeCtrl = useAnimationControls()
    const sealCtrl = useAnimationControls()

    useEffect(() => {
        if (searchParams.get('opened') === 'true') {
            openEnvelope()
        }
    }, [])

    async function openEnvelope() {
        if (opened) return
        setOpened(true)

        await Promise.all([
            (async () => {
                await flapCtrl.start({rotateX: -90, transition: {duration: 0.35, ease: 'easeIn'}})
                setFlapSrc('/envelope/top-inner.png')
                await flapCtrl.start({rotateX: -185, transition: {duration: 0.35, ease: 'easeOut'}})
            })(),
            sealCtrl.start({opacity: 0, scale: 0.6, transition: {duration: 0.25}}),
            (async () => {
                await card1Ctrl.start({
                    y: -120, x: -62, rotateX: -8, z: 120, opacity: 1, scale: 1,
                    transition: {duration: 0.55, delay: 0.15, type: 'spring', stiffness: 140, damping: 18}
                })
            })(),
            (async () => {
                await card2Ctrl.start({
                    y: -120, x: 62, rotateX: -8, z: 120, opacity: 1, scale: 1,
                    transition: {duration: 0.55, delay: 0.22, type: 'spring', stiffness: 140, damping: 18}
                })
            })(),
            envelopeCtrl.start({
                z: -50, rotateX: 5, opacity: 0.7,
                transition: {duration: 0.6, delay: 0.3}
            }),
        ])

        setReady(true)
    }

    async function closeEnvelope() {
        if (!ready || selecting) return
        setReady(false)

        setFlapSrc('/envelope/top-outer.png')

        await Promise.all([
            card1Ctrl.start({y: 0, x: 0, rotateX: 0, z: 0, opacity: 0, transition: {duration: 0.4, ease: 'easeIn'}}),
            card2Ctrl.start({y: 0, x: 0, rotateX: 0, z: 0, opacity: 0, transition: {duration: 0.4, ease: 'easeIn'}}),
            envelopeCtrl.start({z: 0, rotateX: 0, opacity: 1, transition: {duration: 0.5}}),
            flapCtrl.start({rotateX: 0, transition: {duration: 0.5, ease: 'easeOut'}}),
        ])

        await sealCtrl.start({opacity: 1, scale: 1, transition: {duration: 0.3}})
        setOpened(false)
    }

    async function selectCard(section: string, cardCtrl: ReturnType<typeof useAnimationControls>, otherCtrl: ReturnType<typeof useAnimationControls>) {
        if (!ready || selecting) return
        setSelecting(true)
        setReady(false)

        await Promise.all([
            cardCtrl.start({
                y: -200, z: 300, scale: 1.2, opacity: 0, rotateX: -20,
                transition: {duration: 0.5, ease: [0.4, 0, 0.2, 1]}
            }),
            otherCtrl.start({
                y: -90, z: -40, scale: 0.88, opacity: 0,
                transition: {duration: 0.4, ease: 'easeIn'}
            }),
        ])

        // Pass token OR name forward so guest identity persists
        const query = token
            ? `?token=${token}`
            : name
                ? `?name=${encodeURIComponent(name)}`
                : ''
        router.push(`/${section}${query}`)
    }

    const EW = 306
    const EH = 225
    const FLAP_H = 162

    const cardBase = {
        width: 112, height: 148, borderRadius: 14,
        bottom: 28, paddingBottom: 16,
    }

    return (
        <main
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
            style={{background: '#C9F5BE'}}
            onClick={ready ? closeEnvelope : undefined}
        >
            <div style={{perspective: '600px', perspectiveOrigin: '50% 60%'}}>

                {/* Invitee name */}
                <AnimatePresence>
                    {!opened && (
                        <motion.div
                            className="text-center mb-6"
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3, delay: 0.3}}
                        >
                            <p className="font-body italic text-sm" style={{color: '#2d5a3d', letterSpacing: 1}}>
                                Kepada Yth.
                            </p>
                            <p className="font-display text-lg tracking-widest mt-1" style={{color: '#1a3d28'}}>
                                {name || 'Tamu Undangan'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{
                    position: 'relative',
                    width: EW,
                    height: EH + 200,
                    transformStyle: 'preserve-3d',
                    marginTop: -100
                }}>

                    {!opened && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                openEnvelope()
                            }}
                            className="absolute cursor-pointer"
                            style={{bottom: 0, left: 0, width: EW, height: EH, zIndex: 30}}
                        />
                    )}

                    {/* Card 1 — Invitation Card */}
                    <motion.div
                        className="absolute flex flex-col items-center justify-end"
                        style={{
                            ...cardBase,
                            background: '#F3E9D3',
                            border: '1px solid #C1B0A1',
                            left: '50%', marginLeft: -cardBase.width / 2,
                            opacity: 0, z: 0,
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
                            cursor: ready ? 'pointer' : 'default',
                            zIndex: 20,
                        }}
                        animate={card1Ctrl}
                        onClick={(e) => {
                            e.stopPropagation();
                            selectCard('invitation', card1Ctrl, card2Ctrl)
                        }}
                        whileHover={{}}
                    >
                        <CardInner textColor="#5a4535" label={['Invitation', 'Card']}/>
                    </motion.div>

                    {/* Card 2 — Gallery */}
                    <motion.div
                        className="absolute flex flex-col items-center justify-end"
                        style={{
                            ...cardBase,
                            background: '#CFD9BF',
                            border: '1px solid #C1B0A1',
                            left: '50%', marginLeft: -cardBase.width / 2,
                            opacity: 0, z: 0,
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
                            cursor: ready ? 'pointer' : 'default',
                            zIndex: 20,
                        }}
                        animate={card2Ctrl}
                        onClick={(e) => {
                            e.stopPropagation();
                            selectCard('gallery', card2Ctrl, card1Ctrl)
                        }}
                        whileHover={{}}
                    >
                        <CardInner textColor="#3a4a35" label={['Gallery', '']}/>
                    </motion.div>

                    {/* Envelope */}
                    <motion.div
                        className="absolute"
                        style={{bottom: 0, left: 0, width: EW, height: EH, zIndex: 5, transformStyle: 'preserve-3d'}}
                        animate={envelopeCtrl}
                    >
                        <div className="absolute inset-0" style={{zIndex: 1}}>
                            <Image src="/envelope/bottom-inner.png" alt="" fill style={{objectFit: 'fill'}} priority/>
                        </div>
                        <div className="absolute inset-0" style={{zIndex: 3}}>
                            <Image src="/envelope/bottom-outer.png" alt="" fill style={{objectFit: 'fill'}} priority/>
                        </div>
                        <motion.div
                            className="absolute left-0"
                            style={{
                                width: EW,
                                height: FLAP_H,
                                bottom: EH - FLAP_H,
                                transformOrigin: 'top center',
                                zIndex: 4
                            }}
                            animate={flapCtrl}
                        >
                            <Image src={flapSrc} alt="" fill style={{objectFit: 'fill'}} priority/>
                        </motion.div>
                        <motion.div
                            className="absolute"
                            style={{
                                width: 56,
                                height: 56,
                                left: '50%',
                                marginLeft: -28,
                                bottom: EH - FLAP_H - 20,
                                zIndex: 6
                            }}
                            animate={sealCtrl}
                        >
                            <Image src="/envelope/wax-seal.png" alt="ES" fill style={{objectFit: 'contain'}} priority/>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Hint */}
                <div className="mt-6 h-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!opened && (
                            <motion.p key="tap"
                                      className="font-body italic tracking-widest"
                                      style={{color: '#2d5a3d', fontSize: 15}}
                                      initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                      transition={{duration: 0.5, delay: 1}}
                            >
                                Tap to Open
                            </motion.p>
                        )}
                        {ready && (
                            <motion.p key="choose"
                                      className="font-body italic tracking-widest"
                                      style={{color: '#2d5a3d', fontSize: 15}}
                                      initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                      transition={{duration: 0.4}}
                            >
                                Pick a Card
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Names */}
                <motion.div
                    className="mt-5 text-center"
                    animate={{opacity: opened ? 0 : 1}}
                    transition={{duration: 0.4}}
                >
                    <p className="font-display tracking-[4px] text-xs uppercase" style={{color: '#1a3d28'}}>
                        {WEDDING.groom} & {WEDDING.bride}
                    </p>
                    <p className="font-body italic text-xs mt-1" style={{color: '#2d5a3d', opacity: 0.8}}>
                        {WEDDING.date}
                    </p>
                </motion.div>

            </div>
        </main>
    )
}

function CardInner({textColor, label}: { textColor: string; label: [string, string] }) {
    return (
        <>
            <div
                className="absolute top-0 left-0 right-0"
                style={{
                    height: '55%', borderRadius: '14px 14px 0 0',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 2C10 2 2 10 2 20s8 18 18 18 18-8 18-18S30 2 20 2zm0 4c8 0 14 6 14 14s-6 14-14 14S6 28 6 20 12 6 20 6zm-5 4c-1 3-1 5 0 8-2-1-4-1-6 0 2 1 4 1 5 2-1 2-1 4 0 5 1-1 2-3 3-3 1 2 2 4 4 4-1-2 0-4 1-6 1 2 2 4 2 6 1-1 1-4 0-5 1 1 3 2 3 3 1-1 1-3 0-5 1-1 3-1 5-2-2-1-4-1-6 0 1-3 1-5 0-8-1 2-1 4-2 6-1-2-1-4-1-6z' fill='%23b0a090' opacity='0.18'/%3E%3C/svg%3E")`,
                }}
            />
            <div className="absolute left-3 right-3"
                 style={{top: '55%', height: '0.5px', background: '#C1B0A1', opacity: 0.4}}/>
            <p className="font-body text-center leading-snug relative z-10"
               style={{fontSize: 9.5, letterSpacing: '2px', textTransform: 'uppercase', color: textColor}}>
                {label[0]}<br/>{label[1]}
            </p>
        </>
    )
}

function PageInner() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    return (
        <TokenGuard token={token} onVerified={(name) => (
            <EnvelopePage guestName={name}/>
        )}>
            <EnvelopePage guestName={null}/>
        </TokenGuard>
    )
}

export default function Page() {
    return (
        <Suspense>
            <PageInner/>
        </Suspense>
    )
}