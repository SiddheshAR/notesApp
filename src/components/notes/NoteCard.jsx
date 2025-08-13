'use client'

import { format } from 'date-fns'

export default function NoteCard({ note, onSelect }) {
  const handleClick = () => {
    console.log('Note clicked:', note.id)
    onSelect(note.id)
  }

  return (
    <div
      className="group cursor-pointer bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
      onClick={handleClick}
    >
      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors duration-200 mb-3 line-clamp-2">
        {note.title}
      </h3>
      
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 min-h-[4rem]">
        {note.content || (
          <span className="text-gray-400 italic">No content</span>
        )}
      </p>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {format(new Date(note.updatedAt), 'MMM d, yyyy')}
        </span>
        <span className="text-xs text-gray-400">
          {format(new Date(note.updatedAt), 'h:mm a')}
        </span>
      </div>

      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  )
}
