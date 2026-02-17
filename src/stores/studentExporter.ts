import type { RepoStudent, RepoAbsence } from './studentRepository'

export function buildExportCsv(students: RepoStudent[], absences: RepoAbsence[]): string {
  if (students.length === 0) {
    throw new Error('No student data to export.')
  }

  let csvContent = 'data:text/csv;charset=utf-8,\uFEFF' // Add UTF-8 BOM

  // Student data
  csvContent += '学生数据\n'
  csvContent += '姓名,学号,班级,创建时间\n'
  students.forEach((student) => {
    const row = `${student.name},${student.id},${student.class},${student.creationTime}`
    csvContent += row + '\n'
  })

  // Absence records
  csvContent += '\n\n缺交记录\n'
  csvContent += '学生姓名,学号,作业名称,缺交日期,缺交原因\n'
  absences.forEach((absence) => {
    const student = students.find((s) => s.id === absence.studentId)
    const studentName = student ? student.name : '未知'
    const row = `${studentName},${absence.studentId},${absence.homework},${absence.date},${absence.reason || '无'}`
    csvContent += row + '\n'
  })

  return csvContent
}
