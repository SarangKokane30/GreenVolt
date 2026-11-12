'use client'

import { useState } from 'react'

type Testimonial = { id: string | number; quote: string; attribution: string; role?: string; organization?: string }

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0)
  const item = items[active]
  const move = (direction: number) => setActive((active + direction + items.length) % items.length)
  return <div className="testimonial-carousel" aria-roledescription="carousel" aria-label="Customer testimonials">
    <div className="testimonial-mark" aria-hidden="true">“</div>
    <blockquote key={item.id} className="testimonial-quote">{item.quote}</blockquote>
    <div className="testimonial-bottom"><div><strong>{item.attribution}</strong>{(item.role || item.organization) && <span>{[item.role, item.organization].filter(Boolean).join(' · ')}</span>}</div><div className="carousel-controls"><span>{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span><button type="button" aria-label="Previous testimonial" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next testimonial" onClick={() => move(1)}>→</button></div></div>
  </div>
}
