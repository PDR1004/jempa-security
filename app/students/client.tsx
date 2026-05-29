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
    <main className="flex flex-col flex-1 items-center mc-bg-cave h-full w-full overflow-hidden">
      <div className="flex flex-col w-full max-w-4xl flex-1 mc-panel-dark border-x-4 border-[#373737] overflow-hidden">
        <div className="p-6 border-b-4 border-[#1a1a1a] flex justify-between items-center mc-header">
          <div>
            <h2 className="mc-font-sm text-white">
              Listado de Estudiantes
            </h2>
            <p className="text-lg text-white/70 mt-2">
              Esta es la lista de estudiantes actualmente en el sistema.
            </p>
          </div>
          <img src="/mc-grass-block.svg" alt="" className="h-10 w-10 hidden sm:block" aria-hidden="true" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-white/70 gap-3">
              <div className="flex gap-1">
                <div className="mc-loading-dot" />
                <div className="mc-loading-dot" />
                <div className="mc-loading-dot" />
              </div>
              Cargando estudiantes...
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/70 text-xl">
              No se encontraron estudiantes.
            </div>
          ) : (
            <ul className="divide-y-4 divide-[#373737]">
              {students.map((student: Student) => (
                <li key={student.id} className="p-4 sm:p-6 hover:bg-[rgba(93,140,57,0.1)] transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 h-12 w-12 mc-slot flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">{student.name}</p>
                        <p className="text-lg text-white/60">{student.email}</p>
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
                           className="mc-btn text-[0.4rem] px-3 py-2"
                         >
                           Editar
                         </button>
                       )}
                       {canDelete && (
                         <button 
                           onClick={() => handleDelete(student)}
                           className="mc-btn mc-btn-red text-[0.4rem] px-3 py-2"
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

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="mc-panel w-full max-w-md overflow-hidden">
            <div className="p-6 border-b-4 border-[#555555] bg-[#8b8b8b]">
              <h3 className="mc-font-sm text-[#1a1a1a]">Editar Estudiante</h3>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block mc-font-sm text-[0.4rem] text-[#555555] mb-2">Nombre</label>
                <input 
                  type="text" 
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="mc-input w-full"
                />
              </div>
              <div>
                <label className="block mc-font-sm text-[0.4rem] text-[#555555] mb-2">Email</label>
                <input 
                  type="email" 
                  value={editingStudent.email}
                  onChange={e => setEditingStudent({...editingStudent, email: e.target.value})}
                  className="mc-input w-full"
                />
              </div>
              <div>
                <label className="block mc-font-sm text-[0.4rem] text-[#555555] mb-2">DNI</label>
                <input 
                  type="text" 
                  value={editingStudent.dni ?? ''}
                  onChange={e => setEditingStudent({...editingStudent, dni: e.target.value})}
                  className="mc-input w-full"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="active"
                  checked={editingStudent.active}
                  onChange={e => setEditingStudent({...editingStudent, active: e.target.checked})}
                  className="h-5 w-5 accent-[#5cb85c]"
                />
                <label htmlFor="active" className="text-lg text-[#333333]">Usuario Activo</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 mc-btn"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={`flex-1 mc-btn mc-btn-green ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
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
