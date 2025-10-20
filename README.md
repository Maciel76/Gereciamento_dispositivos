# 🖥️ Sistema de Gerenciamento de TI - Assaí Atacadista

Sistema web interno para gerenciamento de infraestrutura de TI desenvolvido para assistentes de TI do Assaí Atacadista.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Pinia](https://img.shields.io/badge/Pinia-Store-FFC107?style=flat-square)

## 📋 Índice

- [Recursos](#-recursos)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Desenvolvimento](#-desenvolvimento)

## ✨ Recursos

### 📊 Dashboard
- Métricas em tempo real de dispositivos
- Visualização de chamados abertos
- Gráficos de prioridade de chamados
- Lista de dispositivos com problemas

### 🖥️ Inventário de Dispositivos
- Cadastro completo de dispositivos (PDV, Balanças, Coletores, RUBEs, Computadores)
- Filtros avançados por categoria, status e setor
- Modal de cadastro/edição intuitivo
- Gerenciamento de informações de rede (IP, Rack, Porta)

### 🎫 Chamados Técnicos
- Sistema completo de tickets
- Abas por status (Abertos, Em Andamento, Resolvidos)
- Priorização (Baixa, Média, Alta, Crítica)
- Categorização (Hardware, Software, Rede)
- Registro de soluções aplicadas

### 👥 Colaboradores
- Gerenciamento de colaboradores por departamento
- Cards com informações de contato
- Botão rápido para abrir chamados

### 🌐 Monitor de Rede
- **Verificação via PING em tempo real**
- Status online/offline de dispositivos
- Verificação individual ou em massa
- Filtros por categoria
- Indicadores visuais de conectividade
- Taxa de disponibilidade calculada automaticamente

### ⏰ Timeline de Atividades
- Registro de atividades do assistente de TI
- Atividades manuais e automáticas
- Histórico completo com timestamps

### 🔷 Gerador de QR Code
- Geração de QR Codes para dispositivos
- Preview visual
- Download e impressão

## 🛠 Tecnologias

### Frontend
- **Vue.js 3** - Framework JavaScript progressivo
- **Vue Router 4** - Roteamento oficial do Vue
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **CSS3 Puro** - Estilização moderna sem frameworks

### Backend (Monitor de Rede)
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Ping** - Biblioteca para verificação de rede
- **CORS** - Middleware para requisições cross-origin

### Ícones
- **@heroicons/vue** - Conjunto de ícones SVG

## 🚀 Instalação

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Gerenciamento
```

### 2. Instale as dependências do Frontend

```bash
npm install
```

### 3. Configure o servidor de verificação de rede

```bash
cd rede/Dispositivo-Rede
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário:

```env
VITE_API_URL=http://localhost:3000
```

## 💻 Uso

### Iniciar o Frontend

```bash
npm run dev
```

O sistema estará disponível em: `http://localhost:5173`

### Iniciar o Servidor de Verificação de Rede

Em outro terminal:

```bash
cd rede/Dispositivo-Rede
node server.js
```

O servidor estará rodando em: `http://localhost:3000`

> ⚠️ **IMPORTANTE**: Para usar o Monitor de Rede com verificação real via PING, o servidor deve estar rodando!

## 📁 Estrutura do Projeto

```
Gerenciamento/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css    # Variáveis CSS (cores, espaçamentos)
│   │       └── global.css        # Estilos globais
│   ├── components/
│   │   └── common/
│   │       ├── BaseButton.vue    # Botão reutilizável
│   │       ├── BaseCard.vue      # Card reutilizável
│   │       ├── BaseBadge.vue     # Badge reutilizável
│   │       └── BaseModal.vue     # Modal reutilizável
│   ├── composables/
│   │   └── useNetworkCheck.js    # Lógica de verificação de rede
│   ├── layouts/
│   │   └── MainLayout.vue        # Layout principal com sidebar
│   ├── router/
│   │   └── index.js              # Configuração de rotas
│   ├── services/
│   │   └── api.js                # Serviços de API
│   ├── stores/
│   │   ├── devices.js            # Store de dispositivos
│   │   ├── tickets.js            # Store de chamados
│   │   └── employees.js          # Store de colaboradores
│   ├── views/
│   │   ├── Dashboard.vue         # Página principal
│   │   ├── Devices.vue           # Inventário
│   │   ├── Tickets.vue           # Chamados
│   │   ├── Employees.vue         # Colaboradores
│   │   ├── Network.vue           # Monitor de rede
│   │   ├── Timeline.vue          # Timeline
│   │   └── QRCode.vue            # Gerador QR
│   ├── App.vue                   # Componente raiz
│   └── main.js                   # Entry point
├── rede/
│   └── Dispositivo-Rede/
│       └── server.js             # Servidor de ping
├── .env.example                  # Exemplo de variáveis
├── NETWORK_SETUP.md              # Guia de configuração de rede
└── README.md                     # Este arquivo
```

## ⚙️ Configuração

### Design System

O sistema utiliza um design system customizado com as cores do Assaí:

- **Primária**: `#0055A5` (Azul Assaí)
- **Secundária**: `#FF6600` (Laranja Assaí)

Todas as variáveis CSS estão definidas em `src/assets/styles/variables.css`

### Categorias de Dispositivos

O sistema suporta as seguintes categorias:

- **PDV**: CPU, Monitor, Pinpad, Impressora, Scanner, Teclado, Balança
- **Balança**: Checkout, Setor
- **Coletor**: RF, Handheld
- **RUBE**: Terminal
- **Computador**: Administrativo, Gerência

## 🔧 Desenvolvimento

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

### Adicionar Novos Componentes

1. Crie o componente em `src/components/common/`
2. Use CSS puro com as variáveis do design system
3. Importe e use nos views conforme necessário

### Adicionar Novas Páginas

1. Crie o componente em `src/views/`
2. Adicione a rota em `src/router/index.js`
3. A página aparecerá automaticamente no menu lateral

## 📚 Documentação Adicional

- [Configuração do Monitor de Rede](./NETWORK_SETUP.md) - Guia detalhado de configuração da verificação via ping

## 🎨 Design

O sistema foi desenvolvido com foco em:

- ✨ Interface limpa e profissional
- 🎨 Cores da marca Assaí
- 📱 100% responsivo
- ⚡ Performance otimizada
- 🚀 Animações suaves
- ♿ Acessibilidade

## 🔐 Segurança

⚠️ **IMPORTANTE**:
- Este sistema foi desenvolvido para uso em **rede interna** apenas
- O servidor de ping NÃO deve ser exposto à internet
- Implemente autenticação antes de usar em produção
- Configure firewall adequadamente

## 🐛 Problemas Conhecidos

### Monitor de Rede não funciona

**Solução**: Verifique se o servidor de ping está rodando:
```bash
cd rede/Dispositivo-Rede
node server.js
```

### Erro de CORS

**Solução**: O servidor já vem com CORS habilitado. Certifique-se que a URL no `.env` está correta.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso interno do Assaí Atacadista.

## 👨‍💻 Desenvolvedor

Desenvolvido por **Maciel Ribeiro**

---

⭐ Se você achou este projeto útil, considere dar uma estrela!
