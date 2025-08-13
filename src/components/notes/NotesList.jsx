'use client'

import { useEffect, useState } from 'react'
import NoteCard from './NoteCard'
import NoteForm from './NoteForm'
import { Search, Loader2 } from 'lucide-react'

export default function NotesList() {
  const [notes, setNotes] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  /* fetch notes */
  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/notes')
    const json = await res.json()
    setNotes(json.data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  /* filter + sort */
  const filtered = notes
    .filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT – list */}
          <section className="lg:col-span-1 space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notes</h1>
              <p className="text-gray-600 text-sm">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
              </p>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search notes…"
                className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm py-4 pl-12 pr-4 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
            </div>

            {/* List area */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
              {loading ? (
                <div className="flex flex-col items-center gap-3 text-gray-500 py-12">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                  <span className="font-medium">Loading…</span>
                </div>
              ) : filtered.length ? (
                <ul className="space-y-4">
                  {filtered.map(n => (
                    <li key={n.id}>
                      <NoteCard
                        note={n}
                        onSelect={async id => {
                          const res = await fetch(`/api/notes/${id}`)
                          const json = await res.json()
                          setSelected(json.data)
                        }}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">No notes found.</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {query ? 'Try a different search term' : 'Create your first note'}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT – form */}
          <section className="lg:col-span-2">
            <NoteForm
              note={selected}
              onSaved={() => {
                setSelected(null)
                load()
              }}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
