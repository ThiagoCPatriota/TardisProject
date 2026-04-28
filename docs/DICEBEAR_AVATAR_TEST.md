# Teste de Avatar com DiceBear

## Objetivo

Adicionar uma opção experimental de avatar externo usando DiceBear, sem remover o avatar local atual.

## Como funciona

No cadastro, na etapa **Avatar**, existe uma nova escolha:

- Avatar atual
- DiceBear teste

Ao escolher DiceBear, o usuário pode testar estilos diferentes:

- Aventureiro
- Aventureiro neutro
- Personas
- Avataaars
- Pixel Art

O avatar é gerado por uma URL SVG pública do DiceBear usando uma `seed`. No cadastro, essa seed é baseada no Nome de Explorador ou no e-mail.

## Dados salvos no perfil

Exemplo:

```json
{
  "avatarProvider": "dicebear",
  "dicebearStyle": "adventurer",
  "dicebearSeed": "Astro Theo",
  "dicebearBackground": "0f172a"
}
```

## Onde aparece

Quando o avatar DiceBear é escolhido e salvo no cadastro, ele aparece automaticamente nos pontos onde o projeto já usa o renderizador de avatar:

- Perfil
- Ranking
- Loja Cósmica
- Preview do cadastro

## Observação

Este recurso é experimental. O avatar local continua funcionando e pode ser mantido como padrão caso o teste com DiceBear não agrade.
