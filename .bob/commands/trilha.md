---
description: Gera um plano de estudos completo para uma tecnologia a partir das trilhas DIO
argument-hint: <tecnologia>
---

O usuário quer um plano de estudos da trilha DIO para a tecnologia: $input

Siga estes passos:

1. Leia o arquivo `Projeto Final Dio Explorer/data/trilhas.dio.json` do workspace.
2. Encontre a trilha (ou trilhas) cujo campo `tecnologia` contenha a tecnologia informada pelo usuário. A busca deve ser case-insensitive e considerar correspondência parcial (ex: "Java" deve encontrar trilhas com "Java", "Spring Boot" etc.).
3. Se encontrar uma ou mais trilhas, gere um **Plano de Estudos** completo em Markdown para cada uma, seguindo exatamente esta estrutura:

---

# 📚 Plano de Estudos — [Nome da Trilha]

## 🎯 Visão Geral
- **Tecnologias:** liste todas as tecnologias da trilha
- **Nível:** [nível da trilha]
- **Total de Módulos:** [numero_de_modulos]
- **XP Total ao Concluir:** [xp_total] XP
- **Acesso Vitalício:** Sim / Não
- **Vagas Disponíveis:** [beds_disponiveis]

## 🏷️ Promoção Ativa
Se `promocao.ativa` for true, exiba:
> 🔥 **Promoção:** [desconto_percentual]% de desconto | Válido até: [validade]

Se não houver promoção, escreva: *Nenhuma promoção ativa no momento.*

## 📡 Lives ao Vivo
Se `lives_ao_vivo.disponiveis` for true, exiba:
- **Frequência:** [frequencia]
- **Próxima Live:** [proxima_live formatada em português, ex: "15 de julho de 2025 às 19h"]

Se não houver lives: *Sem lives ao vivo nesta trilha.*

## 🗂️ Módulos da Trilha
Crie uma lista numerada com [numero_de_modulos] módulos fictícios mas coerentes com as tecnologias da trilha. Cada módulo deve ter:
- Número e nome descritivo
- Breve descrição do que será aprendido (1 linha)
- XP estimado para aquele módulo (distribua o xp_total proporcionalmente)

## ✅ Objetivos de Aprendizado
Liste de 5 a 8 objetivos concretos que o aluno atingirá ao concluir a trilha.

## 🚀 Próximos Passos
Sugira 2 trilhas complementares do mesmo JSON que fariam sentido estudar em seguida.

---

4. Se nenhuma trilha for encontrada para a tecnologia informada, responda:
> ❌ Nenhuma trilha encontrada para a tecnologia **[tecnologia]**. Tente com outro nome, como: Python, Java, React, AWS, Docker, etc.
