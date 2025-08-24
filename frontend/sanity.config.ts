import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import schemas from './sanity/schemas/index'

export default defineConfig({
  name: 'default',
  title: 'Medusa Content',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [visionTool()],
  schema: {
    types: schemas,
  },
})
