# 🚀 DIO Explorer MCP Server

Servidor MCP (Model Context Protocol) do **Projeto Final Dio Explorer**.
Expõe as trilhas, desafios e certificados da DIO via protocolo MCP para integração com o Bob e outros clientes MCP.

---

## 📁 Estrutura

```
MCP/
├── src/
│   └── index.ts          ← Código-fonte principal do servidor
├── build/                ← Compilado gerado pelo tsc (criado após npm run build)
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Pré-requisitos

- **Node.js** ≥ 18.0.0 — [Download](https://nodejs.org)
- **npm** ≥ 9.0.0 (já incluído com Node.js)

---

## 🔧 Instalação e Build

```bash
# 1. Entre na pasta MCP
cd "Projeto Final Dio Explorer/MCP"

# 2. Instale as dependências
npm install

# 3. Compile o TypeScript
npm run build

# 4. Confirme que o build foi gerado
ls build/index.js
```

---

## ▶️ Execução Local (stdio)

```bash
node build/index.js
```

O servidor inicia no modo **stdio** — ideal para integração direta com o Bob como MCP local.

---

## 🔌 Registro no Bob (mcp.json)

Após o build, o servidor já estará registrado automaticamente em `.bob/mcp.json`.

Para verificar ou registrar manualmente, adicione ao arquivo `.bob/mcp.json` do workspace:

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["CAMINHO_ABSOLUTO/Projeto Final Dio Explorer/MCP/build/index.js"]
    }
  }
}
```

> Substitua `CAMINHO_ABSOLUTO` pelo caminho real do workspace.
> No Windows: `C:/Users/Regiane/.bob/playground`

---

## 🛠️ Tools disponíveis

| Tool | Descrição | Parâmetros |
|------|-----------|------------|
| `buscar_trilha` | Busca trilhas por tecnologia, retorna plano de estudos completo | `tecnologia: string` |
| `listar_trilhas` | Lista todas as trilhas com filtro por nível e promoção | `nivel`, `apenas_com_promocao` |
| `gerar_desafio` | Gera desafio de código por tecnologia e nível | `tecnologia`, `nivel` |
| `gerar_certificado` | Gera certificado fictício com ID único, carga horária e XP | `nome_aluno`, `nome_trilha` |

---

## 💬 Exemplos de uso no Bob

Após o servidor estar registrado e conectado, você pode pedir diretamente no chat:

```
Busque trilhas de Java usando a tool buscar_trilha
Liste todas as trilhas Avançadas usando listar_trilhas
Gere um desafio de Python Avançado usando gerar_desafio
Gere meu certificado: nome_aluno=Regiane, nome_trilha=Fullstack Java
```

---

## 🌐 Modo HTTP (acesso remoto / API)

Para expor o servidor via HTTP (acesso por URL, ideal para equipes remotas):

### 1. Instale a dependência extra

```bash
npm install @modelcontextprotocol/sdk
```

### 2. Modifique o transporte em `src/index.ts`

Substitua o bloco `main()` por:

```typescript
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";

async function main(): Promise<void> {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const httpServer = createServer(async (req, res) => {
    await transport.handleRequest(req, res);
  });
  await server.connect(transport);
  const PORT = process.env.PORT ?? 3333;
  httpServer.listen(PORT, () => {
    console.error(`[DIO Explorer MCP] HTTP Server rodando em http://localhost:${PORT}`);
  });
}
```

### 3. Registre no Bob com URL

```json
{
  "mcpServers": {
    "dio-explorer-remote": {
      "url": "http://localhost:3333/mcp"
    }
  }
}
```

---

## 🔒 Segurança (para produção)

- Adicione autenticação via header `Authorization` no transporte HTTP
- Use HTTPS com certificado TLS (via nginx, Caddy ou Let's Encrypt)
- Defina a variável `PORT` no ambiente para configurar a porta
- Nunca exponha o servidor publicamente sem autenticação

---

## 🧪 Dados

O servidor lê os dados em tempo real de:
```
Projeto Final Dio Explorer/data/trilhas.dio.json
```
Qualquer atualização no JSON é refletida imediatamente nas próximas chamadas de tool.

---

## 📜 Licença

MIT — Projeto fictício educacional DIO Explorer.
