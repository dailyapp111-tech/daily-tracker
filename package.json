import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { StickyNote, Plus, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const NotesView: React.FC = () => {
  const { notes, addNote, deleteNote } = useStore();
  const [content, setContent] = useState('');
  const [type, setType] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addNote(content, type, selectedDate);
      setContent('');
    }
  };

  // Sort notes by date (newest first)
  const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">Notes & Adjustments</h2>
        <p className="text-sm text-gray-500 mt-1">Keep track of surplus, due, and special instructions.</p>
      </header>

      {/* Add Note Form */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('daily')}
              className={cn(
                "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                type === 'daily' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
              )}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setType('monthly')}
              className={cn(
                "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                type === 'monthly' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
              )}
            >
              Monthly
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Note Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'daily' ? "e.g. Extra milk taken today" : "e.g. Monthly bill settled with ₹50 surplus"}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarIcon size={14} />
              <span>{format(selectedDate, 'dd MMM yyyy')}</span>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-100"
            >
              <Plus size={18} />
              Save Note
            </button>
          </div>
        </form>
      </section>

      {/* Notes List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Notes</h3>
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {sortedNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                        note.type === 'daily' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {note.type}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {format(new Date(note.date), 'EEEE, MMM do')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-300">
              <StickyNote size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm">No notes saved yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
