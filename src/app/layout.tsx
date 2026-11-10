import type { Metadata } from 'next'
import type { ReactNode } from 'react'
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), title: { default: 'GreenVolt Energy Solutions', template: '%s | GreenVolt Energy Solutions' }, description: 'LiFePO₄ battery solutions for electric mobility, energy storage and industrial applications.', openGraph: { type: 'website', siteName: 'GreenVolt Energy Solutions', title: 'GreenVolt Energy Solutions', description: 'LiFePO₄ battery solutions for mobility, storage and industry.' } }
export default function RootLayout({children}:{children:ReactNode}) { return <html lang="en"><body>{children}</body></html> }
