import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'The Invitation — Ezra & Salsa',
}

export default function InvitationLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>
}