import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MotionEffects } from '@/components/MotionEffects'
import './site.css'

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return <><MotionEffects/><header className="site-header"><div className="wrap nav"><Link href="/" aria-label="GreenVolt home"><Image src="/assets/greenvolt-logo.png" width={128} height={88} alt="GreenVolt Energy Solutions" priority /></Link><nav aria-label="Main navigation"><Link href="/about">About</Link><Link href="/products">Products</Link><Link href="/solutions">Solutions</Link><Link href="/technology">Technology</Link><Link href="/capabilities">Capabilities</Link><Link href="/certifications">Certifications</Link><Link href="/contact">Contact</Link></nav><Link className="button primary" href="/contact?type=general">Inquiry now ↗</Link></div></header>{children}<footer className="footer"><div className="wrap footer-inner"><Image src="/assets/greenvolt-logo.png" width={128} height={88} alt="GreenVolt Energy Solutions" /><p>LiFePO₄ battery solutions for mobility, energy storage and industrial applications.</p><div><Link href="/products">Products</Link><Link href="/contact">Contact</Link><Link href="/certifications">Certifications</Link></div><small>© {new Date().getFullYear()} GreenVolt Energy Solutions</small></div></footer></>
}
