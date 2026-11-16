# Aquagentic - Roadmap & TODO List

Documento de seguimiento de características, componentes y mejoras arquitectónicas para **Aquagentic** (Cliente Agéntico Desktop BYOK + Ecosistema Acuario Inspirado en Terraria).

---

## 🟢 Completado (Completed)

- [x] **Arquitectura Monorepo:** Estructura con `pnpm`/`npm workspaces` (`core-game`, `desktop`, `mobile`).
- [x] **Motor de Juego Núcleo (`core-game`):**
  - [x] Catálogo con 22 especies de peces marinos reales (sin nombres jocosos ni tecnológicos).
  - [x] Sistema de rarezas (Común, Poco Común, Raro, Épico, Legendario, Mítico).
  - [x] Cálculo determinista de hash SHA-256 para cada captura basado en el prompt y timestamp.
  - [x] Pity counters deterministas para rarezas Épica (30 tiros) y Legendaria (90 tiros).
  - [x] Detección de biomas por código y modelo (Arrecife Frontend, Pantano de Datos, Océano Clásico, Zona Abisal).
  - [x] Detección de clima (Tormenta glitch por errores 429/excepciones).
  - [x] Economía idle de Perlas (PPS - Perlas por segundo) y ticker desacoplado.
  - [x] Monotonic Merge sin pérdida de datos para sincronización.
- [x] **Física y Animación de Acuario:**
  - [x] Sprites Pixel Art retro (`shape-rendering="crispEdges"`) para las 22 especies.
  - [x] Corrección de orientación de nado: la cabeza del pez lidera siempre el movimiento en el eje X.
  - [x] Aislamiento del label de nombre/PPS para evitar texto espejado durante giros.
  - [x] Acuario viviente a pantalla completa como fondo transparente detrás del chat.
- [x] **Sistema Gacha de Cofres Marinos:**
  - [x] Al quemar tokens y llenar la caña se generan Cofres de Pesca acumulables.
  - [x] Modal interactivo con vibración de cofre (`animate-chest-rumble`), haz de luz por rareza (`animate-ray-spin`) y revelación de tarjeta de pez.
  - [x] Botón de cofres disponibles en el Dock inferior.
- [x] **Bestiario / Fishdex:**
  - [x] Explorador modal con conteo de descubrimientos, estrellas, pesos máximos y activación de hasta 8 peces en tanque.
- [x] **Sistema de Misiones del Pescador NPC (Estilo Terraria):**
  - [x] Módulo `anglerEngine` en `core-game` con generación de encargos, diálogos con personalidad y cálculo de recompensas por rareza.
  - [x] Modal interactivo `AnglerQuestModal.tsx` con avatar pixel art del Pescador, bocadillo de diálogo, ficha de especie solicitada y reclamo de botín.
  - [x] Acceso directo y badges de estado (`¡Listo!`) en Sidebar y Dock inferior.
  - [x] Mecánica de rotación / Reroll de misiones.
- [x] **Soporte Bilingüe (i18n):**
  - [x] Soporte completo Español / Inglés en todos los componentes y misiones del Pescador.

---

## 🟡 En Progreso & Próximas Características (In Progress & Upcoming)

### 1. Tienda de Aparejos y Mejoras de Caña (Tackle Shop)
- [ ] Mejoras de Cañas de Pescar:
  - [ ] Caña de Madera (Inicial)
  - [ ] Caña de Fibra de Carbono (+15% probabilidad de peces raros)
  - [ ] Caña Mecánica (+25% velocidad de carga de cebo)
  - [ ] Caña Dorada (Mayor probabilidad de peces míticos y variantes Shiny)
- [ ] Tipos de Cebo: Cebo Maestro, Cebo Bioluminiscente, Cebo de Tormenta.
- [ ] Accesorios equipables (Caja de aparejos, esponja absorbente de tokens, anzuelo de alta frecuencia).

### 3. Personalización del Acuario (Decoraciones)
- [ ] Elementos decorativos desbloqueables en la tienda de perlas:
  - [ ] Barco pirata hundido
  - [ ] Arrecifes de coral vivientes
  - [ ] Castillo abisal
  - [ ] Burbujeador de perlas
- [ ] Interactividad táctil: Al hacer clic en un pez en el fondo, que haga un salto rápido o suelte burbujas.

### 4. Cliente Nativo de Escritorio y Seguridad (Tauri v2 + BYOK)
- [ ] Empaquetado oficial con Tauri v2:
  - [ ] Ventana nativa sin bordes con botones integrados.
  - [ ] Almacenamiento seguro de API Keys en Keychain del SO (Windows Credential Manager / macOS Keychain).
  - [ ] Modo Picture-in-Picture / Widget flotante en esquina mientras se programa.
  - [ ] Notificaciones nativas al capturar especies Míticas o desbloquear logros del Pescador.

### 5. Integración con Servidores MCP (Model Context Protocol)
- [ ] Cajón de configuración de servidores MCP (`filesystem`, `git`, `postgres`, `fetch`, etc.).
- [ ] Indicador visual en tiempo real en el chat cuando un agente despacha una herramienta MCP.
- [ ] Cada llamada a herramienta genera cebo adicional ("Bait bonus") para recompensar flujos agénticos complejos.

### 6. Sincronización Móvil (PWA / Mobile Client)
- [ ] Emparejamiento por código QR entre escritorio y móvil.
- [ ] Sincronización offline P2P (WebRTC / LocalStorage Sync) basada en Monotonic State Merge.

---

## 🔒 Reglas de Seguridad y Buenas Prácticas
1. **BYOK (Bring Your Own Key):** Las claves API de Anthropic, OpenAI, DeepSeek o Google jamás deben sincronizarse en la nube ni enviarse a servidores externos; deben quedar restringidas al vault seguro local.
2. **Sanitización de código y prompts:** Prevención de inyección en renderizado Markdown / HTML.
3. **Optimización de recursos:** Mantener las animaciones del acuario en capas de composición GPU para asegurar 0% consumo de CPU innecesario.
