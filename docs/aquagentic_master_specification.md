# Especificación Maestra del Proyecto: AQUAGENTIC

> **Instrucciones para el Agente de IA (Antigravity / Cursor / Claude Code):**
> Este documento contiene la arquitectura completa, las reglas de rendimiento y el diseño de mecánicas del proyecto **Aquagentic**. Úsalo como fuente única de verdad (*Single Source of Truth*) para estructurar el repositorio, tomar decisiones técnicas e implementar cada módulo sin omitir ninguna característica.

---

## 1. Visión General y Propósito del Sistema
**Aquagentic** es un cliente de escritorio **ultraligero, multimodelo (BYOK - Bring Your Own Key) y compatible con agentes MCP (Model Context Protocol)**, que integra un **juego incremental/gacha de pesca y colección de acuario** alimentado directamente por el consumo real de tokens, la ejecución de herramientas agénticas y el contexto de programación del usuario. 

No es un IDE completo, sino un cliente de chat y agentes tipo *Claude Desktop* o *Antigravity Client*, diseñado con una huella de recursos mínima (<10 MB de binario, 40–80 MB de RAM en uso normal y ~5 MB en modo *headless*) y un sistema de **Control Remoto Híbrido Zero-Cost** que sincroniza el estado entre la PC y dispositivos móviles tanto en vivo (WebSockets) como con la PC apagada (GitHub Gists).

---

## 2. Stack Tecnológico y Reglas de Rendimiento Extremo
El desarrollo debe respetar estrictamente las siguientes decisiones arquitectónicas para garantizar que la aplicación sea imperceptible en el consumo de CPU y RAM:

* **Core Desktop Framework:** **Tauri v2 (Rust)**. Prohibido usar Electron.
* **Frontend Framework:** **SolidJS** o **Svelte 5** con **TypeScript** y **TailwindCSS**. Se eligen por no usar Virtual DOM, permitiendo que los contadores incrementales por segundo y el *streaming* de tokens actualicen nodos específicos del DOM sin re-renderizar árboles completos.
* **Motor de Renderizado del Acuario (0% CPU Overhead):** No usar motores pesados (Unity/Godot) ni ciclos de `<canvas>` redibujando a 60 FPS en JS de forma continua. Los peces deben renderizarse mediante *sprites* Pixel Art o SVG animados con **CSS GPU Compositing puro (`transform: translate3d`, `will-change: transform`)** delegados al compositor de la GPU.
* **Pausa Inteligente (`Page Visibility API`):** Cuando la ventana de Aquagentic está minimizada, oculta o en otro *workspace*, se detienen todas las animaciones visuales al 100%. Al recuperar el foco, el progreso se calcula matemáticamente mediante `deltaTime = Date.now() - lastSeenTimestamp`.
* **Modo Headless / System Tray (Ahorro de Energía para Control Remoto):** Al cerrar la ventana en la PC mientras el modo remoto está activo, Tauri debe destruir la instancia del WebView (liberando toda la RAM de UI y GPU) y mantener únicamente el proceso de Rust en la bandeja del sistema (~5 MB RAM, 0% CPU en reposo) con un *Wake Lock / Inhibit Sleep* activo mientras exista una sesión remota conectada.
* **Persistencia Local:** `tauri-plugin-sql` (**SQLite**) en escritorio para el historial completo de chats, logs de MCP e inventario; `IndexedDB` / `localStorage` en la PWA móvil.
* **Seguridad de Credenciales:** Las API Keys de los proveedores y tokens de GitHub se guardan en el llavero nativo del sistema operativo (*Secret Service / KWallet* en Linux, *Keychain* en macOS, *Credential Manager* en Windows) vía Rust.

---

## 3. Arquitectura del Cliente de IA y Agentes (Capa Productiva)
* **Unificación Multimodelo:** Integración mediante **Vercel AI SDK** (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/groq`, más proveedor compatible con **Ollama / LM Studio** para modelos locales).
* **Interceptor Universal de Tokens:**
  * Durante el *streaming*, contar los *chunks* recibidos en tiempo real para animar la barra de pesca de forma fluida y mover el anzuelo.
  * Al finalizar (`onFinish({ usage })`), extraer con precisión `prompt_tokens`, `completion_tokens` y `reasoning_tokens` (para modelos *thinking* como Claude Thinking, o3, Gemini Thinking o DeepSeek R1) y despachar el evento al motor del juego.
* **Integración MCP (Model Context Protocol):**
  * Capacidad de conectar servidores MCP locales (sistema de archivos, terminal bash, Git, búsqueda web, bases de datos).
  * **Flujo *Human-in-the-loop*:** Interfaz de aprobación/rechazo antes de que el agente ejecute comandos destructivos o escrituras, operable tanto desde la PC como desde el celular en modo remoto.
* **UX de Chat de Alto Nivel:** Renderizado Markdown rápido, resaltado de sintaxis con *Shiki*, vista de *diffs* de código, botón de copiado instantáneo, soporte multimodal (adjuntar imágenes/archivos) y selector de *System Prompts* personalizables (que dentro del juego funcionan como "Amuletos" equipables).

---

## 4. Diseño Profundo del Juego Incremental y Gacha (El Acuario)

### 4.1. Conversión de Actividad a Pesca (Tokens a Cebo)
* **Barra de Lanzamiento:** Cada token procesado (entrada + salida + razonamiento) suma puntos a la barra `currentBaitProgress`. Cuando `currentBaitProgress >= rodTokenCost`, se dispara automáticamente una captura y el excedente se conserva (*overflow*).
* **Bonos por Complejidad y Éxito:**
  * Ejecutar una herramienta MCP con éxito (`exit code 0` o *commit* limpio) otorga **Cebo Dorado** (buff temporal que multiplica la suerte de rareza).
  * Rachas diarias de uso del cliente aumentan el multiplicador global de generación pasiva.

### 4.2. Ecosistema Reactivo al Contexto (Biomas y Clima Dinámico)
El sistema analiza de forma ultraligera (regex a 0ms sobre los bloques de código o metadatos del modelo) qué está haciendo el usuario para alterar las condiciones del agua en tiempo real:
* **Biomas por Lenguaje o Modelo:**
  * Código en `rust`, `c`, `cpp`, `zig` $\rightarrow$ **Fosa de Bajo Nivel** (peces acorazados, crustáceos como *Ferris el Cangrejo*).
  * Código en `python`, `sql`, `r`, `json` $\rightarrow$ **Pantano de Datos**.
  * Código en `ts`, `js`, `html`, `css` $\rightarrow$ **Arrecife Frontend**.
  * Modelos con *Reasoning / Thinking* activado $\rightarrow$ **Zona Abisal Bioluminiscente** (especies profundas que requieren alto gasto de tokens de pensamiento).
* **Clima Reactivo al Estado del Agente:**
  * *Agua Cristalina:* Comandos MCP exitosos y respuestas fluidas (+20% generación de Perlas).
  * *Tormenta Eléctrica / Agua Turbia:* Se activa cuando un comando MCP devuelve error (`exit code != 0`), aparece un *stack trace* o la API devuelve `rate limit (429)`. **Mecánica clave:** Existen especies mutantes/*Glitch* (ej. *Anguila NullPointer*, *Pez Globo Segfault*) que **solo** pueden capturarse durante tormentas, transformando la frustración de un bug en una oportunidad de captura rara.

### 4.3. Motor Gacha, Rarezas, Semilla SHA-256 y Pity Timer
* **6 Niveles de Rareza Base:**
  1. *Común* (~65%) — ej. *Sardina de Sintaxis*
  2. *Poco Común* (~22%) — ej. *Carpa Compiladora*
  3. *Raro* (~9%) — ej. *Calamar Git*
  4. *Épico* (~3%) — ej. *Tiburón Kernel*
  5. *Legendario* (~0.9%) — ej. *Ballena Docker*
  6. *Mítico / Anomaly* (~0.1%) — ej. *Leviatán Asíncrono*
* **Variantes Shiny / Glitch:** Cualquier pez capturado tiene una probabilidad base de `1 / 512` de ser *Shiny* (paleta de colores alternativa o shader visual de *glitch*), generando $\times 3$ recursos pasivos.
* **Generación Procedural con el Hash del Prompt:** Para que ningún pez sea idéntico, el hash **SHA-256** del prompt que disparó la captura se utiliza como semilla determinista para calcular el peso del pez (medido en `KB`, `MB`, `GB` o `TB`) y pequeñas variaciones de sus sub-estadísticas.
* **Sistema de Pity (Compasión):** Contador interno que garantiza al menos un pez *Épico* cada $X$ lanzamientos sin suerte y un *Legendario* cada $Y$ lanzamientos.

### 4.4. Sinergias en el Acuario (Armado de "Builds" Pasivas)
El acuario visual tiene un número limitado de *slots* activos (ampliables en la tienda); el resto de los peces se guardan en la Caja/Pokédex. Los peces en el tanque activo no solo dan **Perlas por Segundo (PPS)**, sino que tienen pasivas únicas con sinergia:
* **Rémora de Contexto:** Duplica su producción de Perlas si la sesión de chat actual supera los 20,000 tokens de contexto.
* **Calamar Git:** Cada vez que el agente ejecuta un comando de Git o edita un archivo por MCP, llena un 25% de la barra de pesca instantáneamente.
* **Pez Linterna Local (Ollama):** Otorga un multiplicador masivo mientras el usuario chatea con un modelo local, premiando el ahorro de costos de API.
* **Depredadores (Cadena Alimenticia):** Peces como el *Tiburón Kernel* devoran automáticamente los peces *Comunes* repetidos que vas atrapando y los refinan en **Fragmentos de Coral** (moneda avanzada).

### 4.5. Eventos "Boss Fight" en Tareas Largas de Agentes
Cuando el agente inicia una tarea pesada (múltiples llamadas MCP, lectura de repositorio o *streaming* largo que toma >25 segundos):
* Aparece una sombra colosal en el acuario (**Kraken Monolítico** o **Leviatán de Deuda Técnica**).
* Cada *chunk* de tokens o paso ejecutado por el agente inflige daño al Boss (apoyado por los "Arpones Automáticos" que el usuario haya comprado en la tienda o clics opcionales en *Quick-Time Events*).
* Al finalizar la tarea del agente, el Boss es derrotado y suelta un cofre con reliquias o cebos especiales.

### 4.6. Fusión (Sink de Repetidos), Tienda y Prestigio
* **Laboratorio de Compilación (Fusión):** Permite fusionar 10 copias del mismo pez para subir su rango de estrellas ($\star 1 \rightarrow \star 5$), evolucionando su *sprite* y duplicando el efecto de su habilidad pasiva.
* **Árbol de Tienda (3 Ramas):**
  1. *Rama Activa (Cañas y Cebos):* Reduce el costo de tokens por lanzamiento, desbloquea probabilidad de *Doble Captura* y aumenta el peso de rarezas altas.
  2. *Rama Idle (Acuario):* Redes automáticas (*Auto-Catchers* que pescan cada $X$ minutos sin chatear), comederos, más *slots* en el tanque y nuevos fondos de bioma.
  3. *Rama Cosmética del Cliente:* Permite gastar monedas del juego para desbloquear temas completos para la interfaz de chat de Aquagentic (ej. *GameBoy Color*, *Submarino Nuclear*, *Terminal CRT*, *Vaporwave*), sonidos mecánicos sutiles o bordes para bloques de código.
* **Sistema de Prestigio (`sudo rm -rf /ocean`):** Al llegar al *endgame*, el usuario puede reiniciar su acuario liberando a sus peces para obtener **Perlas Abisales**. Estas desbloquean el **Árbol de Constelaciones / Reliquias** con mejoras permanentes (ej. subir la probabilidad *Shiny* de `1/512` a `1/128`, empezar cada reinicio con un pez Épico o desbloquear la *Dimensión Cuántica*).

---

## 5. Arquitectura de Control Remoto y Sincronización Híbrida

El sistema permite usar Aquagentic desde el celular (vía PWA hospedada gratuitamente en GitHub Pages/Vercel dentro del mismo repo) bajo tres modos con transición automática:

### 5.1. Servidor Embebido en Rust y Emparejamiento QR
* El binario de Tauri incluye un servidor HTTP/WebSocket ultraligero con **`axum`** y **`tokio-tungstenite`**.
* En la PC, un botón *"Vincular Móvil"* genera un **Código QR** que contiene: IP local (o URL de túnel efímero tipo Cloudflare Quick Tunnel / Tailscale), un token JWT de sesión local, el `gistId` y el token de GitHub (con único permiso `gist`).
* El navegador móvil escanea el QR una sola vez, guarda la configuración en `localStorage` y limpia la URL.

### 5.2. Router de Conexión Inteligente (PC Encendida vs. PC Apagada)
Al abrir la PWA en el celular, lanza un ping por WebSocket al servidor de la PC con un *timeout* de **1.5 segundos**:
1. **Si responde en < 1.5s $\rightarrow$ Modo Remoto En Vivo (PC Encendida):**
   * Sincronización bidireccional en tiempo real a 60 FPS por WebSocket.
   * El celular puede mandar prompts que ejecutan herramientas MCP físicamente en la PC, ver logs de terminal y aprobar permisos (*Human-in-the-loop*).
   * **Modo "Companion Screen" (Segunda Pantalla):** Permite poner el celular en horizontal junto al teclado mostrando únicamente el Acuario a pantalla completa y el monitor de tokens/costos en vivo, dejando el monitor de la PC 100% limpio para el código.
2. **Si da Timeout $\rightarrow$ Modo Bolsillo Cloud (PC Apagada):**
   * Muestra el estado *"PC desconectada — Modo Bolsillo"*.
   * Desactiva herramientas locales MCP, pero permite chatear directamente desde el teléfono usando las APIs en la nube (BYOK), seguir quemando tokens, atrapar peces, usar la tienda y guardar el progreso en un **GitHub Gist secreto** del usuario (`aquagentic_sync.json`).

### 5.3. Esquema de Datos y Algoritmo de "Merge Monotónico"
Para evitar que el progreso hecho en el móvil con la PC apagada sobrescriba o pierda datos al volver a encender la PC, ambos clientes usan la siguiente estructura y función de fusión determinista:

```typescript
export interface AquagenticSyncState {
  version: number;
  lastUpdated: number; // Timestamp UNIX en ms
  deviceOrigin: 'desktop' | 'mobile';
  aquarium: {
    totalTokensBurned: number;
    currentBaitProgress: number;
    pearls: number;
    abyssalPearls: number; // Moneda de Prestigio
    coralFragments: number;
    pearlsPerSecond: number;
    rodLevel: number;
    pityCounterEpic: number;
    pityCounterLegendary: number;
    activeTankFishIds: string[];
    unlockedBiomes: string[];
    unlockedThemes: string[];
    inventory: Record<string, {
      count: number;
      shinyCount: number;
      starRank: number;
      maxWeightBytes: number;
      firstCaughtAt: number;
    }>;
  };
  recentSessions: Array<{
    id: string;
    title: string;
    model: string;
    updatedAt: number;
    messages: Array<{ role: 'user' | 'assistant'; content: string; tokens?: number }>;
  }>;
}
```

**Reglas del Merge Monotónico (`mergeStates(local, remote)`):**
* **Tiempo Offline:** Se toma `newestTimestamp = Math.max(local.lastUpdated, remote.lastUpdated)` y se suma `(Date.now() - newestTimestamp) / 1000 * Math.max(local.pps, remote.pps)` a las perlas del estado más reciente.
* **Inventario y Progreso:** Nunca se resta. Para cada `fishId` en `inventory`, se conserva `Math.max(local.count, remote.count)`, `Math.max(local.shinyCount, remote.shinyCount)` y `Math.max(local.maxWeightBytes, remote.maxWeightBytes)`.
* **Mejoras y Desbloqueos:** Se aplica `Math.max` en niveles de caña/prestigio y unión de conjuntos (`Set`) para biomas y temas desbloqueados.

---

## 6. Estructura Sugerida del Monorepo

```text
aquagentic/
├── apps/
│   ├── desktop/              # App principal Tauri v2 + SolidJS/Svelte
│   │   ├── src/              # UI de escritorio (Chat, Dock del Acuario, Bestiario, Tienda)
│   │   └── src-tauri/        # Backend Rust (SQLite, Keyring, MCP Client, Servidor Axum WS)
│   └── mobile-pwa/           # Interfaz web ligera para móvil y Modo Companion Screen
├── packages/
│   ├── core-game/            # Lógica pura TS (Gacha RNG, SHA-256 seed, fishData.ts, Merge Monotónico, Sync Gist)
│   └── shared-ui/            # Componentes compartidos del Acuario CSS GPU, Sprites y Share Cards
├── assets/
│   └── sprites/              # Peces en Pixel Art 32x32 / 64x64 y fondos de biomas
└── .github/workflows/        # CI/CD con tauri-action para compilar .AppImage, .deb, .dmg y .msi
```

---

## 7. Features de Viralidad y Comunidad Open-Source
* **Generador de "Share Cards":** Función que renderiza un `<canvas>` temporal sólo al hacer clic en "Compartir Captura" para exportar una tarjeta PNG estilo *Spotify Wrapped / Pokémon Card* mostrando el sprite del pez raro atrapado, su peso en GB, el hash del prompt y los tokens quemados en la semana.
* **Arquitectura "PR-Friendly" para Contribuidores:** Los peces deben estar definidos de forma declarativa en `packages/core-game/src/fishData.ts` apuntando a un sprite en `assets/sprites/`, de modo que cualquier usuario en GitHub pueda añadir un nuevo pez temático haciendo un *Pull Request* de un PNG y un objeto JSON.

---

## 8. Orden de Ejecución Secuencial (Roadmap de Implementación)
1. **Fase 1 (Esqueleto):** Inicializar el monorepo con Tauri v2 + SolidJS/Svelte + TypeScript + TailwindCSS y verificar que compile limpiamente en escritorio.
2. **Fase 2 (Core Game Engine):** Crear el paquete `core-game` con el estado reactivo, el catálogo inicial de 15 peces (`fishData.ts`), el motor Gacha (con Pity, Shiny y semilla SHA-256), detección de bioma/clima por regex y el loop de economía pasiva + cálculo *offline*.
3. **Fase 3 (Chat + Dock del Acuario):** Construir la UI dividida: panel principal de Chat (conectado a Vercel AI SDK + Ollama local) y el *Dock* inferior colapsable del Acuario animado por GPU CSS, verificando que al enviar un prompt real o simulado la barra suba y capture peces.
4. **Fase 4 (Progresión y Persistencia):** Añadir las vistas de **Bestiario (Pokédex)**, **Tienda de Mejoras**, **Laboratorio de Fusión**, **Eventos Boss Fight** y persistencia en SQLite + llavero del SO + Modo System Tray Headless.
5. **Fase 5 (Control Remoto y Sync Híbrido):** Implementar el módulo de sincronización con GitHub Gists (`mergeStates`), el servidor WebSocket en Rust (`axum`) con generación de código QR y la PWA móvil con Modo Companion Screen.