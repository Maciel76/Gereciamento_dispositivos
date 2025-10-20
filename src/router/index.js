import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { icon: 'mdi:view-dashboard', title: 'Dashboard' }
  },
  {
    path: '/devices',
    name: 'Devices',
    component: () => import('../views/Devices.vue'),
    meta: { icon: 'mdi:devices', title: 'Dispositivos' }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: () => import('../views/Tickets.vue'),
    meta: { icon: 'mdi:ticket', title: 'Chamados Técnicos' }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../views/Employees.vue'),
    meta: { icon: 'mdi:account-group', title: 'Colaboradores' }
  },
  {
    path: '/network',
    name: 'Network',
    component: () => import('../views/Network.vue'),
    meta: { icon: 'mdi:network', title: 'Monitor de Rede' }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../views/Timeline.vue'),
    meta: { icon: 'mdi:timeline-clock', title: 'Timeline de Atividades' }
  },
  {
    path: '/qrcode',
    name: 'QRCode',
    component: () => import('../views/QRCode.vue'),
    meta: { icon: 'mdi:qrcode', title: 'Gerar QR Code' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
