import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const journal = defineCollection({
	// Load Markdown and MDX files in the `src/content/journal/` directory.
	loader: glob({ base: './src/content/journal', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.yml' }),
	schema: ({ image }) =>
		z.object({
			id: z.string(),
			name: z.string(),
			bio: z.string(),
			avatar: image().optional(),
			role: z.string().optional(),
			location: z.string().optional(),
			focus: z.string().optional(),
		}),
});

const socials = defineCollection({
	loader: file('src/content/socials.yml'),
	schema: z.object({
		id: z.string().optional(),
		label: z.string(),
		href: z.string(),
	}),
});

const events = defineCollection({
	// Load Markdown and MDX files in the `src/content/events/` directory.
	loader: glob({ base: './src/content/events', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			eventDate: z.coerce.date().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

const privateDiningSpaces = defineCollection({
		loader: glob({ base: './src/content/private-dining-spaces', pattern: '**/*.yml' }),
		schema: ({ image }) =>
			z.object({
				name: z.string().trim().min(1),
				capacity: z.number().int().positive(),
				description: z.string().optional(),
				image: image().optional(),
			}),
});

const site = defineCollection({
	loader: file('src/site-config.yml'),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		based: z.string().optional(),
		timezone: z.string().optional(),
		locale: z.string().optional(),
		visit: z.object({
			address: z.object({
				en: z.string().min(1),
				fr: z.string().min(1),
			}),
			publicTransport: z.object({
				en: z.array(z.string().min(1)),
				fr: z.array(z.string().min(1)),
			}),
			hours: z.object({
				en: z.array(z.object({
					day: z.string().min(1),
					schedule: z.string().min(1),
				})).length(7),
				fr: z.array(z.object({
					day: z.string().min(1),
					schedule: z.string().min(1),
				})).length(7),
			}),
		}),
	}),
});

const testimonials = defineCollection({
	loader: glob({ base: './src/content/testimonials', pattern: '**/*.yml' }),
	schema: ({ image }) =>
		z.object({
			quote: z.string(),
			author: z.string(),
			role: z.string().optional(),
			avatar: image().optional(),
		}),
});

const menuQuantity = z.object({
	amount: z.number().int().positive(),
	unit: z.string().trim().min(1),
});

const menus = defineCollection({
	loader: glob({ base: './src/content/menus', pattern: '**/*.yml' }),
	schema: z.object({
		id: z.string().min(1),
		title: z.string(),
		description: z.string().optional(),
		order: z.number().int(),
	}),
});

const menu = defineCollection({
	loader: glob({ base: './src/content/menu', pattern: '**/*.yml' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			description: z.string(),
			menu: z.string().min(1),
			category: z.enum(['STARTERS', 'MAINS', 'SIDES', 'DESSERTS', 'DRINKS', 'WINES', 'COCKTAILS']),
			price: z.string().min(1).optional(),
			quantity: menuQuantity.optional(),
			allergens: z.array(z.enum(['seafood', 'egg', 'gluten'])).default([]),
			variants: z.array(
				z.object({
					name: z.string().min(1),
					price: z.string().min(1).optional(),
					quantity: menuQuantity.optional(),
				}),
			).default([]),
			tags: z.array(z.enum(['spicy', 'vegetarian', 'alcohol', 'organic'])).default([]),
			order: z.number().int(),
			image: image().optional(),
		}).refine(
			({ price, variants }) => Boolean(price) || (variants.length > 0 && variants.every((variant) => variant.price)),
			{ message: 'Each menu item needs a price or every variant must have a price.' },
		),
});

export const collections = { journal, socials, authors, events, privateDiningSpaces, site, testimonials, menu, menus };
