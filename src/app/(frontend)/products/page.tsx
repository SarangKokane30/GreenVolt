import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/products')
export const metadata: Metadata = { title: 'Standard Battery Products', description: 'Browse published standard LiFePO4 battery product records or enquire about a configuration.', ...(canonical ? { alternates: { canonical } } : {}) }

const suggestedCategories = ['EV Battery Packs', 'Two-Wheeler Battery Solutions', 'Three-Wheeler Battery Solutions', 'Four-Wheeler and Commercial EV Solutions', 'Solar and Energy Storage', 'Industrial and Backup Solutions', 'Agricultural Applications']
type Product = { id: string | number; slug: string; name: string; description?: string; chemistry?: string; category?: { name?: string } | number | string | null }
type Category = { name: string }

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const query = await searchParams
  const cms = await getCMS()
  let products: Product[] = []
  let categories: Category[] = []
  if (cms) {
    const [productResult, categoryResult] = await Promise.all([
      (async () => {
        const where: Where = { and: [{ status: { equals: 'published' } }, { productType: { equals: 'standard' } }] }
        if (query.q) where.name = { like: query.q.slice(0, 100) }
        if (query.category) where['category.name'] = { equals: query.category }
        return cms.find({ collection: 'products', where, depth: 1, limit: 100, sort: 'name' }).catch(() => ({ docs: [] }))
      })(),
      cms.find({ collection: 'product-categories', where: { active: { equals: true } }, sort: 'order', limit: 50 }).catch(() => ({ docs: [] })),
    ])
    products = productResult.docs as unknown as Product[]
    categories = categoryResult.docs as unknown as Category[]
  }
  const categoryOptions = categories.length ? categories.map(category => category.name) : suggestedCategories

  return <main className="section"><div className="wrap">
    <p className="eyebrow">Standard products</p>
    <h1>Explore published battery pack configurations.</h1>
    <p className="lead">Only product records added and published by Green Volt are listed. Ask for a configuration if the information you need is not shown.</p>
    <form className="filter" action="/products"><input name="q" defaultValue={query.q} placeholder="Search published products" aria-label="Search products"/><select name="category" defaultValue={query.category}><option value="">All categories</option>{categoryOptions.map(category => <option key={category}>{category}</option>)}</select><button className="button primary">Search products</button></form>
    {products.length ? <div className="cards">{products.map(product => { const category = typeof product.category === 'object' && product.category ? product.category.name : typeof product.category === 'string' ? product.category : ''; return <Link className="card" key={product.id} href={`/products/${product.slug}`}><span className="eyebrow">{category || product.chemistry || 'Battery pack'}</span><h2>{product.name}</h2>{product.description && <p>{product.description}</p>}<b>View details · Enquire for configuration ↗</b></Link> })}</div> : <div className="empty-state">No standard product records are currently published. Ask Green Volt about a product category or configuration. <Link href="/contact?type=product-inquiry">Enquire about products ↗</Link></div>}
    <div className="catalogue-custom"><div><span className="eyebrow">Custom battery packs</span><h2>Need a configuration for your application?</h2><p>Share your equipment, dimensions and electrical requirements for an engineering discussion.</p></div><Link className="button primary" href="/contact?type=custom-solution">Build your custom battery ↗</Link></div>
  </div></main>
}
