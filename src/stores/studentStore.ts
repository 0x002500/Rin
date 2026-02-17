import { defineStore } from 'pinia'
import type { StudentRepository } from './studentRepository'
import { createDefaultStudentRepository } from './studentRepository'
import { buildExportCsv } from './studentExporter'

export interface Student {
  name: string
  id: string // Student ID, used as unique identifier
  class: string
  creationTime: string
}

export interface Absence {
  studentId: string
  studentClass: string
  date: string
  homework: string
  reason: string
}

interface StudentState {
  students: Student[]
  absences: Absence[]
  selectedStudentId: string | null
  searchTerm: string
}

// Module-level repository instance (DIP: store depends on abstraction)
const repository: StudentRepository = createDefaultStudentRepository()

export const useStudentStore = defineStore('student', {
  state: (): StudentState => ({
    students: [],
    absences: [],
    selectedStudentId: null,
    searchTerm: '',
  }),

  getters: {
    selectedStudent: (state) => {
      if (!state.selectedStudentId) return null
      return (
        state.students.find((s) => `${s.id}@@${s.class}` === state.selectedStudentId) || null
      )
    },
    filteredStudents: (state) => {
      const query = state.searchTerm.toLowerCase()
      if (!query) {
        return state.students
      }
      return state.students.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query) ||
          student.class.toLowerCase().includes(query),
      )
    },
    getAbsencesByStudentKey: (state) => (studentKey: string) => {
      return state.absences.filter((a) => `${a.studentId}@@${a.studentClass}` === studentKey)
    },
    totalStudentsCount: (state) => state.students.length,
    studentsWithAbsencesCount: (state) => {
      const studentsWithAbsences = new Set(
        state.absences.map((a) => `${a.studentId}@@${a.studentClass}`),
      )
      return studentsWithAbsences.size
    },
    totalAbsencesCount: (state) => state.absences.length,
    isStudentSelected: (state) => state.selectedStudentId !== null,
  },

  actions: {
    loadData() {
      const { students, absences } = repository.load()
      this.students = students
      // Normalize absences: ensure each absence has studentClass (for older data)
      this.absences = absences.map((a: any) => {
        if (!a.studentClass) {
          const matched = students.find((s) => s.id === a.studentId)
          return { ...a, studentClass: matched ? matched.class : '' }
        }
        return a
      })
      this.selectedStudentId = null // Reset selection on load
    },

    saveData() {
      repository.save(this.students, this.absences)
    },

    addStudent(student: Omit<Student, 'creationTime'>) {
      if (this.students.some((s) => s.id === student.id && s.class === student.class)) {
        throw new Error(`Student ${student.id} in class ${student.class} already exists!`)
      }
      const newStudent: Student = { ...student, creationTime: new Date().toLocaleString() }
      this.students.push(newStudent)
      this.saveData()
    },

    editStudent(originalStudentKey: string, updatedStudent: Omit<Student, 'creationTime'>) {
      const index = this.students.findIndex(
        (s) => `${s.id}@@${s.class}` === originalStudentKey,
      )
      if (index !== -1) {
        // Check if the new id+class conflicts with another student (unless it's the same student)
        const newKey = `${updatedStudent.id}@@${updatedStudent.class}`
        if (
          newKey !== originalStudentKey &&
          this.students.some((s) => `${s.id}@@${s.class}` === newKey)
        ) {
          throw new Error(`Student ${updatedStudent.id} in class ${updatedStudent.class} already exists!`)
        }
        const old = this.students[index]
        this.students[index] = { ...this.students[index], ...updatedStudent }
        // If student key changed, update related absence records
        if (originalStudentKey !== newKey) {
          this.absences.forEach((absence) => {
            if (`${absence.studentId}@@${absence.studentClass}` === originalStudentKey) {
              absence.studentId = updatedStudent.id
              absence.studentClass = updatedStudent.class
            }
          })
        }
        this.saveData()
        // If the edited student was selected, keep it selected with the new key
        if (this.selectedStudentId === originalStudentKey) {
          this.selectedStudentId = newKey
        }
      }
    },

    deleteStudent(studentKey: string) {
      this.students = this.students.filter((s) => `${s.id}@@${s.class}` !== studentKey)
      this.absences = this.absences.filter(
        (a) => `${a.studentId}@@${a.studentClass}` !== studentKey,
      )
      this.saveData()
      if (this.selectedStudentId === studentKey) {
        this.selectedStudentId = null
      }
    },

    registerAbsence(studentKey: string, homework: string, reason: string) {
      const [studentId, studentClass] = studentKey.split('@@')
      const newAbsence: Absence = {
        studentId,
        studentClass,
        date: new Date().toLocaleString(),
        homework,
        reason,
      }
      this.absences.push(newAbsence)
      this.saveData()
    },

    backupData() {
      repository.backup(this.students, this.absences)
    },

    restoreData() {
      const restored = repository.restore()
      if (restored.students && restored.absences) {
        this.students = restored.students
        this.absences = restored.absences
        this.saveData()
        this.selectedStudentId = null // Reset selection after restore
        return true // Indicate success
      } else {
        return false // Indicate failure
      }
    },

    exportData(): string {
      return buildExportCsv(this.students, this.absences)
    },

    setSelectedStudent(studentId: string | null) {
      this.selectedStudentId = studentId
    },

    setSearchTerm(term: string) {
      this.searchTerm = term
    },

    clearSearch() {
      this.searchTerm = ''
    },
  },
})
