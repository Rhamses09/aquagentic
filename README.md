# 🐟 AQUAGENTIC

> **Ultralight BYOK AI & MCP Agent Desktop Client with Gamified Token-Driven Aquarium Mechanics.**

Aquagentic es un cliente de escritorio agéntico ultraligero (<10 MB binario, 40–80 MB RAM) compatible con el **Model Context Protocol (MCP)** y modelos multimodelo (OpenAI, Anthropic, Google Gemini, Groq, Ollama / LM Studio), que integra un juego incremental y gacha de pesca donde cada token procesado y herramienta agéntica alimenta un acuario reactivo.

---

## 🚀 Características Principales

- **Ultra-Rendimiento (0% CPU Idle):** Animaciones CSS GPU Compositing puras (`translate3d`), Page Visibility API para detener el ciclo gráfico en segundo plano, y modo *Headless System Tray* en Rust (~5 MB RAM).
- **Gamificación Token-Driven:** Tus tokens de entrada, salida y razonamiento cargan tu anzuelo para capturar más de 100 especies de peces de código con 6 niveles de rareza, variantes *Shiny* y generación determinista SHA-256 a partir del hash del prompt.
- **Biomas y Clima Reactivo:** El acuario cambia de bioma según el lenguaje de programación detectado (Fosa de Bajo Nivel, Pantano de Datos, Arrecife Frontend, Zona Abisal) y genera tormentas cuando el agente detecta errores o rate limits (habilitando capturas *Glitch*).
- **Control Remoto Híbrido Zero-Cost:** Servidor WebSocket local embebido en Rust (`axum`) para conexión local en vivo y PWA con Companion Screen, o fallback en la nube vía GitHub Gists privados con algoritmo de fusión monotónica (`mergeStates`).
- **Seguridad First:** Las claves API se almacenan de forma segura en el llavero nativo del SO (*Credential Manager / Keychain / Secret Service*).

---

## 📁 Estructura del Proyecto

```text
aquagentic/
├── apps/
│   ├── desktop/              # Tauri v2 + SolidJS/Svelte (Chat, Dock del Acuario, Bestiario, Tienda)
│   └── mobile-pwa/           # PWA ligera para Companion Screen y control remoto
├── packages/
│   ├── core-game/            # Lógica pura TS (Gacha RNG, SHA-256 seed, fishData, Monotonic Merge)
│   └── shared-ui/            # Componentes CSS GPU del Acuario, Sprites y Share Cards
├── assets/
│   └── sprites/              # Sprites pixel art y fondos
└── docs/
    └── aquagentic_master_specification.md   # Especificación maestra del sistema
```

---

## 📖 Especificación Maestra

Para detalles exhaustivos de arquitectura, mecánicas gacha y diseño del sistema, consulta [docs/aquagentic_master_specification.md](docs/aquagentic_master_specification.md).
