import type { GlobalConfig } from 'payload'

const adminOnly: NonNullable<GlobalConfig['access']> = {
  read: () => true,
  update: ({ req }) => Boolean(req.user),
}

export const CompanyProfile: GlobalConfig = {
  slug: 'company-profile',
  access: adminOnly,
  fields: [
    { name: 'companyName', type: 'text', required: true, defaultValue: 'Green Volt Energy Solution', access: { read: ({ req }) => Boolean(req.user) } },
    { name: 'ownerName', type: 'text', defaultValue: 'Mr. Siddhant Bodke', access: { read: ({ req }) => Boolean(req.user) } },
    { name: 'overview', type: 'textarea' },
    { name: 'vision', type: 'textarea', defaultValue: 'To become a recognised and trusted battery solutions partner across India by expanding manufacturing capabilities, strengthening industry partnerships and contributing to the future of electric mobility and clean energy.' },
    { name: 'mission', type: 'textarea', defaultValue: 'To manufacture reliable, quality-focused lithium battery solutions, make battery technology more accessible, support clean mobility and deliver customised solutions for diverse applications.' },
    { name: 'address', type: 'textarea', defaultValue: 'L-Block, MIDC, Ahilyanagar, Maharashtra, India' },
    { name: 'phone', type: 'text', defaultValue: '9075599119' },
    { name: 'email', type: 'email', defaultValue: 'siddhantbodke310@gmail.com' },
    { name: 'businessHours', type: 'text' },
    {
      name: 'socialLinks', type: 'group', fields: [
        { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/greenvoltenergysolutions_/' },
        { name: 'whatsapp', type: 'text', defaultValue: 'https://wa.me/919075591199' },
      ],
    },
  ],
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: adminOnly,
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Powering the Future with Custom Lithium Battery Solutions.' },
    { name: 'heroText', type: 'textarea', defaultValue: 'Green Volt Energy Solution designs and manufactures customised LiFePO4 battery packs for electric mobility, energy storage and industrial applications. We work closely with customers to develop battery solutions that meet their specific requirements.' },
    { name: 'aboutIntro', type: 'textarea', defaultValue: 'Green Volt Energy Solution was established with a vision to contribute to the growing electric mobility and clean-energy ecosystem. Driven by an interest in battery technology, sustainable energy and customised engineering, the company focuses on LiFePO4 battery packs for a range of applications. With in-house battery design and assembly capabilities, Green Volt works with customers to develop battery solutions according to their technical and application requirements. The company aims to strengthen its manufacturing capabilities, quality systems and long-term partnerships.' },
    { name: 'applicationsIntro', type: 'textarea' },
    { name: 'manufacturingIntro', type: 'textarea' },
    { name: 'finalCta', type: 'text' },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: adminOnly,
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Green Volt Energy Solution' },
    { name: 'siteUrl', type: 'text' },
    { name: 'defaultDescription', type: 'textarea', defaultValue: 'Customised LiFePO4 battery packs for electric mobility, energy storage and industrial applications.' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
  ],
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: adminOnly,
  fields: [{ name: 'items', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'href', type: 'text', required: true }, { name: 'order', type: 'number' }] }],
}
