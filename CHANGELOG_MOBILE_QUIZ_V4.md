# T.A.R.D.I.S. — Mobile Quiz Hotfix v4

## Correção principal

Corrigido o problema do **Modo Aventura no celular em modo horizontal** em que, depois de acertar uma pergunta, o botão para avançar para o próximo planeta ficava preso abaixo da área visível da tela.

## Arquivos alterados

- `css/mobile-landscape.css`
- `js/ui/guidedTour.js`

## O que mudou

### `css/mobile-landscape.css`

- O layout do quiz em mobile landscape passou a usar uma grade mais estável:
  - Doctor e balão continuam no topo;
  - barra de progresso continua visível;
  - planeta 3D permanece visível à esquerda;
  - pergunta, opções, feedback e botão ficam em uma área lateral rolável.
- O botão de avanço (`PRÓXIMO`) agora fica com comportamento `sticky` dentro da área do quiz.
- Em celulares horizontais muito baixos, o layout fica mais compacto sem esconder o planeta ou o Doctor.
- O hint é escondido apenas após resposta correta em telas muito pequenas, para abrir espaço ao botão de avanço.
- O botão principal `MODO AVENTURA` da navbar recebeu novo ajuste para o texto não vazar para fora do botão.

### `js/ui/guidedTour.js`

- Ao acertar uma pergunta, o quiz adiciona a classe `quiz-has-answer`.
- O botão de avanço chama `scrollIntoView()` automaticamente para ficar acessível em telas baixas.
- Ao avançar para a próxima pergunta, o estado visual de resposta é removido.
- A tela final também aplica o mesmo comportamento para o botão `ENCERRAR AVENTURA` ficar visível.

## Como testar

1. Abrir o projeto em servidor local ou no deploy.
2. Abrir no celular em modo horizontal.
3. Entrar em `MODO AVENTURA`.
4. Acertar uma resposta.
5. Confirmar que o botão `PRÓXIMO` aparece sem precisar arrastar a tela inteira.
6. Testar especialmente em resoluções como:
   - 667 × 375
   - 740 × 360
   - 844 × 390
   - 915 × 412
   - 932 × 430
