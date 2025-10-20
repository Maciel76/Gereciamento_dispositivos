<template>
  <div class="employees-page">
    <div class="page-header">
      <div>
        <h1>Colaboradores</h1>
        <p class="page-description">Gerencie colaboradores e seus equipamentos</p>
      </div>
      <BaseButton variant="primary" @click="showAddEmployeeModal = true">
        <Icon icon="mdi:account-plus" class="btn-icon" />
        Novo Colaborador
      </BaseButton>
    </div>

    <!-- Métricas Dashboard -->
    <div class="stats-grid">
      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-alpha); color: var(--primary);">
            <Icon icon="mdi:account-group" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ employeesStore.totalEmployees }}</h3>
            <p class="stat-label">Total de Colaboradores</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--info-light); color: var(--info);">
            <Icon icon="mdi:devices" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ totalAssignedDevices }}</h3>
            <p class="stat-label">Equipamentos Atribuídos</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning-light); color: #856404;">
            <Icon icon="mdi:ticket-outline" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ activeTicketsCount }}</h3>
            <p class="stat-label">Chamados Ativos</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
            <Icon icon="mdi:check-circle" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ resolvedTicketsCount }}</h3>
            <p class="stat-label">Chamados Resolvidos</p>
          </div>
        </div>
      </BaseCard>
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

          <!-- Mini Stats -->
          <div class="employee-stats">
            <div class="stat-item">
              <Icon icon="mdi:devices" width="16" height="16" />
              <span>{{ getEmployeeDevices(employee.id).length }} equipamentos</span>
            </div>
            <div class="stat-item">
              <Icon icon="mdi:ticket" width="16" height="16" />
              <span>{{ getEmployeeTickets(employee.id).length }} chamados</span>
            </div>
          </div>

          <div class="employee-info">
            <div class="info-item">
              <Icon icon="mdi:phone" width="16" height="16" class="info-icon" />
              <span>Ramal: {{ employee.extension }}</span>
            </div>
            <div class="info-item">
              <Icon icon="mdi:phone-classic" width="16" height="16" class="info-icon" />
              <span>{{ employee.phone }}</span>
            </div>
            <div class="info-item">
              <Icon icon="mdi:email" width="16" height="16" class="info-icon" />
              <span>{{ employee.email }}</span>
            </div>
            <div class="info-item">
              <Icon icon="mdi:calendar" width="16" height="16" class="info-icon" />
              <span>Admissão: {{ formatDate(employee.hireDate) }}</span>
            </div>
          </div>

          <BaseBadge variant="primary" style="margin-top: 8px;">
            {{ getDeptLabel(employee.department) }}
          </BaseBadge>

          <!-- Actions -->
          <div class="employee-actions">
            <BaseButton
              size="sm"
              variant="primary"
              @click="openDevicesModal(employee)"
            >
              <Icon icon="mdi:eye" class="btn-icon" />
              Ver Equipamentos
            </BaseButton>
            <BaseButton
              size="sm"
              variant="outline"
              @click="openAssignDeviceModal(employee)"
            >
              <Icon icon="mdi:devices" class="btn-icon" />
              Atribuir
            </BaseButton>
          </div>
          <div class="employee-actions" style="margin-top: 8px;">
            <BaseButton
              size="sm"
              variant="outline"
              @click="openTicketsModal(employee)"
            >
              <Icon icon="mdi:history" class="btn-icon" />
              Ver Chamados
            </BaseButton>
            <BaseButton
              size="sm"
              variant="warning"
              @click="openCreateTicketModal(employee)"
            >
              <Icon icon="mdi:ticket-plus" class="btn-icon" />
              Abrir Chamado
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Modal de Equipamentos -->
    <BaseModal
      v-model:show="showDevicesModal"
      :title="`Equipamentos - ${selectedEmployee?.name}`"
      size="lg"
    >
      <div class="modal-content">
        <div v-if="selectedEmployeeDevices.length === 0" class="empty-state">
          <Icon icon="mdi:devices-off" width="48" height="48" style="color: var(--gray-400);" />
          <p>Nenhum equipamento atribuído</p>
        </div>
        <div v-else class="devices-list">
          <div v-for="device in selectedEmployeeDevices" :key="device.id" class="device-item">
            <div class="device-icon">
              <Icon :icon="getDeviceIcon(device.category)" width="24" height="24" />
            </div>
            <div class="device-details">
              <h4>{{ device.name }}</h4>
              <p>{{ getCategoryLabel(device.category) }} - {{ device.brand }} {{ device.model }}</p>
              <div class="device-meta">
                <span><strong>Serial:</strong> {{ device.serial }}</span>
                <span v-if="device.ip"><strong>IP:</strong> {{ device.ip }}</span>
                <span><strong>Local:</strong> {{ device.location }}</span>
              </div>
            </div>
            <BaseBadge :variant="device.status === 'online' ? 'success' : 'danger'">
              {{ device.status === 'online' ? 'Online' : 'Offline' }}
            </BaseBadge>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Modal de Chamados -->
    <BaseModal
      v-model:show="showTicketsModal"
      :title="`Histórico de Chamados - ${selectedEmployee?.name}`"
      size="lg"
    >
      <div class="modal-content">
        <div v-if="selectedEmployeeTickets.length === 0" class="empty-state">
          <Icon icon="mdi:ticket-outline" width="48" height="48" style="color: var(--gray-400);" />
          <p>Nenhum chamado registrado</p>
        </div>
        <div v-else class="tickets-list">
          <div v-for="ticket in selectedEmployeeTickets" :key="ticket.id" class="ticket-item">
            <div class="ticket-header">
              <div>
                <h4>{{ ticket.title }}</h4>
                <p class="ticket-device">{{ ticket.deviceName }}</p>
              </div>
              <BaseBadge :variant="getStatusVariant(ticket.status)">
                {{ getStatusLabel(ticket.status) }}
              </BaseBadge>
            </div>
            <p class="ticket-description">{{ ticket.description }}</p>
            <div class="ticket-footer">
              <BaseBadge :variant="getPriorityVariant(ticket.priority)" size="sm">
                {{ getPriorityLabel(ticket.priority) }}
              </BaseBadge>
              <span class="ticket-date">{{ formatDateTime(ticket.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Modal para Adicionar Novo Colaborador -->
    <BaseModal
      v-model:show="showAddEmployeeModal"
      title="Novo Colaborador"
      size="lg"
    >
      <form @submit.prevent="handleAddEmployee" class="employee-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Nome Completo *</label>
            <input
              v-model="newEmployee.name"
              type="text"
              class="form-input"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div class="form-group">
            <label>Matrícula *</label>
            <input
              v-model="newEmployee.matricula"
              type="text"
              class="form-input"
              placeholder="Ex: EMP005"
              required
            />
          </div>

          <div class="form-group">
            <label>Departamento/Setor *</label>
            <select v-model="newEmployee.department" class="form-input" required>
              <option value="">Selecione...</option>
              <option v-for="dept in employeesStore.departments" :key="dept.value" :value="dept.value">
                {{ dept.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Cargo/Função *</label>
            <input
              v-model="newEmployee.position"
              type="text"
              class="form-input"
              placeholder="Ex: Operador de Caixa"
              required
            />
          </div>

          <div class="form-group">
            <label>Ramal</label>
            <input
              v-model="newEmployee.extension"
              type="text"
              class="form-input"
              placeholder="Ex: 2005"
            />
          </div>

          <div class="form-group">
            <label>Telefone *</label>
            <input
              v-model="newEmployee.phone"
              type="tel"
              class="form-input"
              placeholder="Ex: (11) 98765-4321"
              required
            />
          </div>

          <div class="form-group full-width">
            <label>Email *</label>
            <input
              v-model="newEmployee.email"
              type="email"
              class="form-input"
              placeholder="Ex: joao.silva@empresa.com.br"
              required
            />
          </div>
        </div>

        <div class="form-actions">
          <BaseButton type="button" variant="outline" @click="showAddEmployeeModal = false">
            Cancelar
          </BaseButton>
          <BaseButton type="submit" variant="primary">
            <Icon icon="mdi:check" class="btn-icon" />
            Adicionar Colaborador
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Modal para Atribuir Equipamentos -->
    <BaseModal
      v-model:show="showAssignDeviceModal"
      :title="`Atribuir Equipamento - ${selectedEmployee?.name}`"
      size="lg"
    >
      <div class="modal-content">
        <!-- Equipamentos já atribuídos -->
        <div v-if="selectedEmployeeDevices.length > 0" class="assigned-devices-section">
          <h4>Equipamentos Atribuídos</h4>
          <div class="devices-list">
            <div v-for="device in selectedEmployeeDevices" :key="device.id" class="device-item">
              <div class="device-icon">
                <Icon :icon="getDeviceIcon(device.category)" width="24" height="24" />
              </div>
              <div class="device-details">
                <h4>{{ device.name }}</h4>
                <p>{{ getCategoryLabel(device.category) }} - {{ device.location }}</p>
              </div>
              <BaseButton
                variant="danger"
                size="sm"
                @click="handleRemoveDevice(device.id)"
              >
                <Icon icon="mdi:close" width="16" height="16" />
                Remover
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Equipamentos disponíveis -->
        <div class="available-devices-section">
          <h4>Equipamentos Disponíveis</h4>
          <div v-if="availableDevices.length === 0" class="empty-state">
            <Icon icon="mdi:devices-off" width="48" height="48" style="color: var(--gray-400);" />
            <p>Todos os equipamentos já estão atribuídos</p>
          </div>
          <div v-else class="devices-list">
            <div v-for="device in availableDevices" :key="device.id" class="device-item">
              <div class="device-icon">
                <Icon :icon="getDeviceIcon(device.category)" width="24" height="24" />
              </div>
              <div class="device-details">
                <h4>{{ device.name }}</h4>
                <p>{{ getCategoryLabel(device.category) }} - {{ device.location }}</p>
              </div>
              <BaseButton
                variant="primary"
                size="sm"
                @click="handleAssignDevice(device.id)"
              >
                <Icon icon="mdi:plus" width="16" height="16" />
                Atribuir
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Modal para Abrir Chamado -->
    <BaseModal
      v-model:show="showOpenTicketModal"
      :title="`Abrir Chamado - ${selectedEmployee?.name}`"
      size="lg"
    >
      <form @submit.prevent="handleOpenTicket" class="ticket-form">
        <div class="form-group">
          <label>Equipamento *</label>
          <select v-model="newTicket.deviceId" class="form-input" required @change="updateDeviceInfo">
            <option value="">Selecione o equipamento...</option>
            <option
              v-for="device in selectedEmployeeDevices"
              :key="device.id"
              :value="device.id"
            >
              {{ device.name }} - {{ device.location }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Categoria *</label>
          <select v-model="newTicket.category" class="form-input" required>
            <option value="">Selecione...</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="rede">Rede</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div class="form-group">
          <label>Prioridade *</label>
          <select v-model="newTicket.priority" class="form-input" required>
            <option value="">Selecione...</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        <div class="form-group full-width">
          <label>Título *</label>
          <input
            v-model="newTicket.title"
            type="text"
            class="form-input"
            placeholder="Descreva o problema brevemente"
            required
          />
        </div>

        <div class="form-group full-width">
          <label>Descrição *</label>
          <textarea
            v-model="newTicket.description"
            class="form-input"
            rows="4"
            placeholder="Descreva o problema em detalhes..."
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <BaseButton type="button" variant="outline" @click="showOpenTicketModal = false">
            Cancelar
          </BaseButton>
          <BaseButton type="submit" variant="primary">
            <Icon icon="mdi:ticket-plus" class="btn-icon" />
            Abrir Chamado
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEmployeesStore } from '../stores/employees'
import { useDevicesStore } from '../stores/devices'
import { useTicketsStore } from '../stores/tickets'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseModal from '../components/common/BaseModal.vue'
import { Icon } from '@iconify/vue'

const employeesStore = useEmployeesStore()
const devicesStore = useDevicesStore()
const ticketsStore = useTicketsStore()

const activeDept = ref('')
const showDevicesModal = ref(false)
const showTicketsModal = ref(false)
const showAddEmployeeModal = ref(false)
const showAssignDeviceModal = ref(false)
const showOpenTicketModal = ref(false)
const selectedEmployee = ref(null)

// Form data
const newEmployee = ref({
  name: '',
  matricula: '',
  department: '',
  position: '',
  extension: '',
  phone: '',
  email: ''
})

const newTicket = ref({
  deviceId: '',
  deviceName: '',
  category: '',
  priority: '',
  title: '',
  description: ''
})

const departments = [
  { value: '', label: 'Todos' },
  ...employeesStore.departments
]

// Computed - Dashboard Metrics
const totalAssignedDevices = computed(() => {
  return employeesStore.employees.reduce((total, emp) => {
    return total + (emp.assignedDevices?.length || 0)
  }, 0)
})

const activeTicketsCount = computed(() => {
  return ticketsStore.tickets.filter(t =>
    t.status === 'aberto' || t.status === 'em_andamento'
  ).length
})

const resolvedTicketsCount = computed(() => {
  return ticketsStore.tickets.filter(t => t.status === 'resolvido').length
})

// Computed - Filtered Employees
const filteredEmployees = computed(() => {
  if (!activeDept.value) return employeesStore.employees
  return employeesStore.getEmployeesByDepartment(activeDept.value)
})

// Computed - Selected Employee Data
const selectedEmployeeDevices = computed(() => {
  if (!selectedEmployee.value) return []
  return getEmployeeDevices(selectedEmployee.value.id)
})

const selectedEmployeeTickets = computed(() => {
  if (!selectedEmployee.value) return []
  return getEmployeeTickets(selectedEmployee.value.id)
})

const availableDevices = computed(() => {
  if (!selectedEmployee.value) return []

  const assignedIds = selectedEmployee.value.assignedDevices || []
  return devicesStore.devices.filter(d => !assignedIds.includes(d.id))
})

// Functions - Get Employee Related Data
function getEmployeeDevices(employeeId) {
  const employee = employeesStore.employees.find(e => e.id === employeeId)
  if (!employee || !employee.assignedDevices) return []

  return devicesStore.devices.filter(d =>
    employee.assignedDevices.includes(d.id)
  )
}

function getEmployeeTickets(employeeId) {
  const employee = employeesStore.employees.find(e => e.id === employeeId)
  if (!employee) return []

  const employeeDevices = getEmployeeDevices(employeeId)
  const deviceNames = employeeDevices.map(d => d.name)

  return ticketsStore.tickets.filter(t =>
    deviceNames.includes(t.deviceName)
  )
}

// Functions - Modal Actions
function openDevicesModal(employee) {
  selectedEmployee.value = employee
  showDevicesModal.value = true
}

function openTicketsModal(employee) {
  selectedEmployee.value = employee
  showTicketsModal.value = true
}

function openAssignDeviceModal(employee) {
  selectedEmployee.value = employee
  showAssignDeviceModal.value = true
}

function openCreateTicketModal(employee) {
  selectedEmployee.value = employee
  // Reset form
  newTicket.value = {
    deviceId: '',
    deviceName: '',
    category: '',
    priority: '',
    title: '',
    description: ''
  }
  showOpenTicketModal.value = true
}

// Functions - Form Handlers
function handleAddEmployee() {
  employeesStore.addEmployee(newEmployee.value)

  // Reset form
  newEmployee.value = {
    name: '',
    matricula: '',
    department: '',
    position: '',
    extension: '',
    phone: '',
    email: ''
  }

  showAddEmployeeModal.value = false
}

function handleAssignDevice(deviceId) {
  if (selectedEmployee.value) {
    employeesStore.assignDevice(selectedEmployee.value.id, deviceId)
  }
}

function handleRemoveDevice(deviceId) {
  if (selectedEmployee.value) {
    if (confirm('Deseja realmente remover este equipamento do colaborador?')) {
      employeesStore.removeDevice(selectedEmployee.value.id, deviceId)
    }
  }
}

function updateDeviceInfo() {
  if (newTicket.value.deviceId) {
    const device = devicesStore.devices.find(d => d.id === parseInt(newTicket.value.deviceId))
    if (device) {
      newTicket.value.deviceName = device.name
    }
  }
}

function handleOpenTicket() {
  const device = devicesStore.devices.find(d => d.id === parseInt(newTicket.value.deviceId))

  if (device) {
    ticketsStore.addTicket({
      deviceId: device.id,
      deviceName: device.name,
      category: newTicket.value.category,
      priority: newTicket.value.priority,
      title: newTicket.value.title,
      description: newTicket.value.description,
      solution: null
    })

    // Reset form
    newTicket.value = {
      deviceId: '',
      deviceName: '',
      category: '',
      priority: '',
      title: '',
      description: ''
    }

    showOpenTicketModal.value = false
  }
}

// Functions - Helpers
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

function getCategoryLabel(category) {
  const labels = {
    pdv: 'PDV',
    balanca: 'Balança',
    coletor: 'Coletor',
    impressora: 'Impressora',
    computador: 'Computador',
    outros: 'Outros'
  }
  return labels[category] || category
}

function getDeviceIcon(category) {
  const icons = {
    pdv: 'mdi:desktop-classic',
    balanca: 'mdi:scale',
    coletor: 'mdi:barcode-scan',
    impressora: 'mdi:printer',
    computador: 'mdi:laptop',
    outros: 'mdi:devices'
  }
  return icons[category] || 'mdi:devices'
}

function getStatusVariant(status) {
  const variants = {
    'aberto': 'danger',
    'em_andamento': 'warning',
    'resolvido': 'success',
    'encerrado': 'info',
    'cancelado': 'light'
  }
  return variants[status] || 'light'
}

function getStatusLabel(status) {
  const labels = {
    'aberto': 'Aberto',
    'em_andamento': 'Em Andamento',
    'resolvido': 'Resolvido',
    'encerrado': 'Encerrado',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}

function getPriorityVariant(priority) {
  const variants = {
    'critica': 'danger',
    'alta': 'warning',
    'media': 'info',
    'baixa': 'light'
  }
  return variants[priority] || 'light'
}

function getPriorityLabel(priority) {
  const labels = {
    'critica': 'Crítica',
    'alta': 'Alta',
    'media': 'Média',
    'baixa': 'Baixa'
  }
  return labels[priority] || priority
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

function formatDateTime(date) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.employees-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-lg);
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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0;
  line-height: 1;
}

.stat-label {
  margin: 4px 0 0 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

/* Department Tabs */
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

/* Employees Grid */
.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

/* Employee Stats */
.employee-stats {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  width: 100%;
  justify-content: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  background: var(--gray-100);
  padding: 6px 12px;
  border-radius: var(--border-radius-sm);
}

/* Employee Info */
.employee-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--spacing-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-xs);
  color: var(--gray-700);
  padding: 6px 8px;
  background: var(--gray-50);
  border-radius: var(--border-radius-sm);
  text-align: left;
}

.info-icon {
  color: var(--primary);
  flex-shrink: 0;
}

/* Employee Actions */
.employee-actions {
  display: flex;
  gap: var(--spacing-sm);
  width: 100%;
  margin-top: var(--spacing-md);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Modal Content */
.modal-content {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--gray-600);
}

.empty-state p {
  margin: var(--spacing-md) 0 0 0;
  font-size: var(--font-size-base);
}

/* Devices List */
.devices-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.device-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--gray-50);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.device-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius);
  background: var(--primary-alpha);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.device-details {
  flex: 1;
}

.device-details h4 {
  margin: 0 0 4px 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.device-details p {
  margin: 0 0 8px 0;
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.device-meta {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.device-meta span {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

/* Tickets List */
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ticket-item {
  padding: var(--spacing-md);
  background: var(--gray-50);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
  gap: var(--spacing-md);
}

.ticket-header h4 {
  margin: 0 0 4px 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.ticket-device {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

.ticket-description {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
  color: var(--gray-700);
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-date {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

/* Forms */
.employee-form,
.ticket-form {
  padding: var(--spacing-md);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.form-input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.form-input::placeholder {
  color: var(--gray-400);
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

/* Device Assignment Sections */
.assigned-devices-section,
.available-devices-section {
  margin-bottom: var(--spacing-lg);
}

.assigned-devices-section h4,
.available-devices-section h4 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.assigned-devices-section {
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .employees-grid {
    grid-template-columns: 1fr;
  }

  .employee-stats {
    flex-direction: column;
  }

  .employee-actions {
    flex-direction: column;
  }

  .device-item {
    flex-direction: column;
    text-align: center;
  }

  .device-meta {
    justify-content: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: 1;
  }
}
</style>
