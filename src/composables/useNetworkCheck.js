import { ref } from 'vue'
import { networkService } from '../services/api'
import { useDevicesStore } from '../stores/devices'

export function useNetworkCheck() {
  const devicesStore = useDevicesStore()
  const isChecking = ref(false)
  const lastCheck = ref(null)

  /**
   * Verifica todos os dispositivos com IP
   */
  async function checkAllDevices() {
    isChecking.value = true

    try {
      // Filtra dispositivos que têm IP
      const devicesWithIP = devicesStore.devices.filter(d => d.ip)

      if (devicesWithIP.length === 0) {
        console.warn('Nenhum dispositivo com IP para verificar')
        return []
      }

      // Extrai apenas os IPs
      const ips = devicesWithIP.map(d => d.ip)

      // Faz a verificação via API
      const results = await networkService.checkDevices(ips)

      // Atualiza o status de cada dispositivo na store
      results.forEach(result => {
        const device = devicesStore.devices.find(d => d.ip === result.ip)
        if (device) {
          const newStatus = result.status === 'success' ? 'online' : 'offline'
          devicesStore.updateDevice(device.id, {
            status: newStatus,
            lastSeen: new Date()
          })
        }
      })

      lastCheck.value = new Date()
      return results

    } catch (error) {
      console.error('Erro ao verificar dispositivos:', error)
      throw error
    } finally {
      isChecking.value = false
    }
  }

  /**
   * Verifica um dispositivo específico
   */
  async function checkDevice(device) {
    if (!device.ip) {
      console.warn('Dispositivo não possui IP')
      return null
    }

    isChecking.value = true

    try {
      const result = await networkService.checkSingleDevice(device.ip)

      // Atualiza o status do dispositivo
      const newStatus = result.status === 'success' ? 'online' : 'offline'
      devicesStore.updateDevice(device.id, {
        status: newStatus,
        lastSeen: new Date()
      })

      return result

    } catch (error) {
      console.error('Erro ao verificar dispositivo:', error)
      throw error
    } finally {
      isChecking.value = false
    }
  }

  /**
   * Verifica dispositivos por categoria
   */
  async function checkDevicesByCategory(category) {
    isChecking.value = true

    try {
      const devices = devicesStore.getDevicesByCategory(category)
      const devicesWithIP = devices.filter(d => d.ip)

      if (devicesWithIP.length === 0) {
        return []
      }

      const ips = devicesWithIP.map(d => d.ip)
      const results = await networkService.checkDevices(ips)

      // Atualiza status
      results.forEach(result => {
        const device = devicesStore.devices.find(d => d.ip === result.ip)
        if (device) {
          const newStatus = result.status === 'success' ? 'online' : 'offline'
          devicesStore.updateDevice(device.id, {
            status: newStatus,
            lastSeen: new Date()
          })
        }
      })

      return results

    } catch (error) {
      console.error('Erro ao verificar categoria:', error)
      throw error
    } finally {
      isChecking.value = false
    }
  }

  return {
    isChecking,
    lastCheck,
    checkAllDevices,
    checkDevice,
    checkDevicesByCategory
  }
}
