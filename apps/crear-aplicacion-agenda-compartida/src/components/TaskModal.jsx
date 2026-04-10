import React, { useState, useEffect } from 'react'

const EMPTY = { title: '', description: '', dueDate: '', priority: 'medium', status: 'pending' }

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    setForm(task ? {
      title: task.title ?? '',
      description: task.description ?? '',
      dueDate: task.dueDate ?? '',
      priority: task.priority ?? 'medium',
      status: task.status ?? 'pending',
    } : EMPTY)
  }, [task])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
    onClose()
  }

  const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'var(--muted)' },
    { value: 'in-progress', label: 'En progreso', color: '#3B82F6' },
    { value: 'done', label: 'Completado', color: 'var(--success)' },
  ]

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-handle" />
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          {task ? 'Editar pendiente' : 'Nuevo pendiente'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Título *</label>
            <input
              placeholder="¿Qué hay que hacer?"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
            />
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea
              placeholder="Detalles opcionales..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Vencimiento</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Prioridad</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>

          {task && (
            <div className="field">
              <label>Estado</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {statusOptions.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, status: s.value }))}
                    style={{
                      flex: 1,
                      minHeight: 38,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      background: form.status === s.value ? s.color : 'var(--bg)',
                      color: form.status === s.value ? '#fff' : 'var(--muted)',
                      border: `1.5px solid ${form.status === s.value ? s.color : 'var(--border)'}`,
                      transition: 'all .15s',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar</button>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1, background: 'var(--bg)' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
