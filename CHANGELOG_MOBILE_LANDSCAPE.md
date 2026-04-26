# Changelog — Mobile Landscape Patch

## v0.1.0

### Adicionado

- `css/mobile-landscape.css`
  - Camada responsiva mobile landscape-first.
  - Overlay de orientação para celulares em modo vertical.
  - Ajustes para navbar, seletor de planetas, info panel, modal, quiz e loading.
  - Suporte a notch/safe area.
  - Uso de `100dvh` e variáveis CSS dinâmicas.

- `js/mobileViewport.js`
  - Atualiza `--app-width` e `--app-height` com base em `visualViewport` quando disponível.
  - Adiciona classes no `body`: `is-mobile-landscape` e `is-mobile-portrait`.
  - Reforça o resize após `orientationchange` para ajudar o renderer do Three.js.

### Alterado

- `index.html`
  - `meta viewport` atualizado para `viewport-fit=cover`.
  - Inclusão do novo CSS `css/mobile-landscape.css` depois dos demais estilos.
  - Inclusão do overlay `#orientation-lock`.
  - Inclusão do helper `js/mobileViewport.js` antes do `js/main.js`.

### Mantido

- Nenhuma regra de negócio do Three.js foi alterada nesta etapa.
- Nenhum módulo principal de cena, câmera, planeta, NASA API ou quiz foi reescrito.
