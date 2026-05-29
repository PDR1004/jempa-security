'use client'

import { useState } from 'react'
import { Student } from '@/app/store/students'

interface StudentDetailEditorProps {
  student: Student
  onSave: (id: number, detail: string) => Promise<void>
}

export function StudentDetailEditor({ student, onSave }: StudentDetailEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(student.detail ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(student.id, value)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setValue(student.detail ?? '')
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="mt-2 space-y-2">
        <textarea
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={3}
          placeholder="Escribí un detalle sobre el estudiante..."
          className="w-full mc-input resize-none"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="mc-btn mc-btn-green text-[0.45rem] disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="mc-btn text-[0.45rem] disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2 group/detail flex items-start gap-2">
      {student.detail ? (
        <p className="flex-1 text-lg text-[#cccccc] leading-relaxed">
          {student.detail}
        </p>
      ) : (
        <p className="flex-1 text-lg text-[#777777] italic">
          Sin detalle
        </p>
      )}
      <button
        onClick={() => setEditing(true)}
        title="Editar detalle"
        className="flex-shrink-0 opacity-0 group-hover/detail:opacity-100 focus:opacity-100 mc-btn text-[0.4rem] px-2 py-1"
      >
        ✏
      </button>
    </div>
  )
}
