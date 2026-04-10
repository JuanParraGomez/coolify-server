import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const PRIORITY_OPTIONS = [
  { value: 'high', label: '🔴 Alta' },
  { value: 'medium', label: '🟡 Media' },
  { value: 'low', label: '🟢 Baja' },
]

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in-progress', label: 'En progreso' },
  { value: 'done', label: 'Completada' },
]

export default function TaskForm({ initial, onSave, onDelete, onClose }) {
  const { state } = useApp()
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    priority: initial?.priority ?? 'medium',
    status: initial?.status ?? 'pending',
    dueDate: initial?.dueDate ?? '',
    createdBy: initial?.createdBy ?? state.currentUser,
  })

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
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
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded bg-gray-200 mx-auto mb-5" />

        <h2 className="text-lg font-bold text-gray-900 mb-5">
          {initial?.id ? 'Editar tarea' : 'Nueva tarea'}
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Título *
          </label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition"
            placeholder="¿Qué hay que hacer?"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Descripción
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition resize-none"
            placeholder="Detalles o contexto..."
            rows={3}
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Prioridad
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('priority', opt.value)}
                className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                  form.priority === opt.value
                    ? 'border-juan bg-juan bg-opacity-10 text-juan'
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status (only when editing) */}
        {initial?.id && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Estado
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('status', opt.value)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                    form.status === opt.value
                      ? 'border-juan bg-juan bg-opacity-10 text-juan'
                      : 'border-gray-100 bg-gray-50 text-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Due date */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Fecha límite
          </label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 focus:border-juan focus:bg-white outline-none transition"
            value={form.dueDate}
            onChange={e => set('dueDate', e.target.value)}
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
