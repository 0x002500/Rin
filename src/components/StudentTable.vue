<script setup lang="ts">
import type { Student } from '../stores/studentStore'

const props = defineProps({
  students: {
    type: Array as () => Student[],
    required: true,
  },
  selectedStudentId: {
    type: String as () => string | null,
    default: null,
  },
})

const emit = defineEmits(['select-student'])

const makeKey = (student: Student) => `${student.id}@@${student.class}`

const handleRowClick = (student: Student) => {
  const key = makeKey(student)
  if (props.selectedStudentId === key) {
    emit('select-student', null) // Deselect if already selected
  } else {
    emit('select-student', key)
  }
}
</script>

<template>
  <table class="student-table">
    <thead>
      <tr>
        <th>姓名</th>
        <th>学号</th>
        <th>班级</th>
        <th>创建时间</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="students.length > 0">
        <tr
          v-for="student in students"
          :key="student.id + '@@' + student.class"
          :class="{ selected: (student.id + '@@' + student.class) === selectedStudentId }"
          @click="handleRowClick(student)"
        >
          <td>{{ student.name }}</td>
          <td>{{ student.id }}</td>
          <td>{{ student.class }}</td>
          <td>{{ student.creationTime }}</td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td colspan="4" style="text-align: center; color: var(--color-text-placeholder)">
            没有找到相关学生数据。
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
.student-table {
  width: 100%;
  border-collapse: collapse;
}

.student-table th,
.student-table td {
  text-align: left;
  padding: var(--spacing-md) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.student-table th {
  background-color: var(--color-background-lightest-gray);
  font-weight: 500;
  color: #4b5563; /* Specific shade of dark gray */
  position: sticky;
  top: 0;
}

.student-table tbody tr {
  cursor: pointer;
}

.student-table tbody tr:hover {
  background-color: #f1f5f9; /* Specific shade of light blue-gray */
}

.student-table tbody tr.selected {
  background-color: var(--color-background-selected) !important;
  border-left: 3px solid var(--color-primary);
}
</style>
