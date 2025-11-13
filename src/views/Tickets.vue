<template>
  <div class="tickets-page">
    <div class="page-header">
      <div>
        <h1>Chamados Técnicos</h1>
        <p class="page-description">Gerencie chamados de suporte e manutenção</p>
      </div>
      <BaseButton @click="openAddModal">
        <Icon icon="mdi:plus-circle" class="btn-icon" /> Novo Chamado
      </BaseButton>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <BaseCard hover @click="filterByStatus('aberto')" class="clickable-card">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--danger-light); color: var(--danger);">
            <Icon icon="mdi:ticket-outline" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.openTickets }}</h3>
            <p class="stat-label">Abertos</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover @click="filterByStatus('em_andamento')" class="clickable-card">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning-light); color: #856404;">
            <Icon icon="mdi:progress-clock" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.inProgressTickets }}</h3>
            <p class="stat-label">Em Andamento</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover @click="filterByStatus('resolvido')" class="clickable-card">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
            <Icon icon="mdi:check-circle" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.resolvedTickets }}</h3>
            <p class="stat-label">Resolvidos</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover @click="filterByStatus('encerrado')" class="clickable-card">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--info-light); color: var(--info);">
            <Icon icon="mdi:archive" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.closedTickets }}</h3>
            <p class="stat-label">Encerrados</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover @click="filterByStatus('cancelado')" class="clickable-card">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--gray-200); color: var(--gray-700);">
            <Icon icon="mdi:close-circle" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.canceledTickets }}</h3>
            <p class="stat-label">Cancelados</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Filtros -->
    <BaseCard>
      <div class="filters">
        <div class="filter-group">
          <label>Filtrar por Status</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="">Todos os Status</option>
            <option value="aberto">Abertos</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="resolvido">Resolvidos</option>
            <option value="encerrado">Encerrados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Filtrar por Prioridade</label>
          <select v-model="priorityFilter" class="filter-select">
            <option value="">Todas as Prioridades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Filtrar por Categoria</label>
          <select v-model="categoryFilter" class="filter-select">
            <option value="">Todas as Categorias</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="rede">Rede</option>
          </select>
        </div>

        <div class="filter-actions">
          <BaseButton variant="outline" size="sm" @click="clearFilters">
            <Icon icon="mdi:filter-off" class="btn-icon" /> Limpar Filtros
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab', { active: activeTab === tab.value }]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <BaseBadge v-if="tab.count" variant="light">{{ tab.count }}</BaseBadge>
      </button>
    </div>

    <!-- Tickets List -->
    <div class="tickets-list">
      <BaseCard v-for="ticket in filteredTickets" :key="ticket.id" hover>
        <div class="ticket-card">
          <div class="ticket-header">
            <div class="ticket-id">#{{ ticket.id }}</div>
            <BaseBadge :variant="getStatusVariant(ticket.status)">
              {{ getStatusLabel(ticket.status) }}
            </BaseBadge>
          </div>

          <h3 class="ticket-title">{{ ticket.title }}</h3>
          <p class="ticket-description">{{ ticket.description }}</p>

          <div class="ticket-meta">
            <div class="meta-item">
              <span class="meta-label">Dispositivo:</span>
              <strong>{{ ticket.deviceName }}</strong>
            </div>
            <div class="meta-item">
              <span class="meta-label">Categoria:</span>
              <BaseBadge variant="light">{{ ticket.category }}</BaseBadge>
            </div>
            <div class="meta-item">
              <span class="meta-label">Prioridade:</span>
              <BaseBadge :variant="getPriorityVariant(ticket.priority)">
                {{ ticket.priority }}
              </BaseBadge>
            </div>
            <div class="meta-item">
              <span class="meta-label">Criado:</span>
              <span>{{ formatDate(ticket.createdAt) }}</span>
            </div>
          </div>

          <div v-if="ticket.solution" class="ticket-solution">
            <strong>Solução:</strong> {{ ticket.solution }}
          </div>

          <div class="ticket-actions">
            <BaseButton size="sm" variant="outline" @click="editTicket(ticket)">
              ✏️ Editar
            </BaseButton>

            <!-- Botões de mudança de status -->
            <BaseButton
              v-if="ticket.status === 'aberto'"
              size="sm"
              variant="warning"
              @click="changeStatus(ticket, 'em_andamento')"
            >
              ⚙️ Iniciar Atendimento
            </BaseButton>

            <BaseButton
              v-if="ticket.status === 'em_andamento'"
              size="sm"
              variant="success"
              @click="resolveTicket(ticket)"
            >
              ✅ Resolver
            </BaseButton>

            <BaseButton
              v-if="ticket.status === 'aberto'"
              size="sm"
              variant="success"
              @click="resolveTicket(ticket)"
            >
              ✅ Resolver
            </BaseButton>

            <BaseButton
              v-if="ticket.status === 'em_andamento' || ticket.status === 'resolvido'"
              size="sm"
              variant="danger"
              @click="changeStatus(ticket, 'aberto')"
            >
              🔄 Reabrir
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editingTicket ? 'Editar Chamado' : 'Novo Chamado'"
      size="md"
    >
      <form @submit.prevent="saveTicket">
        <div class="form-group">
          <label>Dispositivo *</label>
          <select v-model="formData.deviceId" class="form-input" required>
            <option value="">Selecione...</option>
            <option v-for="device in devicesStore.devices" :key="device.id" :value="device.id">
              {{ device.name }} - {{ device.location }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Título *</label>
          <input
            v-model="formData.title"
            type="text"
            class="form-input"
            placeholder="Descreva o problema"
            required
          />
        </div>

        <div class="form-group">
          <label>Descrição *</label>
          <textarea
            v-model="formData.description"
            class="form-input"
            rows="4"
            placeholder="Detalhes do problema..."
            required
          ></textarea>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Categoria *</label>
            <select v-model="formData.category" class="form-input" required>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="rede">Rede</option>
            </select>
          </div>

          <div class="form-group">
            <label>Prioridade *</label>
            <select v-model="formData.priority" class="form-input" required>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>

        <div v-if="editingTicket" class="form-group">
          <label>Status *</label>
          <select v-model="formData.status" class="form-input" required>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="resolvido">Resolvido</option>
            <option value="encerrado">Encerrado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div v-if="editingTicket" class="form-group">
          <label>Solução</label>
          <textarea
            v-model="formData.solution"
            class="form-input"
            rows="3"
            placeholder="Descreva a solução aplicada..."
          ></textarea>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="outline" @click="closeModal">Cancelar</BaseButton>
        <BaseButton @click="saveTicket">Salvar</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTicketsStore } from '../stores/tickets'
import { useDevicesStore } from '../stores/devices'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseModal from '../components/common/BaseModal.vue'
import { Icon } from '@iconify/vue'

const ticketsStore = useTicketsStore()
const devicesStore = useDevicesStore()

const showModal = ref(false)
const editingTicket = ref(null)
const activeTab = ref('todos')
const statusFilter = ref('')
const priorityFilter = ref('')
const categoryFilter = ref('')

const formData = ref({
  deviceId: '',
  deviceName: '',
  title: '',
  description: '',
  category: 'hardware',
  priority: 'media',
  solution: ''
})

const tabs = computed(() => [
  { label: 'Todos', value: 'todos', count: ticketsStore.totalTickets },
  { label: 'Abertos', value: 'aberto', count: ticketsStore.openTickets },
  { label: 'Em Andamento', value: 'em_andamento', count: ticketsStore.inProgressTickets },
  { label: 'Resolvidos', value: 'resolvido', count: ticketsStore.resolvedTickets },
  { label: 'Encerrados', value: 'encerrado', count: ticketsStore.closedTickets },
  { label: 'Cancelados', value: 'cancelado', count: ticketsStore.canceledTickets }
])

const filteredTickets = computed(() => {
  let tickets = ticketsStore.tickets

  // Filtro por tab
  if (activeTab.value !== 'todos') {
    tickets = tickets.filter(t => t.status === activeTab.value)
  }

  // Filtro por status (dropdown)
  if (statusFilter.value) {
    tickets = tickets.filter(t => t.status === statusFilter.value)
  }

  // Filtro por prioridade
  if (priorityFilter.value) {
    tickets = tickets.filter(t => t.priority === priorityFilter.value)
  }

  // Filtro por categoria
  if (categoryFilter.value) {
    tickets = tickets.filter(t => t.category === categoryFilter.value)
  }

  return tickets
})

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

function filterByStatus(status) {
  statusFilter.value = status
  activeTab.value = 'todos'
}

function clearFilters() {
  statusFilter.value = ''
  priorityFilter.value = ''
  categoryFilter.value = ''
  activeTab.value = 'todos'
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

function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR')
}

function openAddModal() {
  editingTicket.value = null
  resetForm()
  showModal.value = true
}

function editTicket(ticket) {
  editingTicket.value = ticket
  formData.value = { ...ticket }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    deviceId: '',
    deviceName: '',
    title: '',
    description: '',
    category: 'hardware',
    priority: 'media',
    solution: ''
  }
}

function saveTicket() {
  const device = devicesStore.devices.find(d => d.id === Number(formData.value.deviceId))
  formData.value.deviceName = device ? device.name : ''

  if (editingTicket.value) {
    ticketsStore.updateTicket(editingTicket.value.id, formData.value)
  } else {
    ticketsStore.addTicket(formData.value)
  }
  closeModal()
}

function resolveTicket(ticket) {
  const solution = prompt('Digite a solução aplicada:')
  if (solution) {
    ticketsStore.closeTicket(ticket.id, solution)
  }
}

function changeStatus(ticket, newStatus) {
  ticketsStore.updateTicket(ticket.id, { status: newStatus })
}
</script>

<style scoped>
.tickets-page {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  justify-content: center;
  text-align: center;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
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
  font-weight: var(--font-weight-medium);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 8px 0;
}

.page-description {
  color: var(--gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
}

/* Filtros */
.filters {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-end;
  flex-wrap: wrap;
  padding: var(--spacing-lg);
}

.filter-group {
  flex: 1;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-group label {
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  font-size: var(--font-size-sm);
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  background: white;
  cursor: pointer;
  transition: var(--transition);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.filter-actions {
  display: flex;
  align-items: flex-end;
}

.tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);
  overflow-x: auto;
  padding-bottom: 2px;
}

.tab {
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--gray-600);
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.tab:hover {
  color: var(--primary);
}

.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tickets-list {
  display: grid;
  gap: var(--spacing-md);
}

.ticket-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.ticket-id {
  font-weight: var(--font-weight-bold);
  color: var(--gray-600);
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-sm);
}

.ticket-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.ticket-description {
  color: var(--gray-700);
  margin: 0;
}

.ticket-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--gray-100);
  border-radius: var(--border-radius);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--font-size-sm);
  min-width: 120px;
}

.meta-label {
  color: var(--gray-600);
  font-size: var(--font-size-xs);
}

.ticket-solution {
  padding: var(--spacing-md);
  background: var(--success-light);
  border-left: 4px solid var(--success);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
}

.ticket-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  flex-wrap: wrap;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

textarea.form-input {
  resize: vertical;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  .header-left {
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--spacing-sm);
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .stat-value {
    font-size: var(--font-size-2xl);
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
    padding: var(--spacing-md);
  }

  .filter-group {
    min-width: auto;
  }

  .ticket-card {
    padding: var(--spacing-md);
  }

  .ticket-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .ticket-title {
    min-width: auto;
    margin: var(--spacing-xs) 0;
  }

  .ticket-description {
    font-size: var(--font-size-sm);
  }

  .ticket-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }

  .meta-item {
    flex-direction: row;
    justify-content: space-between;
    min-width: auto;
  }

  .ticket-actions {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: var(--font-size-xl);
  }

  .tabs {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: var(--spacing-xs);
  }

  .tab {
    padding: 8px 12px;
    font-size: var(--font-size-sm);
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header h1 {
    font-size: var(--font-size-lg);
  }

  .stat-value {
    font-size: var(--font-size-xl);
  }

  .stat-label {
    font-size: var(--font-size-xs);
  }

  .ticket-title {
    font-size: var(--font-size-lg);
  }

  .meta-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .meta-label {
    font-size: var(--font-size-xs);
  }

  .tab {
    padding: 6px;
    font-size: var(--font-size-xs);
  }
}
</style>
