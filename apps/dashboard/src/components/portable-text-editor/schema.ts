import { defineSchema } from '@portabletext/editor'
import { defineField } from 'sanity'

import {
  BookIcon,
  BulbOutlineIcon,
  CheckmarkCircleIcon,
  WarningOutlineIcon,
} from '@sanity/icons'

export const schemaDefinition = defineSchema({
  decorators: [
    { title: 'Strong', name: 'strong' },
    { title: 'Emphasis', name: 'em' },
    { title: 'Code', name: 'code' },
  ],
  // Styles apply to entire text blocks
  styles: [
    { title: 'Lead', name: 'lead' },
    { title: 'Heading 2', name: 'h2' },
    { title: 'Heading 3', name: 'h3' },
    { title: 'Heading 4', name: 'h4' },
    { title: 'Blockquote', name: 'blockquote' },
  ],
  // Annotations are more complex marks that can hold data (for example, hyperlinks).
  annotations: [
    {
      name: 'link',
      title: 'Link (URL)',
      fields: [
        {
          name: 'href',
          title: 'URL',
          type: 'string',
        },
        {
          name: 'openInNewWindow',
          title: 'Open in new window',
          type: 'boolean',
        },
      ],
    },
    {
      name: 'internalLink',
      title: 'Link (Internal)',
      // icon: InternalLinkIcon,
      // to: [
      //   { type: 'article' },
      //   { type: 'docsOverview' },
      //   { type: 'lesson' },
      //   { type: 'course' },
      // ],
    },
    {
      name: 'file',
      // type: 'file',
      // icon: DocumentIcon,
    },
  ],
  // Lists apply to entire text blocks as well (for example, bullet, numbered).
  lists: [
    { title: 'Bullet', name: 'bullet' },
    { title: 'Numbered', name: 'number' },
    {
      title: 'Task',
      name: 'task',
      icon: CheckmarkCircleIcon,
    },
    {
      title: 'Action',
      name: 'action',
      icon: BookIcon,
    },
    {
      title: 'Caution',
      name: 'caution',
      icon: WarningOutlineIcon,
    },
    {
      title: 'Note',
      name: 'note',
      icon: BulbOutlineIcon,
    },
  ],
  // Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
  inlineObjects: [
    defineField({
      name: 'article',
      title: 'Reference to Docs',
      type: 'reference',
      to: [{ type: 'article' }, { type: 'docsOverview' }],
    }),
    defineField({
      name: 'lesson',
      title: 'Reference to Lesson',
      type: 'reference',
      to: [{ type: 'lesson' }],
    }),
    defineField({
      name: 'course',
      title: 'Reference to Course',
      type: 'reference',
      to: [{ type: 'course' }],
    }),
    defineField({
      name: 'track',
      title: 'Reference to Track',
      type: 'reference',
      to: [{ type: 'track' }],
    }),
  ],
  // Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
  blockObjects: [
    { name: 'code' },
    { name: 'question' },
    { name: 'blockquote' },
    { name: 'image' },
  ],
})
