'use client'

import { useState } from 'react'

type Tag = {
  id: string
  name: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState('')

  function addTag() {
    if (!name) return

    setTags([...tags, { id: crypto.randomUUID(), name }])
    setName('')
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Tags</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag"
          className="border p-2"
        />
        <button onClick={addTag}>Add</button>
      </div>

      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  )
}
