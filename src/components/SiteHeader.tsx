'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

type Category = { name: string; slug: string }
const fallbackCategories: Category[] = [
  { name: 'Battery Packs', slug: 'battery-packs' },
  { name: 'EV Batteries', slug: 'ev-batteries' },
  { name: 'Battery Modules', slug: 'battery-modules' },
  { name: 'Battery Cells', slug: 'battery-cells' },
  { name: 'Custom Solutions', slug: 'custom-battery-solutions' },
]

export function SiteHeader({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productCategories = categories.length ? categories : fallbackCategories

  return <header className="site-header">
    <div className="wrap nav">
      <Link href="/" className="brand" aria-label="GreenVolt home"><Image src="/assets/greenvolt-logo.png" width={128} height={88} alt="GreenVolt Energy Solutions" priority /></Link>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><span/><span/><span/></button>
      <nav id="primary-navigation" className={`primary-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation" onClick={(event) => { if (event.target instanceof Element && event.target.closest('a')) { setMenuOpen(false); setProductsOpen(false) } }}>
        <Link href="/">Home</Link>
        <Link href="/about">About us</Link>
        <div className={`nav-dropdown${productsOpen ? ' expanded' : ''}`}>
          <button type="button" aria-expanded={productsOpen} onClick={() => setProductsOpen(!productsOpen)}>Products <span aria-hidden="true">⌄</span></button>
          <div className="dropdown-menu"><Link href="/products">All products</Link>{productCategories.map((category) => <Link key={category.slug} href={`/products?category=${encodeURIComponent(category.name)}`}>{category.name}</Link>)}</div>
        </div>
        <Link href="/solutions">Solutions</Link><Link href="/technology">Technology</Link><Link href="/capabilities">Capabilities</Link><Link href="/certifications">Quality</Link><Link href="/contact">Contact</Link>
        <Link className="button primary nav-cta" href="/contact?type=quote">Request a quote <span aria-hidden="true">↗</span></Link>
      </nav>
      <Link className="button primary desktop-cta" href="/contact?type=quote">Inquiry now <span aria-hidden="true">↗</span></Link>
    </div>
  </header>
}
