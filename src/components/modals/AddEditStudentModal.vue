<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Student } from '../../stores/studentStore'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as () => 'add' | 'edit',
    required: true,
  },
  studentToEdit: {
    type: Object as () => Student | null,
    default: null,
  },
})

const emit = defineEmits(['save', 'close'])

const studentName = ref('')
const studentId = ref('')
const studentClass = ref('')

const modalTitle = computed(() => (props.mode === 'add' ? '添加学生' : '编辑学生'))

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      if (props.mode === 'edit' && props.studentToEdit) {
        studentName.value = props.studentToEdit.name
        studentId.value = props.studentToEdit.id
        studentClass.value = props.studentToEdit.class
      } else {
        // Reset form for add mode or if no studentToEdit for edit mode
        studentName.value = ''
        studentId.value = ''
        studentClass.value = ''
      }
    }
  },
  { immediate: true },
)

const handleSave = () => {
  if (!studentName.value.trim() || !studentId.value.trim() || !studentClass.value.trim()) {
    // This validation will be handled by the parent component (App.vue) via the catch block
    // when the save event is emitted. This allows for centralized error handling.
    emit('save', null) // Emit null or an indicator of invalid data
    return
  }
  emit('save', {
    name: studentName.value.trim(),
    id: studentId.value.trim(),
    class: studentClass.value.trim(),
  })
}

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
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <span class="close-button" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body modal-form">
        <form @submit.prevent="handleSave">
          <label for="student-name">姓名:</label>
          <input type="text" id="student-name" v-model="studentName" required />

          <label for="student-id">学号:</label>
          <input type="text" id="student-id" v-model="studentId" required />

          <label for="student-class">班级:</label>
          <input type="text" id="student-class" v-model="studentClass" required />
        </form>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">取消</button>
        <button class="confirm-button" @click="handleSave">保存</button>
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
  border: 1px solid #888;
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

.modal-form label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.modal-form input,
.modal-form select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-sm);
  box-sizing: border-box;
  margin-bottom: var(--spacing-sm);
}

.modal-form input:focus,
.modal-form select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
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
  color: var(--color-background-light);
}

.modal-footer .confirm-button:hover {
  background-color: var(--color-primary-dark);
}

.modal-footer .cancel-button {
  background-color: #d1d5db;
  color: #374151;
}

.modal-footer .cancel-button:hover {
  background-color: #9ca3af;
}

.close-button {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: black;
}
</style>
