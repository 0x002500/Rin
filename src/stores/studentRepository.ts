export interface RepoStudent {
  name: string
  id: string
  class: string
  creationTime: string
}

export interface RepoAbsence {
  studentId: string
  date: string
  homework: string
  reason: string
}

export interface StudentRepository {
  load(): { students: RepoStudent[]; absences: RepoAbsence[] }
  save(students: RepoStudent[], absences: RepoAbsence[]): void
  backup(students: RepoStudent[], absences: RepoAbsence[]): void
  restore(): { students: RepoStudent[] | null; absences: RepoAbsence[] | null }
}

export class LocalStorageStudentRepository implements StudentRepository {
  private readonly STUDENTS_KEY = 'students'
  private readonly ABSENCES_KEY = 'absences'
  private readonly STUDENTS_BACKUP_KEY = 'students_backup'
  private readonly ABSENCES_BACKUP_KEY = 'absences_backup'

  load() {
    const storedStudents = localStorage.getItem(this.STUDENTS_KEY)
    const storedAbsences = localStorage.getItem(this.ABSENCES_KEY)
    return {
      students: storedStudents ? JSON.parse(storedStudents) : [],
      absences: storedAbsences ? JSON.parse(storedAbsences) : [],
    }
  }

  save(students: RepoStudent[], absences: RepoAbsence[]) {
    localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(students))
    localStorage.setItem(this.ABSENCES_KEY, JSON.stringify(absences))
  }

  backup(students: RepoStudent[], absences: RepoAbsence[]) {
    localStorage.setItem(this.STUDENTS_BACKUP_KEY, JSON.stringify(students))
    localStorage.setItem(this.ABSENCES_BACKUP_KEY, JSON.stringify(absences))
  }

  restore() {
    const backupStudents = localStorage.getItem(this.STUDENTS_BACKUP_KEY)
    const backupAbsences = localStorage.getItem(this.ABSENCES_BACKUP_KEY)
    return {
      students: backupStudents ? JSON.parse(backupStudents) : null,
      absences: backupAbsences ? JSON.parse(backupAbsences) : null,
    }
  }
}

// Module-level repository instance. Export getters/setters so app entry can swap implementations
let repoInstance: StudentRepository = new LocalStorageStudentRepository()

export const createDefaultStudentRepository = (): StudentRepository => {
  return new LocalStorageStudentRepository()
}

export function getStudentRepository(): StudentRepository {
  return repoInstance
}

export function setStudentRepository(repo: StudentRepository): void {
  repoInstance = repo
}
