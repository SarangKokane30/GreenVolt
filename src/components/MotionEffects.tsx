'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MotionEffects() {
  const pathname = usePathname()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    let frame = 0
    const updateScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
        setShowTop(window.scrollY > 420)
      })
    }
    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
    return () => { window.removeEventListener('scroll', updateScroll); cancelAnimationFrame(frame) }
  }, [pathname])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    document.documentElement.classList.add('motion-ready')
    const observed = new WeakSet<Element>()
    const reveal = (root: ParentNode) => {
      root.querySelectorAll('main > section, .application-card, .showcase-card, .service-card, .project-card, .quality-record, .cards > *, .chips > *').forEach((element, index) => {
        if (observed.has(element) || !(element instanceof HTMLElement)) return
        observed.add(element)
        element.setAttribute('data-reveal', '')
        element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 65}ms`)
        observer.observe(element)
      })
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })

    reveal(document)
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) reveal(node)
      }))
    })
    mutations.observe(document.querySelector('main') || document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [pathname])

  return <><div className="scroll-progress" aria-hidden="true" style={{ transform: `scaleX(${scrollProgress})` }} /><Link className="floating-inquiry" href="/contact?type=quote"><span className="pulse-dot"/>Talk to our team <span aria-hidden="true">↗</span></Link><button className={`back-to-top${showTop ? ' visible' : ''}`} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button></>
}
