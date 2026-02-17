<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from './stores/studentStore'
import type { Student } from './stores/studentStore'

// Import Components
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import StudentListSection from './components/StudentListSection.vue'
import AppFooter from './components/AppFooter.vue'

// Import Modals
import InfoModal from './components/modals/InfoModal.vue'
import AddEditStudentModal from './components/modals/AddEditStudentModal.vue'
import DeleteConfirmModal from './components/modals/DeleteConfirmModal.vue'
import RegisterAbsenceModal from './components/modals/RegisterAbsenceModal.vue'
import ViewRecordModal from './components/modals/ViewRecordModal.vue'
import StatsModal from './components/modals/StatsModal.vue'

const studentStore = useStudentStore()

// Modal visibility states
const isInfoModalVisible = ref(false)
const infoModalTitle = ref('')
const infoModalMessage = ref('')

const isAddEditModalVisible = ref(false)
const addEditModalMode = ref<'add' | 'edit'>('add')

const isDeleteModalVisible = ref(false)
const isRegisterAbsenceModalVisible = ref(false)
const isViewRecordModalVisible = ref(false)
const isStatsModalVisible = ref(false)

// Computed properties for selected student and their absences
const currentSelectedStudent = computed(() => studentStore.selectedStudent)
const currentStudentAbsenceRecords = computed(() => {
  if (currentSelectedStudent.value) {
    const key = `${currentSelectedStudent.value.id}@@${currentSelectedStudent.value.class}`
    return studentStore.getAbsencesByStudentKey(key)
  }
  return []
})

// Status message for footer
const statusMessage = computed(() => {
  if (studentStore.selectedStudent) {
    return `已选中学生: ${studentStore.selectedStudent.name}`
  }
  return ''
})

// --- Modal Handlers ---
const showInfoModal = (title: string, message: string) => {
  infoModalTitle.value = title
  infoModalMessage.value = message
  isInfoModalVisible.value = true
}

const closeInfoModal = () => {
  isInfoModalVisible.value = false
}

const closeAddEditModal = () => {
  isAddEditModalVisible.value = false
}

const closeDeleteModal = () => {
  isDeleteModalVisible.value = false
}

const closeRegisterAbsenceModal = () => {
  isRegisterAbsenceModalVisible.value = false
}

const handleAddStudent = () => {
  addEditModalMode.value = 'add'
  isAddEditModalVisible.value = true
}

const handleEditStudent = () => {
  if (!studentStore.isStudentSelected) {
    showInfoModal('错误', '请先选择一个学生！')
    return
  }
  addEditModalMode.value = 'edit'
  isAddEditModalVisible.value = true
}

const handleDeleteStudent = () => {
  if (!studentStore.isStudentSelected) {
    showInfoModal('错误', '请先选择一个学生！')
    return
  }
  isDeleteModalVisible.value = true
}

const handleDeleteConfirm = () => {
  // Always close the modal to avoid it remaining open after deletion
  try {
      if (currentSelectedStudent.value) {
      const key = `${currentSelectedStudent.value.id}@@${currentSelectedStudent.value.class}`
      studentStore.deleteStudent(key)
      showInfoModal('成功', `已删除学生: ${currentSelectedStudent.value.name}`)
    } else {
      // Defensive: if no student selected, show a message
      showInfoModal('错误', '请先选择一个学生！')
    }
  } finally {
    closeDeleteModal()
  }
}

type StudentInput = Omit<Student, 'creationTime'>

const handleAddEditSave = (studentData: StudentInput) => {
  try {
    if (addEditModalMode.value === 'add') {
      studentStore.addStudent(studentData)
      showInfoModal('成功', `已添加学生: ${studentData.name}`)
    } else {
      if (!currentSelectedStudent.value) {
        showInfoModal('错误', '请先选择一个学生！')
        return
      }
      const key = `${currentSelectedStudent.value.id}@@${currentSelectedStudent.value.class}`
      studentStore.editStudent(key, studentData)
      showInfoModal('成功', `已更新学生: ${studentData.name}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    showInfoModal('错误', errorMessage)
  } finally {
    closeAddEditModal()
  }
}

const handleRegisterAbsenceSave = (homework: string, reason: string) => {
  try {
    if (currentSelectedStudent.value) {
      const key = `${currentSelectedStudent.value.id}@@${currentSelectedStudent.value.class}`
      studentStore.registerAbsence(key, homework, reason)
      showInfoModal('成功', `已为 ${currentSelectedStudent.value.name} 登记作业缺交: ${homework}`)
    } else {
      showInfoModal('错误', '请先选择一个学生！')
    }
  } finally {
    closeRegisterAbsenceModal()
  }
}

const handleRegisterAbsence = () => {
  if (!studentStore.isStudentSelected) {
    showInfoModal('错误', '请先选择一个学生！')
    return
  }
  isRegisterAbsenceModalVisible.value = true
}

const handleViewRecord = () => {
  if (!studentStore.isStudentSelected) {
    showInfoModal('错误', '请先选择一个学生！')
    return
  }
  isViewRecordModalVisible.value = true
}

const handleStats = () => {
  isStatsModalVisible.value = true
}

import { downloadDataUri } from './utils/downloadFile'

const handleExportData = () => {
  try {
    const csvContent = studentStore.exportData()
    const encodedUri = encodeURI(csvContent)
    downloadDataUri(encodedUri, '作业缺交数据.csv')
    showInfoModal('导出成功', '学生数据和缺交记录已成功导出为 CSV 文件。')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    showInfoModal('导出失败', errorMessage)
  }
}

// Lifecycle hook to load data on component mount
onMounted(() => {
  studentStore.loadData()
})
</script>

<template>
  <div class="container">
    <AppHeader />

    <div class="main-content">
      <AppSidebar
        :is-student-selected="studentStore.isStudentSelected"
        @add-student="handleAddStudent"
        @edit-student="handleEditStudent"
        @delete-student="handleDeleteStudent"
        @register-absence="handleRegisterAbsence"
        @view-record="handleViewRecord"
        @stats="handleStats"
        @export-data="handleExportData"
      />
      <StudentListSection
        :students="studentStore.filteredStudents"
        :selected-student-id="studentStore.selectedStudentId"
        :search-term="studentStore.searchTerm"
        @select-student="studentStore.setSelectedStudent"
        @update:search-term="studentStore.setSearchTerm"
        @search="studentStore.setSearchTerm"
        @clear-search="studentStore.clearSearch"
      />
    </div>

    <AppFooter :status-message="statusMessage" />

    <!-- Modals -->
    <InfoModal
      :is-visible="isInfoModalVisible"
      :title="infoModalTitle"
      :message="infoModalMessage"
      @close="closeInfoModal"
    />

    <AddEditStudentModal
      :is-visible="isAddEditModalVisible"
      :mode="addEditModalMode"
      :student-to-edit="currentSelectedStudent"
      @save="handleAddEditSave"
      @close="closeAddEditModal"
    />

    <DeleteConfirmModal
      :is-visible="isDeleteModalVisible"
      @confirm="handleDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <RegisterAbsenceModal
      :is-visible="isRegisterAbsenceModalVisible"
      :student-name="currentSelectedStudent?.name || ''"
      @save="handleRegisterAbsenceSave"
      @close="closeRegisterAbsenceModal"
    />

    <ViewRecordModal
      :is-visible="isViewRecordModalVisible"
      :student-name="currentSelectedStudent?.name || ''"
      :absence-records="currentStudentAbsenceRecords"
      @close="isViewRecordModalVisible = false"
    />

    <StatsModal
      :is-visible="isStatsModalVisible"
      :total-students="studentStore.totalStudentsCount"
      :students-with-absences="studentStore.studentsWithAbsencesCount"
      :total-absences="studentStore.totalAbsencesCount"
      @close="isStatsModalVisible = false"
    />
  </div>
</template>

<style scoped>
.container {
  width: 90%;
  max-width: 1200px;
  height: 90vh; /* Use vh for consistent height */
  background-color: var(--color-background-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex: 1;
  padding: var(--spacing-xl);
  gap: var(--spacing-xl);
  overflow: hidden;
}
</style>
