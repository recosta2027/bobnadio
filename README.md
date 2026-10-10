# 🌍 DIO Explorer — Projeto Final

> Integração entre o assistente de IA **IBM Bob** e a plataforma **Digital Innovation One**, construída com TypeScript, MCP Server e Slash Commands personalizados.

---

## 📌 O que é o DIO Explorer?

O **DIO Explorer** é uma plataforma educacional interativa que conecta o assistente IBM Bob às trilhas de aprendizado da DIO (Digital Innovation One).

Com ele é possível:

- 🔍 **Buscar trilhas** de estudo por tecnologia (Java, Python, React, Docker, AWS e muito mais)
- ⚔️ **Gerar desafios de código** personalizados por nível (Iniciante, Intermediário, Avançado)
- 🎓 **Emitir certificados fictícios** de conclusão de trilha com ID único, XP e carga horária
- 📋 **Listar todas as trilhas** com filtros de nível e promoções ativas

O projeto é composto por três camadas:

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Dados** | JSON | `trilhas.dio.json` com 30+ trilhas reais da DIO |
| **Servidor MCP** | TypeScript + Node.js | Expõe 4 tools via protocolo MCP para o Bob |
| **Slash Commands** | Markdown + Prompts | Comandos `/trilha`, `/desafio`, `/certificado` no chat |

---

## 🚀 Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) ≥ 18.0.0
- npm ≥ 9.0.0 (incluído com Node.js)
- [IBM Bob](https://www.ibm.com/products/watsonx-code-assistant) instalado

### 1. Clone o repositório

```bash
git clone https://github.com/recosta2027/bobnadio.git
cd bobnadio
```

### 2. Instale as dependências do servidor MCP

```bash
cd "Projeto Final Dio Explorer/MCP"
npm install
```

### 3. Compile o TypeScript

```bash
npm run build
```

### 4. Verifique o arquivo de registro MCP

O arquivo `.bob/mcp.json` já está configurado. Confirme que o caminho está correto para sua máquina:

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "${workspaceFolder}\\Projeto Final Dio Explorer\\MCP\\build\\index.js"
      ]
    }
  }
}
```

### 5. Abra o workspace no Bob

Abra a pasta raiz do projeto no IBM Bob. O servidor MCP será conectado automaticamente.

---

## 💬 Como usar os comandos

### Slash Commands (no chat do Bob)

Digite diretamente na caixa de chat:

| Comando | Exemplo | O que faz |
|---|---|---|
| `/trilha <tecnologia>` | `/trilha Java` | Gera plano de estudos completo com módulos, XP e lives |
| `/desafio <tecnologia> <nível>` | `/desafio Python Avançado` | Cria um desafio de código com contexto, requisitos e dicas |
| `/certificado <nome> <trilha>` | `/certificado Regiane React.js` | Emite certificado fictício com ID DIO-XXXXXX e carga horária |

> **Dica:** o nível do `/desafio` pode ser `Iniciante`, `Intermediário` ou `Avançado`. Se omitido, assume `Intermediário`.

### MCP Tools (via chat livre)

Após o servidor estar conectado, você também pode pedir de forma natural:

```
Busque trilhas de Docker
Liste todas as trilhas Avançadas com promoção ativa
Gere um desafio de TypeScript nível Intermediário
Gere meu certificado: nome_aluno=Regiane, nome_trilha=Fullstack Java
```

---

## 🧪 Como executar os testes

Os testes são escritos em **JavaScript puro** (Node.js nativo, sem dependências externas) e validam as regras de negócio dos três comandos contra o arquivo `trilhas.dio.json` real.

### Executar

```bash
node "Projeto Final Dio Explorer/testes-dio.js"
```

### Resultado esperado

```
============================================================
  RELATORIO DE TESTES - DIO Explorer Slash Commands
============================================================

  Total de Testes : 29
  Aprovados       : 29
  Reprovados      : 0
  Cobertura       : 100%
  Meta (70%)      : ATINGIDA [OK]
```

O relatório completo é gravado automaticamente em:
```
Projeto Final Dio Explorer/docs/resultados-testes.txt
```

### Suítes de teste

| Suíte | Testes | Cobertura |
|---|---|---|
| `/trilha` | 11 casos | Busca, case-insensitive, XP, promoções, lives |
| `/desafio` | 8 casos | Níveis, tecnologias, XP por nível |
| `/certificado` | 10 casos | Carga horária, ID único, nome em maiúsculas |

---

## ✨ Melhorias realizadas

Durante o desenvolvimento, foram implementadas melhorias além do escopo básico:

1. **`.gitignore` configurado** — `node_modules/` e `build/` excluídos do repositório, mantendo o histórico limpo e o repositório leve.

2. **Busca case-insensitive e parcial** — o comando `/trilha react` encontra `React`, `React Native` e `React.js` sem o usuário precisar digitar o nome exato.

3. **Nível padrão automático** — o `/desafio` assume `Intermediário` automaticamente quando o nível é omitido, evitando erros.

4. **Dados reais e ricos** — o `trilhas.dio.json` contém 30+ trilhas com campos detalhados: promoções com validade, lives ao vivo com data e frequência, acesso vitalício e número de vagas.

5. **Documentação HTML completa** — gerada em `docs/documentacao-projeto.html`, abrível diretamente no navegador sem dependências externas.

6. **Relatório de testes em arquivo** — os resultados são gravados automaticamente em `resultados-testes.txt` a cada execução, criando um histórico auditável.

7. **Modo HTTP documentado** — o `README.md` do servidor MCP inclui instruções para expor o servidor via HTTP para acesso remoto por equipes.

---

## 📚 O que aprendi durante o desafio

Este projeto marcou uma conquista muito especial para mim: **foi o meu primeiro projeto publicado no GitHub**.

Até então, eu nunca tinha subido um repositório. Ver o código aparecer em `github.com/recosta2027/bobnadio` foi uma experiência incrível — mistura de orgulho, emoção e a certeza de que estou no caminho certo.

Ao longo do projeto aprendi na prática:

- **Como usar um assistente de IA como parceiro de desenvolvimento** — o IBM Bob não fez o trabalho por mim, ele me ajudou a construir cada peça com base no que eu pedia. Aprendi que um bom prompt é tão importante quanto um bom código.
- **Como funciona o protocolo MCP** (Model Context Protocol) — uma tecnologia emergente que permite conectar assistentes de IA a ferramentas externas reais, como banco de dados, APIs e servidores.
- **Como criar Slash Commands personalizados** — pequenos arquivos Markdown que ensinam o Bob a executar tarefas complexas com um simples `/trilha Java`.
- **Como escrever testes unitários sem frameworks** — usando apenas o `assert` nativo do Node.js, aprendi que a simplicidade muitas vezes é a melhor escolha.
- **Como usar o Git do zero** — da configuração da identidade global ao primeiro commit, até o push para o repositório remoto.
- **Como organizar um projeto profissional** — estrutura de pastas, separação de responsabilidades, documentação e versionamento.

Para mim, este desafio foi excelente. Cada etapa foi uma descoberta. Chegar ao fim com **29 testes aprovados, cobertura de 100%** e o projeto publicado no GitHub me mostrou que qualquer pessoa pode aprender tecnologia quando tem as ferramentas e a determinação certas.

> *"A jornada de aprendizado nunca termina. Este projeto marca uma conquista, não um fim."*
> — Digital Innovation One

---

## 🗂️ Estrutura do Projeto

```
bobnadio/
├── .bob/
│   ├── commands/
│   │   ├── trilha.md          # Slash command /trilha
│   │   ├── desafio.md         # Slash command /desafio
│   │   └── certificado.md     # Slash command /certificado
│   └── mcp.json               # Registro do servidor MCP
├── Projeto Final Dio Explorer/
│   ├── MCP/
│   │   ├── src/index.ts       # Servidor MCP (TypeScript)
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── data/
│   │   └── trilhas.dio.json   # 30+ trilhas DIO
│   ├── docs/
│   │   ├── documentacao-projeto.html
│   │   └── resultados-testes.txt
│   └── testes-dio.js          # 29 testes unitários
├── .gitignore
└── README.md
```

---

## 🛠️ Stack Tecnológico

| Tecnologia | Uso |
|---|---|
| Node.js ≥ 18 | Runtime do servidor MCP e dos testes |
| TypeScript 5.x | Código-fonte do servidor MCP |
| @modelcontextprotocol/sdk | Protocolo MCP (registerTool, stdio transport) |
| Zod | Validação de schemas das tools |
| JSON | Banco de dados das trilhas |
| IBM Bob | Assistente de IA e cliente MCP |

---

## 📄 Licença

MIT — Projeto educacional fictício desenvolvido como desafio final da DIO.

---

<div align="center">
  Feito com 💜 por <strong>Regiane</strong> em colaboração com <strong>IBM Bob</strong>
</div>
