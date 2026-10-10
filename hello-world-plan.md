# Plano: Criar arquivo COBOL Hello World

## Visão Geral

Criar um arquivo COBOL (`hello-world.cbl`) que define um parágrafo chamado `HELLO-WORLD` e o executa via `PERFORM`, exibindo a mensagem "Hello, World!" na tela.

---

## Sub-Tarefa 1 — Criar o arquivo `hello-world.cbl`

**Intent:** Criar o programa COBOL com a estrutura mínima necessária e um parágrafo chamado `HELLO-WORLD` que exibe a mensagem.

**Expected Outcomes:**
- Arquivo `hello-world.cbl` criado na raiz do workspace
- O código segue a estrutura COBOL padrão (IDENTIFICATION, DATA, PROCEDURE DIVISIONS)
- O parágrafo `HELLO-WORLD` é chamado via `PERFORM` no corpo principal

**Todo List:**
- [ ] Criar o arquivo `hello-world.cbl` com o seguinte conteúdo:

```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-WORLD-PROGRAM.

       DATA DIVISION.

       PROCEDURE DIVISION.

           PERFORM HELLO-WORLD
           STOP RUN.

       HELLO-WORLD.
           DISPLAY "Hello, World!".
```

**Relevant Context:**
- Arquivo a criar: `hello-world.cbl`
- Estrutura COBOL: colunas 7-72 (indentação de 7 espaços é obrigatória)
- `PERFORM HELLO-WORLD` chama o parágrafo como uma função
- `DISPLAY` imprime na saída padrão
- `STOP RUN` encerra o programa

**Status:** `[ ] pending`

---

## Sub-Tarefa 2 — Instruções para executar o código

**Intent:** Como não há compilador COBOL local, orientar sobre como executar o arquivo online.

**Expected Outcomes:**
- Usuário consegue ver o resultado `Hello, World!` executando o código

**Opções para executar online (sem instalação):**

### Opção A — JDoodle (recomendado)
1. Acesse: https://www.jdoodle.com/execute-cobol-online/
2. Cole o conteúdo do arquivo `hello-world.cbl`
3. Clique em **Execute**
4. Resultado esperado: `Hello, World!`

### Opção B — OneCompiler
1. Acesse: https://onecompiler.com/cobol
2. Substitua o código pelo conteúdo do arquivo
3. Clique em **Run**
4. Resultado esperado: `Hello, World!`

### Opção C — Instalar GnuCOBOL localmente (Windows)
1. Baixe o instalador em: https://gnucobol.sourceforge.io/
2. Após instalar, execute no PowerShell:
   ```powershell
   cobc -x hello-world.cbl -o hello-world.exe
   ./hello-world.exe
   ```
3. Resultado esperado: `Hello, World!`

**Status:** `[ ] pending`
