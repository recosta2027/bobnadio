#!/usr/bin/env node
/**
 * DIO Explorer MCP Server
 * ─────────────────────────────────────────────
 * Expõe as trilhas, desafios e certificados do
 * Projeto Final Dio Explorer via protocolo MCP.
 *
 * Tools disponíveis:
 *   - buscar_trilha       : busca trilhas por tecnologia
 *   - listar_trilhas      : lista todas as trilhas disponíveis
 *   - gerar_desafio       : gera desafio de código por tecnologia e nível
 *   - gerar_certificado   : gera certificado fictício para o aluno
 *
 * Transporte: stdio (padrão MCP local) ou HTTP (para acesso remoto)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ─────────────────────────────────────────────
// CAMINHO DO JSON DE TRILHAS
// ─────────────────────────────────────────────
const __dirname  = dirname(fileURLToPath(import.meta.url));
const TRILHAS_PATH = join(__dirname, "..", "..", "data", "trilhas.dio.json");

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────
interface Promocao {
  ativa: boolean;
  desconto_percentual: number;
  validade: string | null;
}

interface LivesAoVivo {
  disponiveis: boolean;
  frequencia: string | null;
  proxima_live: string | null;
}

interface Trilha {
  id: number;
  nome: string;
  tecnologia: string[];
  nivel: "Iniciante" | "Intermediário" | "Avançado";
  numero_de_modulos: number;
  xp_total: number;
  beds_disponiveis: number;
  promocao: Promocao;
  vitalicio: boolean;
  lives_ao_vivo: LivesAoVivo;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function carregarTrilhas(): Trilha[] {
  try {
    const raw = readFileSync(TRILHAS_PATH, "utf-8");
    return JSON.parse(raw) as Trilha[];
  } catch {
    console.error("[DIO MCP] Erro ao carregar trilhas.dio.json:", TRILHAS_PATH);
    return [];
  }
}

function buscarPorTecnologia(trilhas: Trilha[], tecnologia: string): Trilha[] {
  const termo = tecnologia.toLowerCase();
  return trilhas.filter(t =>
    t.tecnologia.some(tech => tech.toLowerCase().includes(termo))
  );
}

function formatarDataLive(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo"
  });
}

function gerarIdCertificado(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "DIO-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function xpPorNivel(nivel: string): number {
  if (nivel.toLowerCase().includes("iniciante"))    return 1500;
  if (nivel.toLowerCase().includes("intermedi"))    return 3000;
  if (nivel.toLowerCase().includes("avan"))         return 5000;
  return 3000;
}

// ─────────────────────────────────────────────
// SERVIDOR MCP
// ─────────────────────────────────────────────
const server = new McpServer({
  name: "dio-explorer-mcp-server",
  version: "1.0.0",
});

// ════════════════════════════════════════════
// TOOL 1 — buscar_trilha
// ════════════════════════════════════════════
server.registerTool(
  "buscar_trilha",
  {
    description:
      "Busca trilhas de estudo da DIO por tecnologia. Retorna plano de estudos completo com módulos, XP, promoções e lives.",
    inputSchema: z.object({
      tecnologia: z.string().describe(
        "Nome da tecnologia a buscar (ex: Java, Python, React, Docker, AWS)"
      ),
    }),
  },
  async ({ tecnologia }) => {
    const trilhas  = carregarTrilhas();
    const encontradas = buscarPorTecnologia(trilhas, tecnologia);

    if (encontradas.length === 0) {
      return {
        content: [{
          type: "text",
          text: `❌ Nenhuma trilha encontrada para "${tecnologia}".\n\nTecnologias disponíveis: Java, Python, React, Angular, Docker, AWS, Azure, GCP, Flutter, Kotlin, TypeScript, Node.js, Vue.js, SQL, MongoDB, Linux, Figma, Power BI, Unity, Blockchain, LangChain.`,
        }],
        isError: false,
      };
    }

    const linhas: string[] = [];
    linhas.push(`# 📚 Trilhas encontradas para "${tecnologia}"\n`);
    linhas.push(`**${encontradas.length} trilha(s) encontrada(s)**\n`);
    linhas.push("---");

    for (const t of encontradas) {
      linhas.push(`\n## ${t.nome}`);
      linhas.push(`- **Nível:** ${t.nivel}`);
      linhas.push(`- **Tecnologias:** ${t.tecnologia.join(", ")}`);
      linhas.push(`- **Módulos:** ${t.numero_de_modulos}`);
      linhas.push(`- **XP Total:** ${t.xp_total.toLocaleString("pt-BR")} XP`);
      linhas.push(`- **Vitalício:** ${t.vitalicio ? "✅ Sim" : "❌ Não"}`);
      linhas.push(`- **Vagas:** ${t.beds_disponiveis}`);

      if (t.promocao.ativa) {
        linhas.push(`\n> 🔥 **Promoção:** ${t.promocao.desconto_percentual}% de desconto | Válido até ${t.promocao.validade}`);
      }

      if (t.lives_ao_vivo.disponiveis && t.lives_ao_vivo.proxima_live) {
        linhas.push(`\n📡 **Live:** ${t.lives_ao_vivo.frequencia} | Próxima: ${formatarDataLive(t.lives_ao_vivo.proxima_live)}`);
      }

      linhas.push("\n### Módulos da Trilha");
      const xpPorModulo = Math.round(t.xp_total / t.numero_de_modulos);
      for (let i = 1; i <= t.numero_de_modulos; i++) {
        linhas.push(`${i}. Módulo ${i} — ${t.tecnologia[i % t.tecnologia.length]} na prática (~${xpPorModulo} XP)`);
      }
      linhas.push("\n---");
    }

    return { content: [{ type: "text", text: linhas.join("\n") }] };
  }
);

// ════════════════════════════════════════════
// TOOL 2 — listar_trilhas
// ════════════════════════════════════════════
server.registerTool(
  "listar_trilhas",
  {
    description:
      "Lista todas as trilhas disponíveis na DIO. Permite filtrar por nível (Iniciante, Intermediário, Avançado) ou listar todas.",
    inputSchema: z.object({
      nivel: z
        .enum(["Todos", "Iniciante", "Intermediário", "Avançado"])
        .default("Todos")
        .describe("Filtrar por nível (padrão: Todos)"),
      apenas_com_promocao: z
        .boolean()
        .default(false)
        .describe("Mostrar apenas trilhas com promoção ativa"),
    }),
  },
  async ({ nivel, apenas_com_promocao }) => {
    const trilhas = carregarTrilhas();

    let filtradas = nivel === "Todos"
      ? trilhas
      : trilhas.filter(t => t.nivel === nivel);

    if (apenas_com_promocao) {
      filtradas = filtradas.filter(t => t.promocao.ativa);
    }

    if (filtradas.length === 0) {
      return {
        content: [{ type: "text", text: "Nenhuma trilha encontrada com os filtros aplicados." }],
      };
    }

    const linhas: string[] = [];
    linhas.push(`# 📋 Trilhas DIO — ${nivel}${apenas_com_promocao ? " (com promoção)" : ""}`);
    linhas.push(`\n**${filtradas.length} trilha(s) disponível(eis)**\n`);
    linhas.push("| # | Nome | Nível | Módulos | XP | Promoção | Vitalício |");
    linhas.push("|---|------|-------|---------|-----|----------|-----------|");

    for (const t of filtradas) {
      const promo = t.promocao.ativa ? `${t.promocao.desconto_percentual}% OFF` : "—";
      const vit   = t.vitalicio ? "✅" : "❌";
      linhas.push(`| ${t.id} | ${t.nome} | ${t.nivel} | ${t.numero_de_modulos} | ${t.xp_total.toLocaleString("pt-BR")} | ${promo} | ${vit} |`);
    }

    return { content: [{ type: "text", text: linhas.join("\n") }] };
  }
);

// ════════════════════════════════════════════
// TOOL 3 — gerar_desafio
// ════════════════════════════════════════════
server.registerTool(
  "gerar_desafio",
  {
    description:
      "Gera um desafio de código DIO aleatório baseado na tecnologia e nível escolhidos pelo usuário.",
    inputSchema: z.object({
      tecnologia: z.string().describe("Tecnologia do desafio (ex: Java, Python, React)"),
      nivel: z
        .enum(["Iniciante", "Intermediário", "Avançado"])
        .default("Intermediário")
        .describe("Nível de dificuldade do desafio"),
    }),
  },
  async ({ tecnologia, nivel }) => {
    const xp        = xpPorNivel(nivel);
    const trilhas   = carregarTrilhas();
    const trilhaRef = buscarPorTecnologia(trilhas, tecnologia)[0];

    const contextos: Record<string, string> = {
      Iniciante:    "Uma startup de tecnologia precisa de uma solução simples e funcional. Seu papel é criar um programa que resolva o problema com lógica clara e código limpo.",
      Intermediário: "Uma empresa de médio porte está modernizando seu sistema legado. Você foi contratado para implementar uma solução usando boas práticas e o framework escolhido.",
      Avançado:     "Uma grande empresa de tecnologia está enfrentando problemas de performance e escalabilidade. Você precisa projetar e implementar uma solução robusta, segura e escalável.",
    };

    const linhas: string[] = [];
    linhas.push(`# ⚔️ Desafio DIO — Sistema de Gestão com ${tecnologia}`);
    linhas.push(`\n## 📋 Informações`);
    linhas.push(`| Campo | Valor |`);
    linhas.push(`|-------|-------|`);
    linhas.push(`| **Tecnologia** | ${tecnologia} |`);
    linhas.push(`| **Nível** | ${nivel} |`);
    linhas.push(`| **XP ao Concluir** | ${xp.toLocaleString("pt-BR")} XP |`);
    linhas.push(`| **Tempo Estimado** | ${nivel === "Iniciante" ? "1-2h" : nivel === "Intermediário" ? "3-5h" : "6-10h"} |`);
    if (trilhaRef) {
      linhas.push(`| **Trilha Relacionada** | ${trilhaRef.nome} |`);
    }

    linhas.push(`\n## 🌍 Contexto\n${contextos[nivel] ?? contextos["Intermediário"]}`);

    linhas.push(`\n## 🎯 Objetivo`);
    linhas.push(`Desenvolva uma aplicação ${nivel === "Iniciante" ? "de console" : "web/API"} utilizando ${tecnologia} que gerencie um recurso de negócio com operações CRUD completas.`);

    linhas.push(`\n## 📌 Requisitos Funcionais`);
    const requisitos = nivel === "Iniciante"
      ? ["Criar itens com validação básica", "Listar todos os itens", "Buscar item por ID", "Deletar item por ID"]
      : nivel === "Intermediário"
      ? ["Implementar API REST com endpoints CRUD", "Validar entradas com mensagens de erro claras", "Persistir dados em banco de dados", "Implementar paginação na listagem", "Adicionar autenticação básica"]
      : ["Arquitetura em camadas (Controller/Service/Repository)", "Autenticação JWT com refresh token", "Cache de respostas frequentes", "Testes unitários com cobertura ≥ 80%", "Documentação da API (Swagger/OpenAPI)", "Deploy containerizado com Docker"];

    for (const r of requisitos) {
      linhas.push(`- [ ] ${r}`);
    }

    linhas.push(`\n## 🧪 Critérios de Aceitação`);
    linhas.push(`- [ ] Todos os endpoints/funções retornam o resultado esperado`);
    linhas.push(`- [ ] Entradas inválidas são tratadas com mensagens claras`);
    linhas.push(`- [ ] O código segue as boas práticas de ${tecnologia}`);
    if (nivel !== "Iniciante") {
      linhas.push(`- [ ] Os testes passam com cobertura ≥ 70%`);
    }

    linhas.push(`\n## 💡 Dicas`);
    linhas.push(`- Comece pela estrutura de dados antes de implementar a lógica`);
    linhas.push(`- Use nomes descritivos para variáveis e funções`);
    linhas.push(`- Escreva os testes junto com o código, não depois`);
    if (nivel === "Avançado") {
      linhas.push(`- Aplique SOLID e Design Patterns onde fizer sentido`);
    }

    linhas.push(`\n## 📦 Entregável`);
    linhas.push(`Repositório público no GitHub com README detalhado, instruções de instalação e execução.`);

    linhas.push(`\n---\n🚀 **Bora codar!** Você consegue! — _Digital Innovation One_`);

    return { content: [{ type: "text", text: linhas.join("\n") }] };
  }
);

// ════════════════════════════════════════════
// TOOL 4 — gerar_certificado
// ════════════════════════════════════════════
server.registerTool(
  "gerar_certificado",
  {
    description:
      "Gera um certificado fictício de conclusão de trilha DIO em Markdown, com nome do aluno, XP, carga horária e ID único.",
    inputSchema: z.object({
      nome_aluno: z.string().describe("Nome completo do aluno"),
      nome_trilha: z.string().describe("Nome da trilha concluída"),
    }),
  },
  async ({ nome_aluno, nome_trilha }) => {
    const trilhas = carregarTrilhas();
    const trilha  = trilhas.find(t =>
      t.nome.toLowerCase().includes(nome_trilha.toLowerCase())
    ) ?? trilhas.find(t =>
      t.tecnologia.some(tech => tech.toLowerCase().includes(nome_trilha.toLowerCase()))
    );

    const modulos   = trilha?.numero_de_modulos ?? 10;
    const xp        = trilha?.xp_total          ?? 15000;
    const nivel     = trilha?.nivel              ?? "Intermediário";
    const techs     = trilha?.tecnologia         ?? [nome_trilha];
    const nomeTrilhaFinal = trilha?.nome         ?? nome_trilha;

    const cargaHoraria = modulos * 8;
    const idCert       = gerarIdCertificado();
    const hoje         = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo"
    });

    const barras: Record<string, string> = {
      Iniciante:    "[████████░░░░░░░░░░░░] 40%",
      Intermediário:"[█████████████░░░░░░░] 65%",
      Avançado:     "[████████████████████] 100%",
    };

    const cert = [
      `<div align="center">`,
      ``,
      `# 🎓 CERTIFICADO DE CONCLUSÃO`,
      ``,
      `---`,
      ``,
      `**Digital Innovation One — DIO**`,
      `*Plataforma de Educação em Tecnologia*`,
      ``,
      `---`,
      ``,
      `## Este certificado é conferido a`,
      ``,
      `# ${nome_aluno.toUpperCase()}`,
      ``,
      `pela conclusão com êxito da trilha de conhecimento:`,
      ``,
      `## "${nomeTrilhaFinal}"`,
      ``,
      `---`,
      ``,
      `| 📅 Data de Emissão | 🆔 ID do Certificado | ⏱️ Carga Horária | ⚡ XP Conquistado |`,
      `|---|---|---|---|`,
      `| ${hoje} | ${idCert} | ${cargaHoraria}h | ${xp.toLocaleString("pt-BR")} XP |`,
      ``,
      `---`,
      ``,
      `### 🛠️ Tecnologias Dominadas`,
      techs.map(t => `\`${t}\``).join(" · "),
      ``,
      `---`,
      ``,
      `### 📊 Nível de Proficiência Alcançado`,
      ``,
      `\`${barras[nivel] ?? barras["Intermediário"]}\``,
      ``,
      `---`,
      ``,
      `> *"A jornada de aprendizado nunca termina. Este certificado marca uma conquista,*`,
      `> *não um fim. Continue explorando, construindo e inovando."*`,
      `>`,
      `> — **Digital Innovation One**`,
      ``,
      `---`,
      ``,
      `✅ **Certificado Válido** | 🌐 dio.me | 📧 contato@dio.me`,
      ``,
      `*Certificado fictício gerado pelo DIO Explorer MCP Server.*`,
      ``,
      `</div>`,
      ``,
      `---`,
      ``,
      `> 🎉 Parabéns, **${nome_aluno}**! Certificado \`${idCert}\` emitido com sucesso.`,
    ];

    return { content: [{ type: "text", text: cert.join("\n") }] };
  }
);

// ─────────────────────────────────────────────
// MAIN — conecta o transporte stdio
// ─────────────────────────────────────────────
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[DIO Explorer MCP] Server running on stdio — v1.0.0");
  console.error("[DIO Explorer MCP] Tools: buscar_trilha | listar_trilhas | gerar_desafio | gerar_certificado");
}

main().catch((error: unknown) => {
  console.error("[DIO Explorer MCP] Fatal error:", error);
  process.exit(1);
});
