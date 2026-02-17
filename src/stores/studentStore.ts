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
      return state.students.find((s) => s.id === state.selectedStudentId) || null
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
    getAbsencesByStudentId: (state) => (studentId: string) => {
      return state.absences.filter((a) => a.studentId === studentId)
    },
    totalStudentsCount: (state) => state.students.length,
    studentsWithAbsencesCount: (state) => {
      const studentsWithAbsences = new Set(state.absences.map((a) => a.studentId))
      return studentsWithAbsences.size
    },
    totalAbsencesCount: (state) => state.absences.length,
    isStudentSelected: (state) => state.selectedStudentId !== null,
  },

  actions: {
    loadData() {
      const { students, absences } = repository.load()
      this.students = students
      this.absences = absences
      this.selectedStudentId = null // Reset selection on load
    },

    saveData() {
      repository.save(this.students, this.absences)
    },

    addStudent(student: Omit<Student, 'creationTime'>) {
      if (this.students.some((s) => s.id === student.id)) {
        throw new Error(`Student ID ${student.id} already exists!`)
      }
      const newStudent: Student = { ...student, creationTime: new Date().toLocaleString() }
      this.students.push(newStudent)
      this.saveData()
    },

    editStudent(originalStudentId: string, updatedStudent: Omit<Student, 'creationTime'>) {
      const index = this.students.findIndex((s) => s.id === originalStudentId)
      if (index !== -1) {
        // Check if the new ID conflicts with another student (unless it's the same student)
        if (
          updatedStudent.id !== originalStudentId &&
          this.students.some((s) => s.id === updatedStudent.id)
        ) {
          throw new Error(`Student ID ${updatedStudent.id} already exists!`)
        }
        this.students[index] = { ...this.students[index], ...updatedStudent }
        // If student ID changed, update related absence records
        if (originalStudentId !== updatedStudent.id) {
          this.absences.forEach((absence) => {
            if (absence.studentId === originalStudentId) {
              absence.studentId = updatedStudent.id
            }
          })
        }
        this.saveData()
        // If the edited student was selected, keep it selected with the new ID
        if (this.selectedStudentId === originalStudentId) {
          this.selectedStudentId = updatedStudent.id
        }
      }
    },

    deleteStudent(studentId: string) {
      this.students = this.students.filter((s) => s.id !== studentId)
      this.absences = this.absences.filter((a) => a.studentId !== studentId)
      this.saveData()
      if (this.selectedStudentId === studentId) {
        this.selectedStudentId = null
      }
    },

    registerAbsence(studentId: string, homework: string, reason: string) {
      const newAbsence: Absence = {
        studentId,
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
