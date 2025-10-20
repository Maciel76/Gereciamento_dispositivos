<template>
  <div class="employees-page">
    <div class="page-header">
      <div>
        <h1>Colaboradores</h1>
        <p class="page-description">Gerencie colaboradores por departamento</p>
      </div>
    </div>

    <!-- Department Filter -->
    <div class="department-tabs">
      <button
        v-for="dept in departments"
        :key="dept.value"
        :class="['dept-tab', { active: activeDept === dept.value }]"
        @click="activeDept = dept.value"
      >
        {{ dept.label }}
      </button>
    </div>

    <!-- Employees Grid -->
    <div class="employees-grid">
      <BaseCard v-for="employee in filteredEmployees" :key="employee.id" hover>
        <div class="employee-card">
          <div class="employee-avatar">
            {{ getInitials(employee.name) }}
          </div>
          <h3 class="employee-name">{{ employee.name }}</h3>
          <p class="employee-position">{{ employee.position }}</p>
          <div class="employee-info">
            <div class="info-item">
              📞 Ramal: {{ employee.extension }}
            </div>
            <div class="info-item">
              ✉️ {{ employee.email }}
            </div>
            <BaseBadge variant="primary">{{ getDeptLabel(employee.department) }}</BaseBadge>
          </div>
          <BaseButton size="sm" block variant="outline" style="margin-top: 12px;">
            Abrir Chamado
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEmployeesStore } from '../stores/employees'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseBadge from '../components/common/BaseBadge.vue'

const employeesStore = useEmployeesStore()
const activeDept = ref('')

const departments = [
  { value: '', label: 'Todos' },
  ...employeesStore.departments
]

const filteredEmployees = computed(() => {
  if (!activeDept.value) return employeesStore.employees
  return employeesStore.getEmployeesByDepartment(activeDept.value)
})

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getDeptLabel(dept) {
  const found = employeesStore.departments.find(d => d.value === dept)
  return found ? found.label : dept
}
</script>

<style scoped>
.employees-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 8px 0;
}

.page-description {
  color: var(--gray-600);
  margin: 0;
}

.department-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.dept-tab {
  padding: 10px 20px;
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  transition: var(--transition);
}

.dept-tab:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.dept-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.employee-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.employee-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.employee-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0 0 4px 0;
}

.employee-position {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-md) 0;
}

.employee-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: var(--spacing-md);
}

.info-item {
  font-size: var(--font-size-sm);
  color: var(--gray-700);
  padding: 8px;
  background: var(--gray-100);
  border-radius: var(--border-radius-sm);
}
</style>
