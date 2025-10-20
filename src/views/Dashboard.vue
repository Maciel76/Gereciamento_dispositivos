<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-alpha); color: var(--primary);">
            <Icon icon="mdi:devices" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ devicesStore.totalDevices }}</h3>
            <p class="stat-label">Total de Dispositivos</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
            <Icon icon="mdi:check-circle" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ devicesStore.onlineDevices }}</h3>
            <p class="stat-label">Dispositivos Online</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--danger-light); color: var(--danger);">
            <Icon icon="mdi:alert-circle" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ devicesStore.offlineDevices }}</h3>
            <p class="stat-label">Dispositivos Offline</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning-light); color: #856404;">
            <Icon icon="mdi:ticket" width="32" height="32" />
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ ticketsStore.openTickets }}</h3>
            <p class="stat-label">Chamados Abertos</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="dashboard-grid">
      <!-- Chamados por Prioridade -->
      <BaseCard>
        <template #header>
          <div class="card-header-content">
            <h3>Chamados por Prioridade</h3>
          </div>
        </template>
        <div class="priority-list">
          <div class="priority-item">
            <div class="priority-info">
              <BaseBadge variant="danger">Crítica</BaseBadge>
              <span class="priority-count">{{ ticketsStore.ticketsByPriority.critica }}</span>
            </div>
            <div class="priority-bar">
              <div class="priority-bar-fill"
                   style="background: var(--danger);"
                   :style="{ width: `${getPercentage(ticketsStore.ticketsByPriority.critica)}%` }">
              </div>
            </div>
          </div>

          <div class="priority-item">
            <div class="priority-info">
              <BaseBadge variant="warning">Alta</BaseBadge>
              <span class="priority-count">{{ ticketsStore.ticketsByPriority.alta }}</span>
            </div>
            <div class="priority-bar">
              <div class="priority-bar-fill"
                   style="background: var(--warning);"
                   :style="{ width: `${getPercentage(ticketsStore.ticketsByPriority.alta)}%` }">
              </div>
            </div>
          </div>

          <div class="priority-item">
            <div class="priority-info">
              <BaseBadge variant="info">Média</BaseBadge>
              <span class="priority-count">{{ ticketsStore.ticketsByPriority.media }}</span>
            </div>
            <div class="priority-bar">
              <div class="priority-bar-fill"
                   style="background: var(--info);"
                   :style="{ width: `${getPercentage(ticketsStore.ticketsByPriority.media)}%` }">
              </div>
            </div>
          </div>

          <div class="priority-item">
            <div class="priority-info">
              <BaseBadge variant="light">Baixa</BaseBadge>
              <span class="priority-count">{{ ticketsStore.ticketsByPriority.baixa }}</span>
            </div>
            <div class="priority-bar">
              <div class="priority-bar-fill"
                   style="background: var(--gray-500);"
                   :style="{ width: `${getPercentage(ticketsStore.ticketsByPriority.baixa)}%` }">
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Últimos Chamados -->
      <BaseCard>
        <template #header>
          <div class="card-header-content">
            <h3>Últimos Chamados</h3>
            <router-link to="/tickets" class="link">Ver todos</router-link>
          </div>
        </template>
        <div class="tickets-list">
          <div v-for="ticket in recentTickets" :key="ticket.id" class="ticket-item">
            <div class="ticket-header">
              <span class="ticket-device">{{ ticket.deviceName }}</span>
              <BaseBadge :variant="getStatusVariant(ticket.status)">
                {{ getStatusLabel(ticket.status) }}
              </BaseBadge>
            </div>
            <p class="ticket-title">{{ ticket.title }}</p>
            <div class="ticket-footer">
              <BaseBadge :variant="getPriorityVariant(ticket.priority)" size="sm">
                {{ ticket.priority }}
              </BaseBadge>
              <span class="ticket-time">{{ formatTime(ticket.createdAt) }}</span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Dispositivos com Problemas -->
    <BaseCard>
      <template #header>
        <div class="card-header-content">
          <h3>Dispositivos que Requerem Atenção</h3>
          <router-link to="/devices" class="link">Ver inventário</router-link>
        </div>
      </template>
      <div class="devices-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Local</th>
              <th>IP</th>
              <th>Status</th>
              <th>Última Verificação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in problemDevices" :key="device.id">
              <td><strong>{{ device.name }}</strong></td>
              <td>{{ getCategoryLabel(device.category) }}</td>
              <td>{{ device.location }}</td>
              <td><code>{{ device.ip || 'N/A' }}</code></td>
              <td>
                <BaseBadge :variant="device.status === 'online' ? 'success' : 'danger'">
                  {{ device.status === 'online' ? 'Online' : 'Offline' }}
                </BaseBadge>
              </td>
              <td>{{ formatTime(device.lastSeen) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDevicesStore } from '../stores/devices'
import { useTicketsStore } from '../stores/tickets'
import { useNetworkCheck } from '../composables/useNetworkCheck'
import BaseCard from '../components/common/BaseCard.vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import { Icon } from '@iconify/vue'

const devicesStore = useDevicesStore()
const ticketsStore = useTicketsStore()
const { isChecking, checkAllDevices } = useNetworkCheck()

const autoCheckEnabled = ref(false)

const recentTickets = computed(() => {
  return ticketsStore.tickets.slice(0, 3)
})

const problemDevices = computed(() => {
  return devicesStore.devices.filter(d => d.status === 'offline')
})

function getPercentage(value) {
  const total = ticketsStore.totalTickets
  return total > 0 ? (value / total) * 100 : 0
}

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

function getCategoryLabel(category) {
  const labels = {
    'pdv': 'PDV',
    'balanca': 'Balança',
    'coletor': 'Coletor',
    'impressora': 'Impressora',
    'computador': 'Computador',
    'outros': 'Outros'
  }
  return labels[category] || category
}

function formatTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}min atrás`
  return 'Agora'
}

async function refreshDevicesStatus() {
  try {
    await checkAllDevices()
  } catch (error) {
    console.error('Erro ao atualizar status dos dispositivos:', error)
  }
}

// Verificação automática ao montar o componente
onMounted(() => {
  // Verifica status dos dispositivos se houver dispositivos com IP
  const devicesWithIP = devicesStore.devices.filter(d => d.ip)
  if (devicesWithIP.length > 0 && autoCheckEnabled.value) {
    refreshDevicesStatus()
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

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

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-header-content h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.link {
  color: var(--primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.link:hover {
  text-decoration: underline;
}

.priority-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.priority-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.priority-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority-count {
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  font-size: var(--font-size-lg);
}

.priority-bar {
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.priority-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ticket-item {
  padding: var(--spacing-md);
  background: var(--gray-100);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.ticket-device {
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  font-size: var(--font-size-sm);
}

.ticket-title {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--gray-700);
  font-size: var(--font-size-sm);
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-time {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

.devices-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px;
  background: var(--gray-100);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
  font-size: var(--font-size-sm);
  border-bottom: 2px solid var(--border-color);
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  color: var(--gray-800);
  font-size: var(--font-size-sm);
}

tbody tr:hover {
  background: var(--gray-100);
}

code {
  background: var(--gray-200);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-xs);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .devices-table {
    font-size: var(--font-size-xs);
  }
}
</style>
