'use server'

import { db } from '@/lib/db'

export async function addAttribute(
  type: 'CLIMATE' | 'LOOK' | 'EDIT',
  label: string,
  slug: string
) {
  await db.attribute.create({
    data: {
      type,
      label,
      slug
    }
  })
}

export async function deleteAttribute(id: string) {
  await db.attribute.delete({
    where: { id }
  })
}
