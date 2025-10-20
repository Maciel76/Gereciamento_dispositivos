# 🌐 Configuração do Monitor de Rede

Este documento explica como configurar o sistema de verificação de rede via ping.

## 📋 Requisitos

- Node.js instalado
- Biblioteca `ping` para Node.js

## 🚀 Configuração do Servidor de Ping

O sistema utiliza um servidor backend Node.js com Express para fazer a verificação de ping nos dispositivos.

### 1. Navegar até a pasta do servidor

```bash
cd rede/Dispositivo-Rede
```

### 2. Instalar dependências (se necessário)

```bash
npm install
```

As dependências necessárias são:
- `express` - Framework web
- `ping` - Biblioteca para fazer ping
- `cors` - Permitir requisições do frontend

### 3. Iniciar o servidor

```bash
node server.js
```

O servidor estará rodando em: `http://localhost:3000`

Você verá a mensagem:
```
Servidor rodando em http://localhost:3000
```

## ⚙️ Configuração do Frontend

### 1. Criar arquivo .env na raiz do projeto

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 2. Configurar a URL da API

Edite o arquivo `.env` e certifique-se que a URL está correta:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Reiniciar o servidor de desenvolvimento Vue

```bash
npm run dev
```

## 🔧 Como Usar

### Verificação Individual

1. Acesse a página **Monitor de Rede** no menu lateral
2. Clique no botão **"Ping"** ao lado do dispositivo que deseja verificar
3. O status será atualizado automaticamente

### Verificação por Categoria

1. Na página Monitor de Rede, use os botões de filtro por categoria
2. Clique na categoria desejada (PDV, Balanças, Coletores, etc)
3. Todos os dispositivos daquela categoria serão verificados

### Verificação Geral

1. Clique no botão **"Verificar Todos"** no topo da página
2. Todos os dispositivos com IP serão verificados simultaneamente
3. O status de cada um será atualizado na tabela

## 📊 Interpretação dos Resultados

- 🟢 **Status Online (Verde)**: Dispositivo respondeu ao ping
- 🔴 **Status Offline (Vermelho)**: Dispositivo não respondeu ao ping
- ⏳ **Verificando**: Verificação em andamento

## 🛠️ Resolução de Problemas

### Erro: "Erro ao verificar dispositivos"

**Causa**: O servidor de ping não está rodando

**Solução**:
1. Abra um novo terminal
2. Navegue até `rede/Dispositivo-Rede`
3. Execute `node server.js`

### Erro de CORS

**Causa**: Configuração incorreta do CORS

**Solução**: Certifique-se que o servidor está configurado com CORS habilitado (já vem por padrão no server.js)

### Dispositivos sempre aparecem como offline

**Causas possíveis**:
1. Firewall bloqueando ping
2. IP incorreto cadastrado
3. Dispositivo realmente offline

**Solução**:
1. Verifique se o IP está correto
2. Teste o ping manualmente no terminal: `ping IP_DO_DISPOSITIVO`
3. Verifique configurações de firewall

## 🔐 Segurança

⚠️ **IMPORTANTE**: O servidor de ping deve ser usado apenas em redes internas/privadas. Não exponha este servidor na internet sem adicionar camadas de segurança adequadas (autenticação, rate limiting, etc).

## 📝 Estrutura da API

### POST /verificar

**Request Body:**
```json
{
  "ips": ["192.168.1.1", "192.168.1.2", "192.168.1.3"]
}
```

**Response:**
```json
[
  { "ip": "192.168.1.1", "status": "success" },
  { "ip": "192.168.1.2", "status": "fail" },
  { "ip": "192.168.1.3", "status": "success" }
]
```

- **status: "success"** = Dispositivo online (ping bem-sucedido)
- **status: "fail"** = Dispositivo offline (ping falhou)

## 🚀 Melhorias Futuras

- [ ] Adicionar timeout configurável para ping
- [ ] Implementar histórico de status
- [ ] Adicionar notificações quando dispositivo fica offline
- [ ] Implementar verificação automática em intervalos
- [ ] Adicionar gráficos de disponibilidade

## 💡 Dicas

1. **Organize seus dispositivos**: Use nomes descritivos para facilitar identificação
2. **Mantenha IPs atualizados**: Sempre que trocar um dispositivo, atualize o IP no sistema
3. **Verificações regulares**: Configure verificações periódicas para monitoramento proativo
