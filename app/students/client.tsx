"use client";

import { useEffect, useState } from "react";
import { useStudents } from "@/app/hooks/useStudents";
import { useStudentsStore, Student } from "@/app/store/students";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/app/lib/auth/permissions";
import { StudentDetailEditor } from "./StudentDetailEditor";
import { DniViewer } from "./DniViewer";

export default function StudentsPageClient() {
  const { fetchStudents, updateStudent, removeStudent } = useStudents();
  const { students } = useStudentsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        await fetchStudents();
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStudents();
  }, [fetchStudents]);

  const canEdit = hasPermission(session?.user?.role, "edit:students");
  const canDelete = hasPermission(session?.user?.role, "delete:students");
  const canViewDni = hasPermission(session?.user?.role, "view:student_dni");

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${student.name}?`)) {
      return;
    }

    try {
      await removeStudent(student.id);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Hubo un error al intentar eliminar al estudiante.");
    }
  };

  const handleSaveStudentDetail = async (id: number, detail: string) => {
    const student = students.find((item) => item.id === id);
    if (!student) {
      return;
    }

    setIsSaving(true);
    try {
      await updateStudent({ ...student, detail });
    } catch (error) {
      console.error("Error saving student detail:", error);
      alert("Hubo un error al guardar el detalle del estudiante.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    setIsSaving(true);
    try {
      await updateStudent(editingStudent);
      setEditingStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-zinc-950 h-full w-full overflow-hidden">
      <div className="flex flex-col w-full max-w-4xl flex-1 bg-white dark:bg-zinc-900/50 shadow-sm border-x border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Listado de Estudiantes
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Esta es la lista de estudiantes actualmente en el sistema.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando estudiantes...
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
              No se encontraron estudiantes.
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {students.map((student: Student) => (
                <li key={student.id} className="p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                        <span className="text-lg font-medium text-zinc-600 dark:text-zinc-300">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{student.name}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{student.email}</p>
                        <div className="mt-3 space-y-3">
                          <StudentDetailEditor student={student} onSave={handleSaveStudentDetail} />
                          {canViewDni && <DniViewer studentId={student.id} />}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       {canEdit && (
                         <button 
                           onClick={() => handleEdit(student)}
                           className="px-3 py-1.5 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md transition-colors"
                         >
                           Editar
                         </button>
                       )}
                       {canDelete && (
                         <button 
                           onClick={() => handleDelete(student)}
                           className="px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-md transition-colors"
                         >
                           Eliminar
                         </button>
                       )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal de Edición Simplificado */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Editar Estudiante</h3>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editingStudent.email}
                  onChange={e => setEditingStudent({...editingStudent, email: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">DNI</label>
                <input 
                  type="text" 
                  value={editingStudent.dni ?? ''}
                  onChange={e => setEditingStudent({...editingStudent, dni: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="active"
                  checked={editingStudent.active}
                  onChange={e => setEditingStudent({...editingStudent, active: e.target.checked})}
                />
                <label htmlFor="active" className="text-sm text-zinc-700 dark:text-zinc-300">Usuario Activo</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isSaving 
                      ? "bg-zinc-400 cursor-not-allowed text-white" 
                      : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  }`}
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
