import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useActivitiesStore } from './activities'

export const useTicketsStore = defineStore('tickets', () => {
  // Carregar tickets do localStorage ou usar dados iniciais
  const loadTickets = () => {
    const stored = localStorage.getItem('tickets')
    if (stored) {
      return JSON.parse(stored)
    }
    return [
      {
        id: 1,
        deviceId: 4,
        deviceName: 'COLETOR-RF-01',
        category: 'hardware',
        priority: 'alta',
        status: 'aberto',
        title: 'Coletor não liga',
        description: 'Coletor RF-01 não está ligando após queda',
        solution: null,
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000),
        closedAt: null
      },
      {
        id: 2,
        deviceId: 1,
        deviceName: 'PDV01-CPU',
        category: 'software',
        priority: 'media',
        status: 'em_andamento',
        title: 'Sistema lento no PDV 01',
        description: 'Sistema de frente de caixa apresentando lentidão',
        solution: 'Reiniciado serviços e limpeza de cache',
        createdAt: new Date(Date.now() - 14400000),
        updatedAt: new Date(Date.now() - 3600000),
        closedAt: null
      },
      {
        id: 3,
        deviceId: 5,
        deviceName: 'BALANCA-HORTIFRUTI-01',
        category: 'hardware',
        priority: 'critica',
        status: 'resolvido',
        title: 'Balança não imprime etiquetas',
        description: 'Balança do hortifruti parou de imprimir etiquetas',
        solution: 'Substituída bobina e ajustado sensor de papel',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 82800000),
        closedAt: new Date(Date.now() - 82800000)
      }
    ]
  }

  const tickets = ref(loadTickets())

  // Salvar no localStorage
  function saveToLocalStorage() {
    localStorage.setItem('tickets', JSON.stringify(tickets.value))
  }

  // Computed
  const totalTickets = computed(() => tickets.value.length)
  const openTickets = computed(() => tickets.value.filter(t => t.status === 'aberto').length)
  const inProgressTickets = computed(() => tickets.value.filter(t => t.status === 'em_andamento').length)
  const resolvedTickets = computed(() => tickets.value.filter(t => t.status === 'resolvido').length)

  const ticketsByPriority = computed(() => {
    return {
      critica: tickets.value.filter(t => t.priority === 'critica').length,
      alta: tickets.value.filter(t => t.priority === 'alta').length,
      media: tickets.value.filter(t => t.priority === 'media').length,
      baixa: tickets.value.filter(t => t.priority === 'baixa').length
    }
  })

  const ticketsByStatus = computed(() => {
    return {
      aberto: openTickets.value,
      em_andamento: inProgressTickets.value,
      resolvido: resolvedTickets.value
    }
  })

  // Actions
  function addTicket(ticket) {
    const activitiesStore = useActivitiesStore()

    const newTicket = {
      ...ticket,
      id: Math.max(0, ...tickets.value.map(t => t.id)) + 1,
      status: 'aberto',
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null
    }
    tickets.value.unshift(newTicket)
    saveToLocalStorage()

    // Registrar atividade
    activitiesStore.trackAction(
      'chamado',
      'Novo chamado aberto',
      `Chamado #${newTicket.id}: ${newTicket.title}`,
      newTicket.deviceName
    )

    return newTicket
  }

  function updateTicket(id, updates) {
    const activitiesStore = useActivitiesStore()
    const index = tickets.value.findIndex(t => t.id === id)

    if (index !== -1) {
      const oldTicket = { ...tickets.value[index] }
      tickets.value[index] = {
        ...tickets.value[index],
        ...updates,
        updatedAt: new Date()
      }
      saveToLocalStorage()

      // Registrar atividade se mudou o status
      if (updates.status && updates.status !== oldTicket.status) {
        const statusLabels = {
          'aberto': 'Aberto',
          'em_andamento': 'Em Andamento',
          'resolvido': 'Resolvido'
        }

        activitiesStore.trackAction(
          'chamado',
          'Status de chamado alterado',
          `Chamado #${id} mudou de ${statusLabels[oldTicket.status]} para ${statusLabels[updates.status]}`,
          tickets.value[index].deviceName
        )
      }

      return tickets.value[index]
    }
    return null
  }

  function closeTicket(id, solution) {
    const activitiesStore = useActivitiesStore()
    const ticket = updateTicket(id, {
      status: 'resolvido',
      solution,
      closedAt: new Date()
    })

    if (ticket) {
      activitiesStore.trackAction(
        'chamado',
        'Chamado resolvido',
        `Chamado #${id}: ${ticket.title} foi resolvido`,
        ticket.deviceName
      )
    }

    return ticket
  }

  function getTicketsByStatus(status) {
    return tickets.value.filter(t => t.status === status)
  }

  return {
    tickets,
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    ticketsByPriority,
    ticketsByStatus,
    addTicket,
    updateTicket,
    closeTicket,
    getTicketsByStatus
  }
})
