# Plano: Configurar Git do Zero

## Visão Geral

Configurar o Git globalmente com nome de usuário e e-mail, e inicializar um repositório local no diretório do workspace (`C:/Users/Regiane/.bob/playground`). Nenhum repositório remoto será conectado.

---

## Sub-Tarefa 1 — Configurar identidade global do Git

**Intent:** Definir o nome e e-mail globais que o Git usará para assinar commits nesta máquina.

**Expected Outcomes:**
- `git config --global user.name` retorna `Regiane`
- `git config --global user.email` retorna `regiane.rkc@gmail.com`

**Todo List:**
- [ ] Executar `git config --global user.name "Regiane"`
- [ ] Executar `git config --global user.email "regiane.rkc@gmail.com"`
- [ ] Verificar com `git config --global --list`

**Relevant Context:**
- Configurações globais ficam em `~/.gitconfig` (ou `C:/Users/Regiane/.gitconfig`)
- A flag `--global` aplica a todos os repositórios da máquina

**Status:** `[ ] pending`

---

## Sub-Tarefa 2 — Inicializar repositório local

**Intent:** Criar o repositório Git local no diretório do workspace, gerando a pasta `.git` que habilita o controle de versão.

**Expected Outcomes:**
- Pasta `.git` criada em `C:/Users/Regiane/.bob/playground`
- `git status` executado com sucesso no diretório

**Todo List:**
- [ ] Navegar até `C:/Users/Regiane/.bob/playground`
- [ ] Executar `git init`
- [ ] Verificar com `git status`

**Relevant Context:**
- Diretório alvo: `C:/Users/Regiane/.bob/playground`
- Nenhum remote será adicionado
- Arquivos existentes (`hello-world-plan.md`) ficarão como "untracked" até serem adicionados ao stage

**Status:** `[ ] pending`

---

## Sub-Tarefa 3 — Commit inicial (opcional)

**Intent:** Fazer o primeiro commit com os arquivos existentes no workspace, registrando o estado inicial do repositório.

**Expected Outcomes:**
- `git log` mostra um commit inicial com a mensagem "Initial commit"

**Todo List:**
- [ ] Executar `git add .` para adicionar todos os arquivos ao stage
- [ ] Executar `git commit -m "Initial commit"`
- [ ] Verificar com `git log --oneline`

**Relevant Context:**
- Arquivos existentes no workspace: `hello-world-plan.md`
- Esta sub-tarefa é opcional — só executa se o usuário confirmar

**Status:** `[ ] pending`
