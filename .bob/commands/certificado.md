---
description: Gera um certificado fictício em Markdown com nome do usuário e trilha concluída
argument-hint: <seu-nome> <nome-da-trilha>
---

O usuário quer gerar um certificado fictício DIO. Entrada fornecida: $input

Interprete o input assim:
- Tudo antes da última palavra-chave reconhecível como trilha é o **nome do usuário**
- O restante é o **nome da trilha concluída**
- Se a separação não for clara, pergunte ao usuário: "Qual é o seu nome e qual trilha você concluiu?"

Em seguida, leia o arquivo `Projeto Final Dio Explorer/data/trilhas.dio.json` e tente encontrar a trilha mencionada para obter os dados reais (xp_total, numero_de_modulos, tecnologia). Se não encontrar, use valores fictícios coerentes.

Gere o certificado **completo em Markdown**, seguindo exatamente este modelo:

---

<div align="center">

# 🎓 CERTIFICADO DE CONCLUSÃO

---

**Digital Innovation One — DIO**
*Plataforma de Educação em Tecnologia*

---

## Este certificado é conferido a

# [NOME DO USUÁRIO EM MAIÚSCULAS]

pela conclusão com êxito da trilha de conhecimento:

## "[Nome da Trilha]"

---

| 📅 Data de Emissão | 🆔 ID do Certificado | ⏱️ Carga Horária | ⚡ XP Conquistado |
|---|---|---|---|
| [data atual formatada: DD de Mês de AAAA] | DIO-[6 caracteres alfanuméricos aleatórios maiúsculos] | [calcule: numero_de_modulos × 8]h | [xp_total] XP |

---

### 🛠️ Tecnologias Dominadas
[liste as tecnologias da trilha como badges em texto: `Tecnologia1` · `Tecnologia2` · ...]

---

### 📊 Nível de Proficiência Alcançado

[insira uma barra de progresso fictícia em texto baseada no nível:]
- Iniciante:     `[████████░░░░░░░░░░░░] 40%`
- Intermediário: `[█████████████░░░░░░░] 65%`
- Avançado:      `[████████████████████] 100%`

---

> *"A jornada de aprendizado nunca termina. Este certificado marca uma conquista,*
> *não um fim. Continue explorando, construindo e inovando."*
>
> — **Digital Innovation One**

---

✅ **Certificado Válido** | 🌐 dio.me | 📧 contato@dio.me

*Este é um certificado fictício gerado pela plataforma DIO Explorer.*
*Para certificados oficiais, acesse [dio.me](https://www.dio.me)*

</div>

---

Após gerar o certificado, adicione esta mensagem fora do bloco:

> 🎉 Parabéns, **[nome do usuário]**! Seu certificado foi gerado com sucesso.
> Para salvar, copie o conteúdo Markdown acima e cole em um arquivo `.md` na pasta `Projeto Final Dio Explorer/docs/`.
