<template>
  <div class="qrcode-page">
    <div class="page-header">
      <div>
        <h1>Gerador de QR Code</h1>
        <p class="page-description">Gere QR Codes para identificação de dispositivos</p>
      </div>
      <div class="header-actions">
        <button
          :class="['mode-btn', { active: mode === 'single' }]"
          @click="mode = 'single'"
        >
          📱 Individual
        </button>
        <button
          :class="['mode-btn', { active: mode === 'bulk' }]"
          @click="mode = 'bulk'"
        >
          📦 Em Massa
        </button>
      </div>
    </div>

    <!-- Modo Individual -->
    <div v-if="mode === 'single'" class="single-mode">
      <div class="qrcode-container">
        <BaseCard>
          <div class="panel-header">
            <h2>Configuração do QR Code</h2>
          </div>

          <div class="panel-content">
            <div class="form-group">
              <label>Selecione o Dispositivo *</label>
              <select v-model="selectedDeviceId" class="form-input" @change="loadDevice">
                <option value="">Selecione um dispositivo...</option>
                <option v-for="device in devicesStore.devices" :key="device.id" :value="device.id">
                  {{ device.name }} - {{ device.location }}
                </option>
              </select>
            </div>

            <div v-if="selectedDevice" class="device-info">
              <h4>Informações do Dispositivo</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Nome:</span>
                  <strong>{{ selectedDevice.name }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Categoria:</span>
                  <strong>{{ getCategoryLabel(selectedDevice.category) }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Número de Série:</span>
                  <strong>{{ selectedDevice.serial }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Local:</span>
                  <strong>{{ selectedDevice.location }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">IP:</span>
                  <strong>{{ selectedDevice.ip || 'N/A' }}</strong>
                </div>
                <div class="info-item">
                  <span class="label">Marca/Modelo:</span>
                  <strong>{{ selectedDevice.brand }} {{ selectedDevice.model }}</strong>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Informações Adicionais (opcional)</label>
              <textarea
                v-model="additionalText"
                class="form-input"
                rows="4"
                placeholder="Digite informações extras, instruções, observações, etc..."
              ></textarea>
              <small class="helper-text">
                Essas informações aparecerão quando o QR Code for escaneado
              </small>
            </div>

            <div class="options-grid">
              <div class="option-group">
                <label for="qrSize">Tamanho do QR Code</label>
                <input type="number" id="qrSize" v-model.number="qrOptions.size" min="64" max="256" class="form-input" />
              </div>

              <div class="option-group">
                <label for="qrColor">Cor do QR Code</label>
                <input type="color" id="qrColor" v-model="qrOptions.color" class="form-input" />
              </div>
            </div>

            <BaseButton @click="generateSingleQRCode" :disabled="!selectedDevice" block>
              🔷 Gerar QR Code
            </BaseButton>
          </div>
        </BaseCard>

        <BaseCard v-if="singleQRGenerated">
          <div class="panel-header">
            <h2>QR Code Gerado</h2>
          </div>

          <div class="qrcode-preview">
            <div class="qrcode-display">
              <div ref="singleQRRef" class="qrbox-large"></div>
              <p class="qrcode-label">{{ selectedDevice.name }}</p>
            </div>

            <div class="qr-data-preview">
              <h4>Dados no QR Code:</h4>
              <div class="data-content">
                <p><strong>Dispositivo:</strong> {{ selectedDevice.name }}</p>
                <p><strong>Série:</strong> {{ selectedDevice.serial }}</p>
                <p><strong>IP:</strong> {{ selectedDevice.ip || 'N/A' }}</p>
                <p><strong>Modelo:</strong> {{ selectedDevice.brand }} {{ selectedDevice.model }}</p>
                <p><strong>Local:</strong> {{ selectedDevice.location }}</p>
                <p v-if="additionalText"><strong>Informações:</strong> {{ additionalText }}</p>
              </div>
            </div>

            <div class="qrcode-actions">
              <BaseButton variant="success" @click="downloadSingleQRCode">
                💾 Download PNG
              </BaseButton>
              <BaseButton variant="outline" @click="printSingleQRCode">
                🖨️ Imprimir
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Modo Em Massa -->
    <div v-if="mode === 'bulk'" class="bulk-mode">
      <BaseCard class="control-panel">
        <div class="panel-header">
          <h2>Geração em Massa</h2>
        </div>

        <div class="panel-content">
          <div class="input-section">
            <label for="input" class="input-label">
              Dados para gerar QR Codes
            </label>
            <textarea
              id="input"
              v-model="inputData"
              placeholder="Cole os dados no formato: código;nome;localização (uma linha por item)"
              rows="6"
            ></textarea>
          </div>

          <div class="file-upload">
            <label for="csv" class="file-upload-label">
              <input type="file" id="csv" accept=".csv" @change="handleCsvUpload" />
              📄 Selecionar arquivo CSV
            </label>
            <span class="file-name">{{ fileName }}</span>
          </div>

          <div class="actions">
            <BaseButton @click="loadFromInventory" variant="outline">
              📦 Carregar do Inventário
            </BaseButton>
            <BaseButton @click="generateQRCodes" :disabled="!inputData.trim()">
              🔷 Gerar QR Codes
            </BaseButton>
            <BaseButton variant="outline" @click="printQRCodes" :disabled="qrCodes.length === 0">
              🖨️ Imprimir
            </BaseButton>
            <BaseButton variant="outline" @click="clearAll">
              🗑️ Limpar
            </BaseButton>
          </div>

          <div v-if="statusMessage" :class="['status', statusType]">
            {{ statusMessage }}
          </div>
        </div>
      </BaseCard>

      <!-- View Toggle -->
      <div v-if="qrCodes.length > 0" class="view-options">
        <div class="view-toggle">
          <button
            :class="['view-btn', { active: viewMode === 'cards' }]"
            @click="viewMode = 'cards'"
          >
            🎴 Cards
          </button>
          <button
            :class="['view-btn', { active: viewMode === 'table' }]"
            @click="viewMode = 'table'"
          >
            📋 Tabela
          </button>
        </div>
        <div class="results-info">
          <span>{{ qrCodes.length }} {{ qrCodes.length === 1 ? 'item' : 'itens' }}</span>
        </div>
      </div>

      <!-- Cards View -->
      <div v-if="viewMode === 'cards' && qrCodes.length > 0" class="qr-grid">
        <BaseCard v-for="(item, index) in qrCodes" :key="index" hover>
          <div class="qr-card">
            <div class="qr-header">
              <span class="qr-badge">Item</span>
            </div>
            <div class="qr-content">
              <div class="qr-code-wrapper">
                <div :ref="el => qrRefs[index] = el" class="qrbox"></div>
              </div>
              <div class="qr-details">
                <h3>{{ item.codigo }}</h3>
                <p>{{ item.nome }}</p>
                <span v-if="item.quantidade" class="quantity">{{ item.quantidade }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Table View -->
      <BaseCard v-if="viewMode === 'table' && qrCodes.length > 0">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Info</th>
                <th>QR Code</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in qrCodes" :key="index">
                <td><strong>{{ item.codigo }}</strong></td>
                <td>{{ item.nome }}</td>
                <td>{{ item.quantidade }}</td>
                <td class="qr-container">
                  <div :ref="el => qrRefsTable[index] = el" class="qrbox"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- Empty State -->
      <div v-if="qrCodes.length === 0" class="empty-state">
        <div class="empty-icon">📱</div>
        <h3>Nada para exibir ainda</h3>
        <p>Cole os dados, faça upload de um CSV ou carregue do inventário para gerar QR Codes.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useDevicesStore } from '../stores/devices'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import QRCode from 'qrcode'
import Papa from 'papaparse'

const devicesStore = useDevicesStore()

// Mode
const mode = ref('single')

// Single Mode
const selectedDeviceId = ref('')
const additionalText = ref('')
const singleQRGenerated = ref(false)
const singleQRRef = ref(null)

// Bulk Mode
const inputData = ref('')
const fileName = ref('Nenhum arquivo selecionado')
const viewMode = ref('cards')
const statusMessage = ref('')
const statusType = ref('success')
const qrCodes = ref([])
const qrRefs = ref([])
const qrRefsTable = ref([])

const qrOptions = ref({
  size: 180,
  color: '#000000'
})

const selectedDevice = computed(() => {
  if (!selectedDeviceId.value) return null
  return devicesStore.devices.find(d => d.id === Number(selectedDeviceId.value))
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

function loadDevice() {
  singleQRGenerated.value = false
  additionalText.value = ''
}

// Gerar dados estruturados para o QR Code
function generateQRData(device, additionalInfo = '') {
  let data = `DISPOSITIVO: ${device.name}\n`
  data += `SÉRIE: ${device.serial}\n`
  data += `IP: ${device.ip || 'N/A'}\n`
  data += `MODELO: ${device.brand} ${device.model}\n`
  data += `LOCAL: ${device.location}\n`
  data += `CATEGORIA: ${getCategoryLabel(device.category)}\n`

  if (additionalInfo) {
    data += `\nINFORMAÇÕES:\n${additionalInfo}`
  }

  return data
}

async function generateSingleQRCode() {
  if (!selectedDevice.value) return

  const qrData = generateQRData(selectedDevice.value, additionalText.value)

  singleQRGenerated.value = true

  await nextTick()

  if (singleQRRef.value) {
    singleQRRef.value.innerHTML = ''
    const canvas = document.createElement('canvas')
    singleQRRef.value.appendChild(canvas)

    try {
      await QRCode.toCanvas(canvas, qrData, {
        width: qrOptions.value.size,
        margin: 2,
        color: {
          dark: qrOptions.value.color,
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
    }
  }
}

function downloadSingleQRCode() {
  if (!singleQRRef.value) return

  const canvas = singleQRRef.value.querySelector('canvas')
  if (canvas) {
    const link = document.createElement('a')
    link.download = `qrcode-${selectedDevice.value.name}.png`
    link.href = canvas.toDataURL()
    link.click()
  }
}

function printSingleQRCode() {
  window.print()
}

// ===== BULK MODE FUNCTIONS =====

function detectSep(line) {
  const candidates = [';', ',', '\t', '|']
  const counts = candidates.map(s => [s, (line.match(new RegExp(`\\${s}`, 'g')) || []).length])
  counts.sort((a, b) => b[1] - a[1])
  return counts[0][1] ? counts[0][0] : ';'
}

function parseText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (lines.length === 0) return []

  const sep = detectSep(lines[0])
  return lines.map(l => {
    const parts = l.split(sep).map(s => s?.trim() ?? '')
    return {
      codigo: parts[0] || '',
      nome: parts[1] || '',
      quantidade: parts[2] || ''
    }
  })
}

function normalize(rows) {
  return rows.filter(r => r.codigo && r.codigo.trim() !== '')
}

async function renderQRCode(element, text) {
  try {
    element.innerHTML = ''
    await QRCode.toCanvas(element, text, {
      width: 120,
      margin: 1,
      color: {
        dark: qrOptions.value.color,
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    element.innerHTML = '<span class="error">Erro no QR</span>'
  }
}

async function generateQRCodes() {
  const text = inputData.value
  if (!text.trim()) {
    showStatus('Por favor, insira alguns dados primeiro', 'error')
    return
  }

  try {
    const rows = normalize(parseText(text))
    qrCodes.value = rows

    await nextTick()

    if (viewMode.value === 'cards') {
      rows.forEach((row, index) => {
        const element = qrRefs.value[index]
        if (element) {
          const canvas = document.createElement('canvas')
          element.appendChild(canvas)
          renderQRCode(canvas, row.codigo)
        }
      })
    } else {
      rows.forEach((row, index) => {
        const element = qrRefsTable.value[index]
        if (element) {
          const canvas = document.createElement('canvas')
          element.appendChild(canvas)
          renderQRCode(canvas, row.codigo)
        }
      })
    }

    showStatus(`Gerados ${rows.length} QR Codes`, 'success')
  } catch (error) {
    showStatus('Erro ao processar dados: ' + error.message, 'error')
    console.error(error)
  }
}

function showStatus(message, type = 'success') {
  statusMessage.value = message
  statusType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

function loadFromInventory() {
  const devices = devicesStore.devices
  const data = devices.map(d => `${d.serial};${d.name};${d.location}`).join('\n')
  inputData.value = data
  showStatus(`${devices.length} dispositivos carregados do inventário`, 'success')
}

function handleCsvUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  fileName.value = file.name

  if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
    showStatus('Por favor, selecione um arquivo CSV válido', 'error')
    return
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      if (results.errors.length > 0) {
        showStatus('Erro ao processar CSV: ' + results.errors[0].message, 'error')
        return
      }

      const rows = results.data.map(row => {
        const keys = Object.keys(row)
        const codigo = row[keys[0]] || ''
        const nome = row[keys[1]] || ''
        const quantidade = row[keys[2]] || ''

        return {
          codigo: codigo.toString().trim(),
          nome: nome.toString().trim(),
          quantidade: quantidade.toString().trim()
        }
      }).filter(row => row.codigo !== '')

      const textData = rows.map(r => `${r.codigo};${r.nome};${r.quantidade}`).join('\n')
      inputData.value = textData

      showStatus(`CSV processado com ${rows.length} linhas válidas`, 'success')
    },
    error: function (error) {
      showStatus('Erro ao ler arquivo: ' + error.message, 'error')
    }
  })
}

function printQRCodes() {
  window.print()
}

function clearAll() {
  inputData.value = ''
  qrCodes.value = []
  fileName.value = 'Nenhum arquivo selecionado'
  statusMessage.value = ''
}

watch(viewMode, async () => {
  if (qrCodes.value.length > 0) {
    await nextTick()

    if (viewMode.value === 'cards') {
      qrCodes.value.forEach((row, index) => {
        const element = qrRefs.value[index]
        if (element) {
          element.innerHTML = ''
          const canvas = document.createElement('canvas')
          element.appendChild(canvas)
          renderQRCode(canvas, row.codigo)
        }
      })
    } else {
      qrCodes.value.forEach((row, index) => {
        const element = qrRefsTable.value[index]
        if (element) {
          element.innerHTML = ''
          const canvas = document.createElement('canvas')
          element.appendChild(canvas)
          renderQRCode(canvas, row.codigo)
        }
      })
    }
  }
})
</script>

<style scoped>
.qrcode-page {
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
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.mode-btn {
  background: white;
  color: var(--gray-600);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
}

.mode-btn.active,
.mode-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Single Mode */
.single-mode .qrcode-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.panel-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--gray-100);
}

.panel-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.panel-content {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  margin-bottom: 8px;
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

textarea.form-input {
  resize: vertical;
  font-family: var(--font-family);
}

.helper-text {
  display: block;
  margin-top: 6px;
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  font-style: italic;
}

.device-info {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  background: var(--gray-100);
  border-radius: var(--border-radius);
}

.device-info h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--gray-900);
  font-size: var(--font-size-lg);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.option-group label {
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  font-size: var(--font-size-sm);
}

.option-group input[type="color"] {
  height: 45px;
  padding: 5px;
  cursor: pointer;
}

.qrcode-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.qrcode-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  background: var(--gray-100);
  border-radius: var(--border-radius-lg);
}

.qrbox-large {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrcode-label {
  margin: var(--spacing-md) 0 0 0;
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  text-align: center;
  font-size: var(--font-size-lg);
}

.qr-data-preview {
  padding: var(--spacing-lg);
  background: var(--info-light);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--info);
}

.qr-data-preview h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--gray-900);
  font-size: var(--font-size-base);
}

.data-content p {
  margin: var(--spacing-sm) 0;
  color: var(--gray-700);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.qrcode-actions {
  display: flex;
  gap: var(--spacing-md);
}

/* Bulk Mode */
.control-panel {
  margin-bottom: var(--spacing-xl);
}

.input-section {
  margin-bottom: var(--spacing-lg);
}

.input-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: monospace;
  font-size: var(--font-size-sm);
  resize: vertical;
  transition: var(--transition);
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.file-upload {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.file-upload-label {
  background: var(--primary);
  color: white;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.file-upload-label:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.file-upload input[type="file"] {
  display: none;
}

.file-name {
  font-style: italic;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
}

.status {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  font-weight: var(--font-weight-medium);
  margin-top: var(--spacing-md);
}

.status.error {
  background-color: var(--danger-light);
  color: var(--danger);
  border-left: 4px solid var(--danger);
}

.status.success {
  background-color: var(--success-light);
  color: var(--success);
  border-left: 4px solid var(--success);
}

.view-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.view-toggle {
  display: flex;
  gap: var(--spacing-sm);
}

.view-btn {
  background: white;
  color: var(--gray-600);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: var(--font-weight-medium);
}

.view-btn.active,
.view-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.results-info {
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.qr-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.qr-badge {
  background: var(--success);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: var(--spacing-md);
}

.qr-code-wrapper {
  background: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
}

.qr-details {
  width: 100%;
  text-align: center;
}

.qr-details h3 {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--gray-900);
  font-weight: var(--font-weight-semibold);
  word-break: break-all;
}

.qr-details p {
  color: var(--gray-600);
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
}

.qr-details .quantity {
  display: inline-block;
  background: var(--info-light);
  color: var(--info);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background: var(--gray-100);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
}

tr:hover {
  background: var(--gray-100);
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrbox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--gray-600);
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.3;
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--gray-900);
}

.empty-state p {
  font-size: var(--font-size-base);
}

@media (max-width: 968px) {
  .single-mode .qrcode-container {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .qrcode-actions {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .qr-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .page-header,
  .control-panel,
  .view-options,
  .panel-content,
  .mode-btn,
  .qrcode-actions {
    display: none !important;
  }

  .panel-header {
    display: none !important;
  }

  .qrcode-display {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .qr-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10mm;
  }

  .qr-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
