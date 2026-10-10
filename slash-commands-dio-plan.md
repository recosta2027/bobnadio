# Plano: Slash Commands DIO Explorer

## Visão Geral

Criar três slash commands personalizados para o projeto **Projeto Final Dio Explorer**, todos armazenados em `.bob/commands/` (escopo do workspace). Cada comando é um arquivo `.md` com frontmatter e um prompt instrucional que orienta o Bob a executar a tarefa desejada.

Os comandos são:
- **`/trilha`** — recebe uma tecnologia e gera um plano de estudos baseado no `trilhas.dio.json`
- **`/desafio`** — gera um desafio de código aleatório baseado em nível e tecnologia escolhidos
- **`/certificado`** — gera um certificado fictício em Markdown com nome do usuário e trilha concluída

---

## Sub-Tarefa 1 — Criar o comando `/trilha`

**Intent:** O comando lê o arquivo `trilhas.dio.json`, localiza a trilha que corresponde à tecnologia informada e retorna um plano de estudos estruturado com os módulos, XP, nível e informações da trilha.

**Expected Outcomes:**
- Arquivo `.bob/commands/trilha.md` existe no workspace.
- Ao digitar `/trilha JavaScript`, o Bob retorna um plano de estudos detalhado da trilha correspondente.

**Todo List:**
- [x] Criar a pasta `.bob/commands/` na raiz do workspace
- [x] Criar `.bob/commands/trilha.md` com frontmatter (description, argument-hint) e prompt instrucional que orienta o Bob a: ler o arquivo `Projeto Final Dio Explorer/data/trilhas.dio.json`, localizar a trilha pela tecnologia informada e gerar um plano de estudos em Markdown com seções de módulos, objetivos e XP

**Relevant Context:**
- Fonte de dados: `Projeto Final Dio Explorer/data/trilhas.dio.json`
- Padrão de comando: `.bob/commands/trilha.md` → `/trilha`
- Frontmatter suportado: `description`, `argument-hint`

**Status:** `[x] done`

---

## Sub-Tarefa 2 — Criar o comando `/desafio`

**Intent:** O comando recebe uma tecnologia e nível do usuário e gera um desafio de código fictício e didático, adequado ao nível (Iniciante, Intermediário, Avançado), com enunciado, requisitos e dicas.

**Expected Outcomes:**
- Arquivo `.bob/commands/desafio.md` existe no workspace.
- Ao digitar `/desafio Python Avançado`, o Bob gera um desafio de código completo e contextualizado.

**Todo List:**
- [x] Criar `.bob/commands/desafio.md` com frontmatter e prompt instrucional que orienta o Bob a gerar um desafio de código com: enunciado, contexto fictício da DIO, requisitos técnicos, critérios de aceitação e dicas baseados no nível e tecnologia fornecidos

**Relevant Context:**
- Padrão de comando: `.bob/commands/desafio.md` → `/desafio`
- O prompt deve referenciar os níveis possíveis: Iniciante, Intermediário, Avançado

**Status:** `[x] done`

---

## Sub-Tarefa 3 — Criar o comando `/certificado`

**Intent:** O comando recebe o nome do usuário e o nome da trilha concluída e gera um certificado fictício completo em Markdown, com visual estruturado, data de emissão, ID fictício e assinatura da DIO.

**Expected Outcomes:**
- Arquivo `.bob/commands/certificado.md` existe no workspace.
- Ao digitar `/certificado Regiane React.js`, o Bob gera um certificado formatado em Markdown pronto para leitura.

**Todo List:**
- [x] Criar `.bob/commands/certificado.md` com frontmatter e prompt instrucional que orienta o Bob a gerar um certificado em Markdown com: título, nome do aluno, nome da trilha, carga horária, data de emissão, ID de certificado fictício, XP conquistado e assinatura fictícia da DIO

**Relevant Context:**
- Padrão de comando: `.bob/commands/certificado.md` → `/certificado`
- O certificado deve ser puramente fictício e decorativo, formatado em Markdown

**Status:** `[x] done`
