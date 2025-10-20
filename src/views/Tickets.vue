<template>
  <div class="tickets-page">
    <div class="page-header">
      <div>
        <h1>Chamados Técnicos</h1>
        <p class="page-description">Gerencie chamados de suporte e manutenção</p>
      </div>
      <BaseButton @click="openAddModal">
        ➕ Novo Chamado
      </BaseButton>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--danger-light); color: var(--danger);">
            🎫
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.openTickets }}</h3>
            <p class="stat-label">Abertos</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning-light); color: #856404;">
            ⚙️
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.inProgressTickets }}</h3>
            <p class="stat-label">Em Andamento</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
            ✅
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.resolvedTickets }}</h3>
            <p class="stat-label">Resolvidos</p>
          </div>
        </div>
      </BaseCard>
    </div>

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

const ticketsStore = useTicketsStore()
const devicesStore = useDevicesStore()

const showModal = ref(false)
const editingTicket = ref(null)
const activeTab = ref('todos')

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
  { label: 'Resolvidos', value: 'resolvido', count: ticketsStore.resolvedTickets }
])

const filteredTickets = computed(() => {
  if (activeTab.value === 'todos') {
    return ticketsStore.tickets
  }
  return ticketsStore.getTicketsByStatus(activeTab.value)
})

function getStatusVariant(status) {
  const variants = {
    'aberto': 'danger',
    'em_andamento': 'warning',
    'resolvido': 'success'
  }
  return variants[status] || 'light'
}

function getStatusLabel(status) {
  const labels = {
    'aberto': 'Aberto',
    'em_andamento': 'Em Andamento',
    'resolvido': 'Resolvido'
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
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
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 8px 0;
}

.page-description {
  color: var(--gray-600);
  margin: 0;
}

.tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);
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
}

.ticket-id {
  font-weight: var(--font-weight-bold);
  color: var(--gray-600);
  font-family: 'Courier New', monospace;
}

.ticket-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
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
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
}

.meta-label {
  color: var(--gray-600);
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    overflow-x: auto;
  }
}
</style>
