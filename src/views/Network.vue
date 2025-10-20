<template>
  <div class="network-page">
    <div class="page-header">
      <div>
        <h1>Monitor de Rede</h1>
        <p class="page-description">Status de conectividade dos dispositivos</p>
        <p v-if="lastCheck" class="last-check">
          Última verificação: {{ formatTime(lastCheck) }}
        </p>
      </div>
      <BaseButton @click="handleCheckAll" :disabled="isChecking">
        <span v-if="isChecking">⏳ Verificando...</span>
        <span v-else>🔄 Verificar Todos</span>
      </BaseButton>
    </div>

    <!-- Stats Cards por Categoria -->
    <div class="stats-grid category-stats">
      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-alpha); color: var(--primary);">
            🖥️
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ categoryCount.pdv }}</h3>
            <p class="stat-label">PDV</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning-light); color: #856404;">
            ⚖️
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ categoryCount.balanca }}</h3>
            <p class="stat-label">Balanças</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--info-light); color: var(--info);">
            📱
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ categoryCount.coletor }}</h3>
            <p class="stat-label">Coletores</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success-light); color: var(--success);">
            🖨️
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ categoryCount.impressora }}</h3>
            <p class="stat-label">Impressoras</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard hover>
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--secondary-alpha); color: var(--secondary);">
            💻
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ categoryCount.computador }}</h3>
            <p class="stat-label">Computadores</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Filtros por Categoria -->
    <BaseCard class="mb-lg">
      <div class="category-filters">
        <h3>Verificar por Categoria</h3>
        <div class="filter-buttons">
          <BaseButton
            size="sm"
            variant="outline"
            v-for="cat in categories"
            :key="cat.value"
            @click="checkCategory(cat.value)"
            :disabled="isChecking"
          >
            {{ cat.label }}
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard>
      <div class="network-table">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Endereço IP</th>
              <th>Local</th>
              <th>Última Verificação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devicesWithIP" :key="device.id" :class="{ 'checking': isCheckingDevice === device.id }">
              <td>
                <div class="status-indicator">
                  <span :class="['status-dot', device.status]"></span>
                </div>
              </td>
              <td><strong>{{ device.name }}</strong></td>
              <td>{{ getCategoryLabel(device.category) }}</td>
              <td><code>{{ device.ip }}</code></td>
              <td>{{ device.location }}</td>
              <td>{{ formatTime(device.lastSeen) }}</td>
              <td>
                <BaseButton
                  size="sm"
                  variant="outline"
                  @click="handlePingDevice(device)"
                  :disabled="isChecking"
                >
                  <span v-if="isCheckingDevice === device.id">⏳</span>
                  <span v-else>Ping</span>
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="devicesWithIP.length === 0" class="no-data">
          <p>Nenhum dispositivo com IP cadastrado</p>
        </div>
      </div>
    </BaseCard>

    <!-- Network Stats -->
    <div class="stats-grid">
      <BaseCard>
        <div class="stat-box">
          <div class="stat-icon online">🟢</div>
          <div>
            <h3>{{ onlineCount }}</h3>
            <p>Dispositivos Online</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="stat-box">
          <div class="stat-icon offline">🔴</div>
          <div>
            <h3>{{ offlineCount }}</h3>
            <p>Dispositivos Offline</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="stat-box">
          <div class="stat-icon">📊</div>
          <div>
            <h3>{{ uptime }}%</h3>
            <p>Taxa de Disponibilidade</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDevicesStore } from '../stores/devices'
import { useNetworkCheck } from '../composables/useNetworkCheck'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'

const devicesStore = useDevicesStore()
const { isChecking, lastCheck, checkAllDevices, checkDevice, checkDevicesByCategory } = useNetworkCheck()

const isCheckingDevice = ref(null)

const categories = [
  { value: 'pdv', label: 'PDV' },
  { value: 'balanca', label: 'Balanças' },
  { value: 'coletor', label: 'Coletores' },
  { value: 'impressora', label: 'Impressoras' },
  { value: 'computador', label: 'Computadores' }
]

const devicesWithIP = computed(() => {
  return devicesStore.devices.filter(d => d.ip)
})

const categoryCount = computed(() => {
  return {
    pdv: devicesWithIP.value.filter(d => d.category === 'pdv').length,
    balanca: devicesWithIP.value.filter(d => d.category === 'balanca').length,
    coletor: devicesWithIP.value.filter(d => d.category === 'coletor').length,
    impressora: devicesWithIP.value.filter(d => d.category === 'impressora').length,
    computador: devicesWithIP.value.filter(d => d.category === 'computador').length
  }
})

const onlineCount = computed(() => devicesWithIP.value.filter(d => d.status === 'online').length)
const offlineCount = computed(() => devicesWithIP.value.filter(d => d.status === 'offline').length)
const uptime = computed(() => {
  const total = devicesWithIP.value.length
  return total > 0 ? ((onlineCount.value / total) * 100).toFixed(1) : 0
})

function getCategoryLabel(category) {
  const labels = {
    'pdv': 'PDV',
    'balanca': 'Balança',
    'coletor': 'Coletor',
    'impressora': 'Impressora',
    'computador': 'Computador'
  }
  return labels[category] || category
}

function formatTime(date) {
  if (!date) return 'Nunca'

  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours > 24) {
    return new Date(date).toLocaleString('pt-BR')
  }
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}min atrás`
  return 'Agora'
}

async function handleCheckAll() {
  try {
    await checkAllDevices()
    console.log('Verificação completa!')
  } catch (error) {
    console.error('Erro na verificação:', error)
    alert('Erro ao verificar dispositivos. Verifique se o servidor está rodando.')
  }
}

async function handlePingDevice(device) {
  isCheckingDevice.value = device.id
  try {
    await checkDevice(device)
    console.log(`Dispositivo ${device.name} verificado!`)
  } catch (error) {
    console.error('Erro ao verificar dispositivo:', error)
    alert('Erro ao verificar dispositivo. Verifique se o servidor está rodando.')
  } finally {
    isCheckingDevice.value = null
  }
}

async function checkCategory(category) {
  try {
    await checkDevicesByCategory(category)
    console.log(`Categoria ${category} verificada!`)
  } catch (error) {
    console.error('Erro ao verificar categoria:', error)
    alert('Erro ao verificar categoria. Verifique se o servidor está rodando.')
  }
}
</script>

<style scoped>
.network-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  margin: 0 0 4px 0;
}

.last-check {
  color: var(--gray-500);
  font-size: var(--font-size-sm);
  margin: 0;
  font-style: italic;
}

.network-table {
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

tbody tr.checking {
  background: var(--primary-alpha);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.status-indicator {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.online {
  background: var(--success);
}

.status-dot.offline {
  background: var(--danger);
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

code {
  background: var(--gray-200);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-xs);
}

.no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--gray-600);
}

.category-filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.category-filters h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.stats-grid.category-stats {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-top: 0;
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
}

.stat-card .stat-icon {
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

.stat-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  background: var(--gray-100);
}

.stat-icon.online {
  background: var(--success-light);
}

.stat-icon.offline {
  background: var(--danger-light);
}

.stat-box h3 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--gray-900);
}

.stat-box p {
  margin: 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}
</style>
