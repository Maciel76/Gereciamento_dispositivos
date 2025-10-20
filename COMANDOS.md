# 🚀 Comandos Disponíveis

## Desenvolvimento

### ✨ Comando Principal (RECOMENDADO)

```bash
npm run dev
```

**Este comando executa TUDO que você precisa:**
- ✅ Frontend Vue (http://localhost:5173)
- ✅ Servidor de Ping (http://localhost:3000)

Ambos rodam simultaneamente em um único terminal com cores diferentes para facilitar a visualização!

---

### 🔧 Comandos Individuais

Se por algum motivo precisar rodar separadamente:

#### Apenas Frontend
```bash
npm run dev:frontend
```

#### Apenas Servidor de Ping
```bash
npm run dev:server
```

---

## Produção

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

---

## 📊 Visualização no Terminal

Quando você executar `npm run dev`, verá algo assim:

```
[FRONTEND] VITE v7.1.12  ready in 612 ms
[FRONTEND] ➜  Local:   http://localhost:5173/
[SERVER]   Servidor rodando em http://localhost:3000
```

- **[FRONTEND]** em **AZUL** = Logs do Vue/Vite
- **[SERVER]** em **VERDE** = Logs do servidor de ping

---

## 🛑 Para Parar os Servidores

Pressione `Ctrl + C` no terminal e ambos os servidores serão encerrados automaticamente.

---

## 💡 Dicas

1. **Use sempre `npm run dev`** - É mais fácil e garante que tudo está rodando
2. **Primeiro acesso pode demorar** - O Vite compila na primeira vez
3. **Hot Reload automático** - Mudanças no código atualizam automaticamente
4. **Erros aparecem coloridos** - Facilita identificar se é frontend ou backend

---

## 🐛 Troubleshooting

### Porta em uso
Se aparecer erro de porta em uso:

**Windows:**
```bash
# Matar processo na porta 5173 (Frontend)
npx kill-port 5173

# Matar processo na porta 3000 (Servidor)
npx kill-port 3000
```

**Linux/Mac:**
```bash
lsof -ti:5173 | xargs kill
lsof -ti:3000 | xargs kill
```

### Concurrently não encontrado
```bash
npm install
```

---

Desenvolvido com ❤️ por Maciel Ribeiro
