// https://docs.astro.build/en/guides/content-collections/#defining-collections

import { z, defineCollection, getCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { getCountryCodes } from '@/utils/countries';

const productsCollection = defineCollection({
  type: 'content',
    schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    main: z.object({
      id: z.number(),
      content: z.string(),
      imgCard: image(),
      imgMain: image(),
      imgAlt: z.string(),
    }),
    tabs: z.array(
      z.object({
        id: z.string(),
        dataTab: z.string(),
        title: z.string(),
      })
    ),
    longDescription: z.object({
      title: z.string(),
      subTitle: z.string(),
      btnTitle: z.string(),
      btnURL: z.string(),
    }),
    descriptionList: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsLeft: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsRight: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ).optional(),
    tableData: z.array(
      z.object({
        feature: z.array(z.string()),
        description: z.array(z.array(z.string())),
      })
    ).optional(),
    blueprints: z.object({
      first: image().optional(),
      second: image().optional(),
    }),
  }),
});

const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) => z.object ({
    title: z.string(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    pubDate: z.date(),
    cardImage: image(),
    cardImageAlt: z.string(),
    readTime: z.number(),
    tags: z.array(z.string()).optional(),
    category: z.array(z.string()).length(1),
  }).refine(async (data) => {
    if (data.author) {
      // Verificar que el autor existe en membersCollection
      const members = await getCollection('members');
      const authorExists = members.some(member => member.slug === data.author);
      if (!authorExists) {
        throw new Error(`Author ${data.author} not found in members collection`);
      }
    }
    return true;
  }, {
    message: "Author must exist in members collection"
  }),
});

const insightsCollection = defineCollection({
  type: "content",
  schema: ({ image }) => z.object ({
  title: z.string(),
  description: z.string(),
  // contents: z.array(z.string()),
  cardImage: image(),
  cardImageAlt: z.string(),
  }),
});

// Red Profesional de Programadores
const membersCollection = defineCollection({
  type: "content",
  schema: ({ image }) => z.object ({
    // Información Personal
    nombre: z.string(),
    imagen: image().refine((img) => img.width >= 100 && img.height >= 100, {
      message: 'La imagen debe ser al menos 100x100px'
    }),
    idiomas: z.array(z.string()).optional(),
    pais: z.enum(['', ...getCountryCodes()]).optional(),
    ciudad: z.string().optional(),

    // Información de Contacto
    redesSociales: z.object({
      github: z.string().optional(),
      linkedIn: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional(),
    }).optional(),

    // Información Profesional
    profesion: z.string().optional(),
    biografia: z.string(),
    tecnologias: z.array(z.string()).min(1).optional(),
    disponibleParaTrabajar: z.boolean().default(false),
    disponibleParaMentoria: z.boolean().default(false),
    disponibleParaProyectos: z.boolean().default(false),

    // Información de la Empresa
    empresa: z.object({
      nombre: z.string(),
      cargo: z.string().optional(),
      departamento: z.string().optional(),
      ciudad: z.string().optional(),
      pais: z.enum(['', ...getCountryCodes()]).optional(),
      url: z.string().optional(),
      logo: image().optional().refine(
        (img) => {
          if (img) {
            return img.width >= 100 && img.height >= 100;
          }
          return true;
        }, {
        message: 'La imagen debe ser al menos 100x100px'
      }),
    }).optional(),

    // Información de Membresía
    fechaIngreso: z.date().default(new Date()),
    rol: z.enum(['miembro', 'administrador']).default('miembro'),
    activo: z.boolean().default(true),
  }),
});

export const collections = {
  members: membersCollection,
  docs: defineCollection({ schema: docsSchema() }),
  'products': productsCollection,
  'blog': blogCollection,
  'insights': insightsCollection,
};
