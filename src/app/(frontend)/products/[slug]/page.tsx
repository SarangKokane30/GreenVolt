import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

type ProductData = {
  name: string; slug: string; description?: string; code?: string; application?: string; chemistry?: string; cellFormat?: string
  nominalVoltage?: string; capacityAh?: string; energyWh?: string; dimensions?: string; weight?: string; bmsDetails?: string
  connectors?: string; chargingDetails?: string; operatingTemperature?: string; warrantyTerms?: string; availability?: string
  category?: { name?: string } | number | string; images?: Array<{ image?: { url?: string; alt?: string } | number | string; alt?: string }>
  datasheet?: { url?: string; filename?: string } | number | string; specifications?: Array<{ label: string; value: string }>
  seo?: { title?: string; description?: string }
}

async function getProduct(slug: string) {
  const cms = await getCMS()
  return cms ? cms.find({ collection: 'products', where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }, { productType: { equals: 'standard' } }] }, depth: 2, limit: 1 }).then(result => result.docs[0] as unknown as ProductData | undefined).catch(() => undefined) : undefined
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  const canonical = canonicalFor(`/products/${encodeURIComponent(slug)}`)
  return { title: product?.seo?.title || product?.name || 'Battery product', description: product?.seo?.description || product?.description || 'Published Green Volt Energy Solution product information.', ...(canonical ? { alternates: { canonical } } : {}) }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const category = typeof product.category === 'object' && product.category ? product.category.name : typeof product.category === 'string' ? product.category : ''
  const imageRecord = product.images?.[0]
  const image = typeof imageRecord?.image === 'object' ? imageRecord.image : null
  const availability = product.availability === 'available' ? 'Available' : product.availability === 'unavailable' ? 'Currently unavailable' : 'Enquire for configuration'
  const specs = [
    ['Chemistry', product.chemistry], ['Cell format', product.cellFormat], ['Nominal voltage', product.nominalVoltage],
    ['Capacity', product.capacityAh], ['Energy', product.energyWh], ['Dimensions', product.dimensions], ['Weight', product.weight],
    ['BMS details', product.bmsDetails], ['Connectors', product.connectors], ['Charging details', product.chargingDetails],
    ['Operating temperature', product.operatingTemperature], ['Warranty terms', product.warrantyTerms],
    ...(product.specifications || []).map(item => [item.label, item.value] as [string, string]),
  ].filter((item): item is [string, string] => Boolean(item[1]?.trim()))
  const datasheet = typeof product.datasheet === 'object' ? product.datasheet : null

  return <main className="section"><div className="wrap product-detail">
    <Link className="text-link" href="/products">← All standard products</Link>
    {image?.url && <div className="product-detail-image"><Image src={image.url} alt={imageRecord?.alt || image.alt || product.name} fill sizes="(max-width: 760px) 100vw, 70vw" priority/></div>}
    {category && <p className="eyebrow product-detail-category">{category}</p>}
    <h1>{product.name}</h1>
    {product.description && <p className="lead">{product.description}</p>}
    {product.application && <p>{product.application}</p>}
    {product.code && <p>Product code: {product.code}</p>}
    {availability && <p><b>Availability:</b> {availability}</p>}
    {specs.length > 0 && <><h2>Published specifications</h2><dl className="specs">{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></>}
    {datasheet?.url && <p><Link className="text-link" href={datasheet.url} target="_blank">Download product datasheet <span aria-hidden="true">↗</span></Link></p>}
    <p className="product-detail-note">Configuration, availability and warranty depend on the specific product and customer requirements. Confirm details with Green Volt before ordering.</p>
    <Link className="button primary" href={`/contact?type=product-inquiry&product=${encodeURIComponent(product.name)}`}>Enquire for configuration <span aria-hidden="true">↗</span></Link>
  </div></main>
}
