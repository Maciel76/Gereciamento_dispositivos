import axios from 'axios'

// URL base da API - ajuste conforme necessário
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Cria instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Serviço de verificação de rede
export const networkService = {
  /**
   * Verifica o status de múltiplos IPs via ping
   * @param {Array<string>} ips - Array de endereços IP
   * @returns {Promise<Array>} Array com resultados { ip, status }
   */
  async checkDevices(ips) {
    try {
      const response = await api.post('/verificar', { ips })
      return response.data
    } catch (error) {
      console.error('Erro ao verificar dispositivos:', error)
      throw error
    }
  },

  /**
   * Verifica um único dispositivo
   * @param {string} ip - Endereço IP
   * @returns {Promise<Object>} { ip, status }
   */
  async checkSingleDevice(ip) {
    try {
      const response = await api.post('/verificar', { ips: [ip] })
      return response.data[0]
    } catch (error) {
      console.error('Erro ao verificar dispositivo:', error)
      throw error
    }
  }
}

// Serviços de dispositivos (para uso futuro com backend)
export const devicesService = {
  async getAll() {
    const response = await api.get('/api/devices')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/api/devices/${id}`)
    return response.data
  },

  async create(device) {
    const response = await api.post('/api/devices', device)
    return response.data
  },

  async update(id, device) {
    const response = await api.put(`/api/devices/${id}`, device)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/api/devices/${id}`)
    return response.data
  }
}

// Serviços de chamados (para uso futuro com backend)
export const ticketsService = {
  async getAll() {
    const response = await api.get('/api/tickets')
    return response.data
  },

  async create(ticket) {
    const response = await api.post('/api/tickets', ticket)
    return response.data
  },

  async update(id, ticket) {
    const response = await api.put(`/api/tickets/${id}`, ticket)
    return response.data
  }
}

export default api
