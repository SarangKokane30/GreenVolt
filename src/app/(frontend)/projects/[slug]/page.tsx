import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCMS } from '@/lib/cms'

type ProjectRecord = { title: string; slug: string; summary?: string; application?: string; image?: { url?: string; alt?: string } | number | string }

async function findProject(slug: string): Promise<ProjectRecord | null> {
  const cms = await getCMS()
  if (!cms) return null
  return cms.find({ collection: 'projects', where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] }, depth: 1, limit: 1 }).then(result => result.docs[0] as unknown as ProjectRecord || null).catch(() => null)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await findProject(slug)
  return { title: project ? `${project.title} | GreenVolt project story` : 'Project story | GreenVolt', description: project?.summary || 'GreenVolt battery application project information.' }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await findProject(slug)
  if (!project) notFound()
  const image = project.image && typeof project.image === 'object' ? project.image : null
  return <main><section className="cms-page-hero"><div className="wrap"><p className="eyebrow">Approved project story</p><h1>{project.title}</h1><p className="lead">{project.application || 'Battery application'}</p></div></section><section className="section"><article className="wrap project-detail">{image?.url && <div className="project-detail-image"><Image src={image.url} alt={image.alt || project.title} fill sizes="100vw" priority/></div>}<div className="project-detail-copy"><p>{project.summary}</p><Link className="button dark-button" href="/contact?type=custom-solution">Discuss an application ↗</Link></div></article></section></main>
}
