import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useActivitiesStore } from './activities'

export const useEmployeesStore = defineStore('employees', () => {
  // Carregar employees do localStorage ou usar dados iniciais
  const loadEmployees = () => {
    const stored = localStorage.getItem('employees')
    if (stored) {
      return JSON.parse(stored)
    }
    return [
      {
        id: 1,
        name: 'Maria Silva',
        matricula: 'EMP001',
        department: 'caixa',
        position: 'Operadora de Caixa',
        extension: '2001',
        email: 'maria.silva@assai.com.br',
        phone: '(11) 98765-4321',
        hireDate: new Date('2022-03-15'),
        photo: null,
        assignedDevices: [1, 2] // IDs de dispositivos
      },
      {
        id: 2,
        name: 'João Santos',
        matricula: 'EMP002',
        department: 'administrativo',
        position: 'Assistente Administrativo',
        extension: '2010',
        email: 'joao.santos@assai.com.br',
        phone: '(11) 98765-1234',
        hireDate: new Date('2021-06-01'),
        photo: null,
        assignedDevices: [6]
      },
      {
        id: 3,
        name: 'Ana Costa',
        matricula: 'EMP003',
        department: 'estoque',
        position: 'Conferente',
        extension: '2020',
        email: 'ana.costa@assai.com.br',
        phone: '(11) 98765-5678',
        hireDate: new Date('2023-01-10'),
        photo: null,
        assignedDevices: [4]
      },
      {
        id: 4,
        name: 'Carlos Oliveira',
        matricula: 'EMP004',
        department: 'gerencia',
        position: 'Gerente de Loja',
        extension: '2000',
        email: 'carlos.oliveira@assai.com.br',
        phone: '(11) 98765-9999',
        hireDate: new Date('2020-01-05'),
        photo: null,
        assignedDevices: [3, 5]
      }
    ]
  }

  const employees = ref(loadEmployees())

  const departments = [
    { value: 'caixa', label: 'Caixa' },
    { value: 'administrativo', label: 'Administrativo' },
    { value: 'estoque', label: 'Estoque' },
    { value: 'gerencia', label: 'Gerência' }
  ]

  // Salvar no localStorage
  function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees.value))
  }

  // Computed
  const totalEmployees = computed(() => employees.value.length)

  // Actions
  function addEmployee(employee) {
    const activitiesStore = useActivitiesStore()

    const newEmployee = {
      ...employee,
      id: Math.max(0, ...employees.value.map(e => e.id)) + 1,
      hireDate: new Date(),
      assignedDevices: [],
      photo: null
    }
    employees.value.push(newEmployee)
    saveToLocalStorage()

    // Registrar atividade
    activitiesStore.trackAction(
      'colaborador',
      'Novo colaborador cadastrado',
      `Colaborador ${newEmployee.name} (${newEmployee.matricula}) foi adicionado`,
      newEmployee.name
    )

    return newEmployee
  }

  function updateEmployee(id, updates) {
    const activitiesStore = useActivitiesStore()
    const index = employees.value.findIndex(e => e.id === id)

    if (index !== -1) {
      const oldEmployee = { ...employees.value[index] }
      employees.value[index] = { ...employees.value[index], ...updates }
      saveToLocalStorage()

      // Registrar atividade
      activitiesStore.trackAction(
        'colaborador',
        'Colaborador atualizado',
        `Dados do colaborador ${employees.value[index].name} foram atualizados`,
        employees.value[index].name
      )

      return employees.value[index]
    }
    return null
  }

  function assignDevice(employeeId, deviceId) {
    const activitiesStore = useActivitiesStore()
    const employee = employees.value.find(e => e.id === employeeId)

    if (employee) {
      if (!employee.assignedDevices) {
        employee.assignedDevices = []
      }

      if (!employee.assignedDevices.includes(deviceId)) {
        employee.assignedDevices.push(deviceId)
        saveToLocalStorage()

        // Registrar atividade
        activitiesStore.trackAction(
          'colaborador',
          'Equipamento atribuído',
          `Equipamento foi atribuído a ${employee.name}`,
          employee.name
        )

        return true
      }
    }
    return false
  }

  function removeDevice(employeeId, deviceId) {
    const activitiesStore = useActivitiesStore()
    const employee = employees.value.find(e => e.id === employeeId)

    if (employee && employee.assignedDevices) {
      const index = employee.assignedDevices.indexOf(deviceId)
      if (index !== -1) {
        employee.assignedDevices.splice(index, 1)
        saveToLocalStorage()

        // Registrar atividade
        activitiesStore.trackAction(
          'colaborador',
          'Equipamento removido',
          `Equipamento foi removido de ${employee.name}`,
          employee.name
        )

        return true
      }
    }
    return false
  }

  function deleteEmployee(id) {
    const activitiesStore = useActivitiesStore()
    const index = employees.value.findIndex(e => e.id === id)

    if (index !== -1) {
      const employeeName = employees.value[index].name
      employees.value.splice(index, 1)
      saveToLocalStorage()

      // Registrar atividade
      activitiesStore.trackAction(
        'colaborador',
        'Colaborador removido',
        `Colaborador ${employeeName} foi excluído do sistema`,
        employeeName
      )

      return true
    }
    return false
  }

  function getEmployeesByDepartment(department) {
    return employees.value.filter(e => e.department === department)
  }

  function getEmployeeById(id) {
    return employees.value.find(e => e.id === id)
  }

  return {
    employees,
    departments,
    totalEmployees,
    addEmployee,
    updateEmployee,
    assignDevice,
    removeDevice,
    deleteEmployee,
    getEmployeesByDepartment,
    getEmployeeById
  }
})
