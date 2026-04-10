import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const OWNER_OPTIONS = [
  { value: 'juan', label: 'Juan' },
  { value: 'asistente', label: 'Asistente' },
]

const TYPE_OPTIONS = [
  { value: 'meeting', label: '🤝 Reunión' },
  { value: 'reminder', label: '🔔 Recordatorio' },
  { value: 'task', label: '✅ Tarea' },
  { value: 'other', label: '📌 Otro' },
]

export default function EventForm({ initial, onSave, onDelete, onClose }) {
  const { state } = useApp()
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    date: initial?.date ?? '',
    time: initial?.time ?? '',
    endTime: initial?.endTime ?? '',
    type: initial?.type ?? 'meeting',
    createdBy: initial?.createdBy ?? state.currentUser,
    notes: initial?.notes ?? '',
  })

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    onSave(form)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <form
        className="bg-white w-full max-w-2xl rounded-t-2xl p-6 overflow-y-auto"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded bg-gray-200 mx-auto mb-5" />

        <h2 className="text-lg font-bold text-gray-900 mb-5">
          {initial?.id ? 'Editar evento' : 'Nuevo evento'}
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Título *
          </label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition"
            placeholder="¿Qué es este evento?"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            autoFocus
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="col-span-3 sm:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Fecha *
            </label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition"
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Inicio
            </label>
            <input
              type="time"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition"
              value={form.time}
              onChange={e => set('time', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Fin
            </label>
            <input
              type="time"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition"
              value={form.endTime}
              onChange={e => set('endTime', e.target.value)}
            />
          </div>
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Tipo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('type', opt.value)}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-colors ${
                  form.type === opt.value
                    ? 'border-juan bg-juan bg-opacity-10 text-juan'
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Owner */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Creado por
          </label>
          <div className="grid grid-cols-2 gap-2">
            {OWNER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('createdBy', opt.value)}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-colors ${
                  form.createdBy === opt.value
                    ? opt.value === 'juan'
                      ? 'border-juan bg-juan bg-opacity-10 text-juan'
                      : 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Notas
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition resize-none"
            placeholder="Detalles adicionales..."
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-5 py-3 rounded-xl font-semibold text-red-600 bg-red-50 active:bg-red-100 transition-colors"
            >
              Eliminar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 active:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl font-semibold text-white active:opacity-80 transition-opacity"
            style={{ background: '#4F46E5' }}
          >
            {initial?.id ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}
