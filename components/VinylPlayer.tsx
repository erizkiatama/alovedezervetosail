'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function VinylPlayer() {
    const [playing, setPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const audio = new Audio('/music.mp3')
        audio.loop = true
        audio.volume = 0.5
        audioRef.current = audio

        // Try autoplay first
        audio.play().then(() => setPlaying(true)).catch(() => { })

            // Also attach to window so envelope page can trigger it
            ; (window as any).__playMusic = () => {
                if (audioRef.current && !playing) {
                    audioRef.current.play().then(() => setPlaying(true)).catch(() => { })
                }
            }

        // Play on any interaction as fallback
        function playOnFirstTouch() {
            audio.play().then(() => setPlaying(true)).catch(() => { })
        }
        document.addEventListener('touchstart', playOnFirstTouch, { once: true })
        document.addEventListener('click', playOnFirstTouch, { once: true })

        return () => {
            audio.pause()
            audio.src = ''
            document.removeEventListener('touchstart', playOnFirstTouch)
            document.removeEventListener('click', playOnFirstTouch)
        }
    }, [])

    function toggle(e: React.MouseEvent) {
        e.stopPropagation()
        const audio = audioRef.current
        if (!audio) return
        if (playing) { audio.pause(); setPlaying(false) }
        else { audio.play(); setPlaying(true) }
    }

    return (
        <motion.div
            className="fixed bottom-6 right-6 z-50 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={toggle}
            whileTap={{ scale: 0.92 }}
        >
            {/* Glow when playing */}
            {playing && (
                <motion.div
                    className="absolute rounded-full"
                    style={{ inset: -6, background: 'rgba(45,90,61,0.2)' }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            )}

            {/* Spinning vinyl */}
            <motion.div
                className="rounded-full overflow-hidden"
                style={{ width: 64, height: 64, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                animate={{ rotate: playing ? 360 : 0 }}
                transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: 'linear', repeatType: 'loop' }}
            >
                <img src="/vinyl.png" alt="vinyl" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </motion.div>

            {/* Play/pause badge */}
            <div
                className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
                style={{ width: 20, height: 20, background: '#354B39', border: '2px solid #C9F5BE' }}
            >
                {playing ? (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <rect x="1" y="1" width="2" height="6" rx="0.5" fill="white" />
                        <rect x="5" y="1" width="2" height="6" rx="0.5" fill="white" />
                    </svg>
                ) : (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M2 1.5L7 4L2 6.5V1.5Z" fill="white" />
                    </svg>
                )}
            </div>
        </motion.div>
    )
}