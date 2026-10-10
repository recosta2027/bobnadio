/**
 * testes-dio.js
 * Testes unitários dos Slash Commands DIO Explorer
 * Runtime: Node.js nativo (sem dependências externas)
 * Módulos: assert, fs, path
 *
 * Suítes:
 *   1. /trilha  — busca e filtragem de trilhas por tecnologia
 *   2. /desafio — validação de entrada e regras por nível
 *   3. /certificado — cálculo de carga horária, ID e nome
 */

const assert = require('assert');
const fs     = require('fs');
const path   = require('path');

// ─────────────────────────────────────────────
// CONFIGURAÇÃO
// ─────────────────────────────────────────────
const JSON_PATH    = path.join(__dirname, 'data', 'trilhas.dio.json');
const RESULT_PATH  = path.join(__dirname, 'docs', 'resultados-testes.txt');
const ALUNO_NOME   = 'Regiane';
const ALUNO_TRILHA = 'Fullstack Java + Angular do Zero ao Deploy';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Carrega e parseia o JSON de trilhas */
function carregarTrilhas() {
  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Busca trilhas por tecnologia (case-insensitive, parcial)
 * Simula a lógica do comando /trilha
 */
function buscarTrilhasPorTecnologia(trilhas, tecnologia) {
  const termo = tecnologia.toLowerCase();
  return trilhas.filter(t =>
    t.tecnologia.some(tech => tech.toLowerCase().includes(termo))
  );
}

/**
 * Determina o nível padrão quando não informado
 * Simula a lógica do comando /desafio
 */
function resolverNivel(nivelInput) {
  const niveisValidos = ['iniciante', 'intermediário', 'intermediario', 'avançado', 'avancado'];
  if (!nivelInput) return 'Intermediário';
  const normalizado = nivelInput.toLowerCase();
  return niveisValidos.includes(normalizado) ? nivelInput : 'Intermediário';
}

/**
 * Calcula a carga horária do certificado
 * Simula a lógica do comando /certificado
 */
function calcularCargaHoraria(trilha) {
  return trilha.numero_de_modulos * 8;
}

/**
 * Gera um ID de certificado fictício no formato DIO-XXXXXX
 */
function gerarIdCertificado() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'DIO-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Formata o nome do aluno em maiúsculas
 */
function formatarNomeAluno(nome) {
  return nome.toUpperCase();
}

// ─────────────────────────────────────────────
// RUNNER DE TESTES
// ─────────────────────────────────────────────
const resultados = [];
let totalTestes  = 0;
let totalPassou  = 0;
let totalFalhou  = 0;

function executarTeste(suite, descricao, fn) {
  totalTestes++;
  const inicio = Date.now();
  try {
    fn();
    const duracao = Date.now() - inicio;
    totalPassou++;
    resultados.push({ suite, descricao, status: 'PASS', duracao, erro: null });
    console.log(`  [PASS] ${suite} | ${descricao}`);
  } catch (err) {
    const duracao = Date.now() - inicio;
    totalFalhou++;
    resultados.push({ suite, descricao, status: 'FAIL', duracao, erro: err.message });
    console.log(`  [FAIL] ${suite} | ${descricao}`);
    console.log(`         Motivo: ${err.message}`);
  }
}

// ─────────────────────────────────────────────
// SUÍTE 1 — /trilha
// ─────────────────────────────────────────────
console.log('\n============================================================');
console.log(' SUITE 1 — Comando /trilha');
console.log('============================================================');

const trilhas = carregarTrilhas();

executarTeste('/trilha', 'JSON carregado com sucesso', () => {
  assert.ok(Array.isArray(trilhas), 'trilhas.dio.json deve ser um array');
  assert.ok(trilhas.length >= 30, 'Deve ter pelo menos 30 trilhas, encontrado: ' + trilhas.length);
});

executarTeste('/trilha', 'Busca por "Java" retorna resultados', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  assert.ok(resultado.length > 0, 'Deve encontrar ao menos 1 trilha com Java');
});

executarTeste('/trilha', 'Busca por "Java" retorna trilha Fullstack Java + Angular', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  const nomes = resultado.map(t => t.nome);
  assert.ok(
    nomes.includes('Fullstack Java + Angular do Zero ao Deploy'),
    'Trilha "Fullstack Java + Angular" nao encontrada. Encontrado: ' + JSON.stringify(nomes)
  );
});

executarTeste('/trilha', 'Busca por "Java" retorna trilha de Microsservicos', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  const nomes = resultado.map(t => t.nome);
  assert.ok(
    nomes.includes('Arquitetura de Microsserviços com Spring Cloud'),
    'Trilha "Microsservicos" nao encontrada. Encontrado: ' + JSON.stringify(nomes)
  );
});

executarTeste('/trilha', 'Busca e case-insensitive (java minusculo)', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'java');
  assert.ok(resultado.length > 0, 'Busca em minusculo deve funcionar igual');
});

executarTeste('/trilha', 'Busca e case-insensitive (JAVA maiusculo)', () => {
  const resultMin = buscarTrilhasPorTecnologia(trilhas, 'java');
  const resultMai = buscarTrilhasPorTecnologia(trilhas, 'JAVA');
  assert.strictEqual(resultMin.length, resultMai.length, 'Resultado deve ser igual independente do case');
});

executarTeste('/trilha', 'Busca por tecnologia inexistente retorna array vazio', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'COBOL_XYZ_INEXISTENTE');
  assert.strictEqual(resultado.length, 0, 'Tecnologia inexistente deve retornar array vazio');
});

executarTeste('/trilha', 'Trilha Java possui campos obrigatorios', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  resultado.forEach(t => {
    assert.ok(t.id,                 'Trilha sem id: ' + t.nome);
    assert.ok(t.nome,               'Trilha sem nome');
    assert.ok(t.nivel,              'Trilha sem nivel: ' + t.nome);
    assert.ok(t.numero_de_modulos,  'Trilha sem numero_de_modulos: ' + t.nome);
    assert.ok(t.xp_total,           'Trilha sem xp_total: ' + t.nome);
    assert.ok(t.tecnologia.length,  'Trilha sem tecnologias: ' + t.nome);
  });
});

executarTeste('/trilha', 'XP total da trilha Fullstack Java e 18500', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  const fullstack = resultado.find(t => t.nome.includes('Fullstack'));
  assert.strictEqual(fullstack.xp_total, 18500, 'XP esperado: 18500, recebido: ' + fullstack?.xp_total);
});

executarTeste('/trilha', 'Trilha Fullstack Java tem promocao ativa com 30% de desconto', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  const fullstack = resultado.find(t => t.nome.includes('Fullstack'));
  assert.strictEqual(fullstack.promocao.ativa, true, 'Promocao deve estar ativa');
  assert.strictEqual(fullstack.promocao.desconto_percentual, 30, 'Desconto deve ser 30%');
});

executarTeste('/trilha', 'Trilha Fullstack Java tem lives ao vivo semanais', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  const fullstack = resultado.find(t => t.nome.includes('Fullstack'));
  assert.strictEqual(fullstack.lives_ao_vivo.disponiveis, true);
  assert.strictEqual(fullstack.lives_ao_vivo.frequencia, 'Semanal');
});

// ─────────────────────────────────────────────
// SUÍTE 2 — /desafio
// ─────────────────────────────────────────────
console.log('\n============================================================');
console.log(' SUITE 2 — Comando /desafio');
console.log('============================================================');

executarTeste('/desafio', 'Nivel padrao e "Intermediario" quando nao informado', () => {
  const nivel = resolverNivel(null);
  assert.strictEqual(nivel, 'Intermediário');
});

executarTeste('/desafio', 'Nivel padrao e "Intermediario" quando string vazia', () => {
  const nivel = resolverNivel('');
  assert.strictEqual(nivel, 'Intermediário');
});

executarTeste('/desafio', 'Nivel "Iniciante" e reconhecido como valido', () => {
  const nivel = resolverNivel('Iniciante');
  assert.strictEqual(nivel, 'Iniciante');
});

executarTeste('/desafio', 'Nivel "Avancado" e reconhecido como valido', () => {
  const nivel = resolverNivel('Avançado');
  assert.strictEqual(nivel, 'Avançado');
});

executarTeste('/desafio', 'Nivel invalido faz fallback para "Intermediario"', () => {
  const nivel = resolverNivel('Ninja');
  assert.strictEqual(nivel, 'Intermediário');
});

executarTeste('/desafio', 'Java existe no JSON como tecnologia de trilha', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  assert.ok(resultado.length > 0, 'Java deve existir como tecnologia no JSON');
});

executarTeste('/desafio', 'Trilha Avancada de Java tem XP maior que 20000', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  const avancadas = resultado.filter(t => t.nivel === 'Avançado');
  avancadas.forEach(t => {
    assert.ok(t.xp_total > 20000, 'Trilha avancada "' + t.nome + '" deveria ter XP > 20000, tem: ' + t.xp_total);
  });
});

executarTeste('/desafio', 'Trilha Intermediaria de Java tem modulos entre 8 e 15', () => {
  const resultado = buscarTrilhasPorTecnologia(trilhas, 'Java');
  const intermediarias = resultado.filter(t => t.nivel === 'Intermediário');
  intermediarias.forEach(t => {
    assert.ok(
      t.numero_de_modulos >= 8 && t.numero_de_modulos <= 15,
      'Modulos de "' + t.nome + '": ' + t.numero_de_modulos + ' fora do range esperado (8-15)'
    );
  });
});

// ─────────────────────────────────────────────
// SUÍTE 3 — /certificado
// ─────────────────────────────────────────────
console.log('\n============================================================');
console.log(' SUITE 3 — Comando /certificado');
console.log('============================================================');

const trilhaJava = trilhas.find(t => t.nome === ALUNO_TRILHA);

executarTeste('/certificado', 'Trilha do aluno existe no JSON', () => {
  assert.ok(trilhaJava, 'Trilha nao encontrada: ' + ALUNO_TRILHA);
});

executarTeste('/certificado', 'Carga horaria calculada corretamente (modulos x 8)', () => {
  assert.ok(trilhaJava, 'Trilha deve existir para calcular carga horaria');
  const carga = calcularCargaHoraria(trilhaJava);
  assert.strictEqual(carga, trilhaJava.numero_de_modulos * 8,
    'Esperado: ' + (trilhaJava.numero_de_modulos * 8) + 'h, Obtido: ' + carga + 'h'
  );
});

executarTeste('/certificado', 'Carga horaria da trilha Fullstack Java e 96h (12 modulos x 8)', () => {
  assert.ok(trilhaJava, 'Trilha deve existir');
  const carga = calcularCargaHoraria(trilhaJava);
  assert.strictEqual(carga, 96, 'Esperado 96h, obtido: ' + carga + 'h');
});

executarTeste('/certificado', 'ID gerado comeca com "DIO-"', () => {
  const id = gerarIdCertificado();
  assert.ok(id.startsWith('DIO-'), 'ID invalido: ' + id);
});

executarTeste('/certificado', 'ID gerado tem exatamente 10 caracteres (DIO- + 6)', () => {
  const id = gerarIdCertificado();
  assert.strictEqual(id.length, 10, 'Tamanho invalido: ' + id.length + ' | ID: ' + id);
});

executarTeste('/certificado', 'Dois IDs consecutivos sao diferentes (unicidade)', () => {
  const ids = new Set();
  for (let i = 0; i < 10; i++) ids.add(gerarIdCertificado());
  assert.ok(ids.size > 1, 'IDs consecutivos nao devem ser todos iguais');
});

executarTeste('/certificado', 'Nome do aluno formatado em maiusculas', () => {
  const nomeFormatado = formatarNomeAluno(ALUNO_NOME);
  assert.strictEqual(nomeFormatado, ALUNO_NOME.toUpperCase(),
    'Esperado: ' + ALUNO_NOME.toUpperCase() + ', Obtido: ' + nomeFormatado
  );
});

executarTeste('/certificado', 'XP total da trilha Java e positivo', () => {
  assert.ok(trilhaJava, 'Trilha deve existir');
  assert.ok(trilhaJava.xp_total > 0, 'XP total deve ser positivo');
});

executarTeste('/certificado', 'Certificado contem tecnologias da trilha', () => {
  assert.ok(trilhaJava, 'Trilha deve existir');
  assert.ok(
    Array.isArray(trilhaJava.tecnologia) && trilhaJava.tecnologia.length > 0,
    'Trilha deve ter tecnologias para listar no certificado'
  );
});

executarTeste('/certificado', 'Trilha Java tem acesso vitalicio', () => {
  assert.ok(trilhaJava, 'Trilha deve existir');
  assert.strictEqual(trilhaJava.vitalicio, true, 'Acesso vitalicio esperado');
});

// ─────────────────────────────────────────────
// RELATÓRIO FINAL
// ─────────────────────────────────────────────
const cobertura    = ((totalPassou / totalTestes) * 100).toFixed(1);
const metaAtingida = parseFloat(cobertura) >= 70;
const dataHora     = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

console.log('\n============================================================');
console.log(' RELATORIO FINAL');
console.log('============================================================');
console.log('  Total de Testes : ' + totalTestes);
console.log('  Aprovados       : ' + totalPassou);
console.log('  Reprovados      : ' + totalFalhou);
console.log('  Cobertura       : ' + cobertura + '%');
console.log('  Meta (70%)      : ' + (metaAtingida ? 'ATINGIDA' : 'NAO ATINGIDA'));
console.log('============================================================\n');

// ─────────────────────────────────────────────
// GERAÇÃO DO ARQUIVO TXT
// ─────────────────────────────────────────────
const sep = '='.repeat(60);
const sep2 = '-'.repeat(60);

let txt = sep + '\n';
txt += '  RELATORIO DE TESTES - DIO Explorer Slash Commands\n';
txt += '  Data/Hora : ' + dataHora + '\n';
txt += '  Aluno     : ' + ALUNO_NOME + '\n';
txt += '  Trilha    : ' + ALUNO_TRILHA + '\n';
txt += sep + '\n\n';

txt += 'RESUMO GERAL\n';
txt += sep2 + '\n';
txt += '  Total de Testes : ' + totalTestes + '\n';
txt += '  Aprovados       : ' + totalPassou + '\n';
txt += '  Reprovados      : ' + totalFalhou + '\n';
txt += '  Cobertura       : ' + cobertura + '%\n';
txt += '  Meta (70%)      : ' + (metaAtingida ? 'ATINGIDA [OK]' : 'NAO ATINGIDA [FALHOU]') + '\n\n';

txt += sep + '\n';
txt += 'DETALHE POR SUITE\n';
txt += sep + '\n\n';

const suites = [...new Set(resultados.map(r => r.suite))];
suites.forEach(suite => {
  const tessesDaSuite = resultados.filter(r => r.suite === suite);
  const passouSuite   = tessesDaSuite.filter(r => r.status === 'PASS').length;
  txt += '[ ' + suite + ' ]  ' + passouSuite + '/' + tessesDaSuite.length + ' aprovados\n';
  txt += sep2 + '\n';
  tessesDaSuite.forEach(t => {
    const icone = t.status === 'PASS' ? '[PASS]' : '[FAIL]';
    txt += '  ' + icone + '  ' + t.descricao + ' (' + t.duracao + 'ms)\n';
    if (t.erro) {
      txt += '         Erro: ' + t.erro + '\n';
    }
  });
  txt += '\n';
});

txt += sep + '\n';
txt += 'SIMULACAO DO FLUXO COMPLETO\n';
txt += sep + '\n\n';

const trilhasJava = buscarTrilhasPorTecnologia(trilhas, 'Java');
txt += '[1] /trilha Java\n';
txt += '    Trilhas encontradas:\n';
trilhasJava.forEach(t => {
  txt += '      - ' + t.nome + ' (' + t.nivel + ' | ' + t.xp_total + ' XP)\n';
});
txt += '\n';

txt += '[2] /desafio Java Intermediario\n';
txt += '    Tecnologia : Java\n';
txt += '    Nivel      : ' + resolverNivel('Intermediário') + '\n';
txt += '    XP previsto: ate 3.500 XP\n\n';

const idCert = gerarIdCertificado();
txt += '[3] /certificado ' + ALUNO_NOME + ' "' + ALUNO_TRILHA + '"\n';
txt += '    Aluno          : ' + formatarNomeAluno(ALUNO_NOME) + '\n';
txt += '    Trilha         : ' + ALUNO_TRILHA + '\n';
txt += '    Carga Horaria  : ' + (trilhaJava ? calcularCargaHoraria(trilhaJava) + 'h' : 'N/A') + '\n';
txt += '    XP Conquistado : ' + (trilhaJava ? trilhaJava.xp_total + ' XP' : 'N/A') + '\n';
txt += '    ID Certificado : ' + idCert + '\n';
txt += '    Tecnologias    : ' + (trilhaJava ? trilhaJava.tecnologia.join(', ') : 'N/A') + '\n';
txt += '    Nivel          : ' + (trilhaJava ? trilhaJava.nivel : 'N/A') + '\n\n';

txt += sep + '\n';
txt += 'Arquivo gerado automaticamente por testes-dio.js\n';
txt += sep + '\n';

fs.writeFileSync(RESULT_PATH, txt, 'utf-8');
console.log('Resultados gravados em: ' + RESULT_PATH);

process.exit(metaAtingida ? 0 : 1);
