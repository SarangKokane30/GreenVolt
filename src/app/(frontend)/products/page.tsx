import Link from 'next/link'
import type { Where } from 'payload'
import { getCMS } from '@/lib/cms'
export const metadata = { title: 'Products | GreenVolt Energy Solutions', description: 'Explore GreenVolt battery pack, EV battery, module, cell and custom solution categories.' }
const categories = ['Battery Packs', 'EV Batteries', 'Battery Modules', 'Battery Cells', 'Custom Battery Solutions']
export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const query = await searchParams
  const cms = await getCMS()
  type Product = {id:string|number;slug:string;name:string;description?:string;chemistry?:string;category?:{name:string}|number|string|null}
  let products: Product[] = []
  if (cms) { const where: Where = { status: { equals: 'published' } }; if (query.q) where.name = { like: query.q }; if (query.category) where['category.name'] = { equals: query.category }; products = await cms.find({ collection: 'products', where, depth: 1, limit: 100, sort: 'name' }).then(r => r.docs as unknown as Product[]).catch(() => []) }
  return <main className="section"><div className="wrap"><p className="eyebrow">Product catalogue</p><h1>Battery solutions for your application.</h1><p className="lead">Browse verified products or share your requirements for a tailored discussion.</p><form className="filter" action="/products"><input name="q" defaultValue={query.q} placeholder="Search products" aria-label="Search products"/><select name="category" defaultValue={query.category}><option value="">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select><button className="button primary">Filter</button></form>{products.length ? <div className="cards">{products.map(p => {const category=typeof p.category==='object'&&p.category?p.category.name:typeof p.category==='string'?p.category:'';return <Link className="card" key={p.id} href={`/products/${p.slug}`}><span className="eyebrow">{category || p.chemistry}</span><h3>{p.name}</h3><p>{p.description}</p><b>View product details ↗</b></Link>})}</div> : <div className="empty-state">There are no published products matching this selection. Product specifications are never estimated. <Link href="/contact?type=product-inquiry">Ask about a category ↗</Link></div>}<div className="chips" style={{marginTop:28}}>{categories.map(c=><Link key={c} href={`/products?category=${encodeURIComponent(c)}`}>{c}</Link>)}</div></div></main>
}
