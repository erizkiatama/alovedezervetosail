import type {Metadata, Viewport} from 'next'
import localFont from 'next/font/local'
import VinylPlayer from '@/components/VinylPlayer'
import '../styles/globals.css'

const imprintMT = localFont({
    src: '../public/fonts/imprint-mt-shadow.ttf',
    variable: '--font-imprint',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Ezra & Salsa — Wedding Invitation',
    description: 'You are cordially invited to the wedding of Ezra & Salsa on 30 May 2026 at Islamic Centre NTB.',
    openGraph: {
        title: 'Ezra & Salsa — Wedding Invitation',
        description: 'You are cordially invited to celebrate our union. 30 May 2026 · Islamic Centre NTB',
        type: 'website',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#2e3d30',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={imprintMT.variable}>
        {children}
        <VinylPlayer/>
        </body>
        </html>
    )
}