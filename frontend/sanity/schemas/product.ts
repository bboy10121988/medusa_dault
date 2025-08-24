import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'productCopy',
  title: 'Product Extra Copy',
  type: 'document',
  fields: [
    defineField({
      name: 'productId',
      title: 'Medusa Product ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string'
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'array',
      of: [{ type: 'block' }]
    })
  ],
  preview: {
    select: { title: 'productId', subtitle: 'tagline' }
  }
})
