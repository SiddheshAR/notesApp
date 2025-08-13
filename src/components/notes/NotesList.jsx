'use client'

import { useEffect, useState } from 'react'
import NoteCard from './NoteCard'
import NoteForm from './NoteForm'
import Modal from '../ui/Modal'
import { Search, Loader2, Plus, StickyNote } from 'lucide-react'

export default function NotesList() {
  const [notes, setNotes] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

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

  const handleNoteSelect = async (id) => {
    const res = await fetch(`/api/notes/${id}`)
    const json = await res.json()
    setSelected(json.data)
    setShowModal(true)
  }

  const handleAddNote = () => {
    setSelected(null)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelected(null)
  }

  const handleNoteSaved = () => {
    setShowModal(false)
    setSelected(null)
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <StickyNote size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <p className="text-gray-600 text-sm">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
              </p>
            </div>
          </div>

          <button
            onClick={handleAddNote}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus size={20} />
            Add Note
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search your notes..."
            className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm py-4 pl-12 pr-4 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
          />
        </div>

        {/* Notes Grid */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-gray-500 py-16">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <span className="font-medium text-lg">Loading your notes...</span>
            </div>
          ) : filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onSelect={handleNoteSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <StickyNote size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {query ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {query ? 'Try a different search term' : 'Create your first note to get started'}
              </p>
              {!query && (
                <button
                  onClick={handleAddNote}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  <Plus size={18} />
                  Create Note
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={selected ? 'Edit Note' : 'Create New Note'}
      >
        <NoteForm
          note={selected}
          onSaved={handleNoteSaved}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  )
}
