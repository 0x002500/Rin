<script setup lang="ts">
import type { Absence } from '../../stores/studentStore'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  absenceRecords: {
    type: Array as () => Absence[],
    required: true,
  },
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}
</script>

<template>
  <div v-if="isVisible" class="modal" @click="handleOverlayClick">
    <div class="modal-content" style="max-width: 700px">
      <div class="modal-header">
        <h3>
          作业记录 - <span>{{ studentName }}</span>
        </h3>
        <span class="close-button" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <table class="student-table" style="width: 100%">
          <thead>
            <tr>
              <th>作业名称</th>
              <th>缺交日期</th>
              <th>缺交原因</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="absenceRecords.length > 0">
              <tr v-for="record in absenceRecords" :key="record.homework + record.date">
                <td>{{ record.homework }}</td>
                <td>{{ record.date }}</td>
                <td>{{ record.reason || '无' }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="3" style="text-align: center; color: var(--color-text-placeholder)">
                  该学生没有缺交记录。
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="confirm-button" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--color-background-light);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.modal-footer button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 500;
}

.modal-footer .confirm-button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.modal-footer .confirm-button:hover {
  background-color: var(--color-primary-dark);
}

.close-button {
  color: var(--color-text-light);
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: var(--color-text-dark);
}

/* Specific styles for the table within the modal */
.student-table {
  width: 100%;
  border-collapse: collapse;
}

.student-table th,
.student-table td {
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.student-table th {
  background-color: var(--color-background-lightest-gray);
  font-weight: 500;
  color: var(--color-text-medium);
  position: sticky;
  top: 0;
}
</style>
