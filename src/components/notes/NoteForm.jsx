'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
})

export default function NoteForm({ note, onSaved }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) })

  useEffect(() => { 
    reset(note ? { title: note.title, content: note.content || '' } : { title: '', content: '' }) 
  }, [note, reset])

  const onSubmit = async (data) => {
    const method = note ? 'PUT' : 'POST'
    const url = note ? `/api/notes/${note.id}` : '/api/notes'
    await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    })
    onSaved()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {note ? 'Edit note' : 'New note'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {note ? 'Update your existing note' : 'Create a new note'}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            {...register('title')}
            placeholder="Enter note title..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-medium bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
          />
          {errors.title && (
            <p className="text-red-600 text-sm font-medium mt-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Content
          </label>
          <textarea
            {...register('content')}
            placeholder="Write your content here..."
            rows={8}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none font-mono text-sm leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none min-w-[120px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving…
              </span>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
