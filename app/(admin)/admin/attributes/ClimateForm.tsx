'use client'

import { useState } from 'react'
import { addAttribute } from './actions'

export default function ClimateForm() {
  const [label, setLabel] = useState('')
  const [slug, setSlug] = useState('')

  return (
    <form
      className="flex gap-4 items-end"
      action={async () => {
        await addAttribute('CLIMATE', label, slug)
        setLabel('')
        setSlug('')
      }}
    >
      <div>
        <label className="block text-sm mb-1">Label</label>
        <input
          className="input"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Warm Weather"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Slug</label>
        <input
          className="input"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="warm"
          required
        />
      </div>

      <button className="btn-primary">Add</button>
    </form>
  )
}
