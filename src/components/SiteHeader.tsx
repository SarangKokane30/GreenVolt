'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

type Category = { name: string; slug: string }
type NavigationItem = { label: string; href: string; order?: number | null }
const allowedNavPaths = new Set(['/', '/about', '/products', '/solutions', '/technology', '/capabilities', '/certifications', '/contact'])
const defaultNavigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/solutions', label: 'Applications' },
  { href: '/technology', label: 'Technology' },
  { href: '/capabilities', label: 'Manufacturing' },
  { href: '/certifications', label: 'Quality' },
  { href: '/contact', label: 'Contact' },
]
const fallbackCategories: Category[] = [
  { name: 'EV Battery Packs', slug: 'ev-battery-packs' },
  { name: 'Solar & Energy Storage', slug: 'solar-energy-storage' },
  { name: 'Industrial & Backup', slug: 'industrial-backup' },
  { name: 'Agricultural Applications', slug: 'agricultural-applications' },
  { name: 'Custom Battery Packs', slug: 'custom-battery-packs' },
]

export function SiteHeader({ categories, navigation = [] }: { categories: Category[]; navigation?: NavigationItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productCategories = categories.length ? categories : fallbackCategories
  const configured = new Map(navigation.filter(item => allowedNavPaths.has(item.href) && item.label.trim()).map(item => [item.href, item]))
  const navItems = defaultNavigation.map((item, index) => {
    const custom = configured.get(item.href)
    return { href: item.href, label: custom?.label.trim().slice(0, 48) || item.label, order: Number.isFinite(custom?.order) ? custom?.order as number : (index + 1) * 10 }
  }).sort((a, b) => a.order - b.order)

  return <header className="site-header">
    <div className="wrap nav">
      <Link href="/" className="brand" aria-label="Green Volt Energy Solution home"><Image src="/assets/greenvolt-logo.png" width={128} height={88} alt="Green Volt Energy Solution" priority /></Link>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><span/><span/><span/></button>
      <nav id="primary-navigation" className={`primary-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation" onClick={(event) => { if (event.target instanceof Element && event.target.closest('a')) { setMenuOpen(false); setProductsOpen(false) } }}>
        {navItems.map(item => item.href === '/products' ? <div className={`nav-dropdown${productsOpen ? ' expanded' : ''}`} key={item.href}>
          <button type="button" aria-expanded={productsOpen} onClick={() => setProductsOpen(!productsOpen)}>{item.label} <span aria-hidden="true">⌄</span></button>
          <div className="dropdown-menu"><Link href="/products">All products</Link>{productCategories.map((category) => <Link key={category.slug} href={`/products?category=${encodeURIComponent(category.name)}`}>{category.name}</Link>)}</div>
        </div> : <Link href={item.href} key={item.href}>{item.label}</Link>)}
        <Link className="button primary nav-cta" href="/contact?type=quote">Request a Quote <span aria-hidden="true">↗</span></Link>
      </nav>
      <Link className="button primary desktop-cta" href="/contact?type=quote">Request a Quote <span aria-hidden="true">↗</span></Link>
    </div>
  </header>
}
