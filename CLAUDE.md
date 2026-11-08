# Game Night 游戏之夜

App web multijugador en tiempo real para 2 jugadoras (espanol y chino mandarin).
4 mini-juegos sincronizados + panel de frases rapidas bilingues.
Estetica visual: Crayon Shin-chan.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Real-time:** Sockudo en el VPS (protocolo de Pusher; SDKs `pusher` y `pusher-js`)
- **Estado servidor:** Redis del VPS (cliente `redis`, claves bajo `gn:`)
- **Estado cliente:** Zustand
- **Estilos:** Tailwind CSS 4 + CVA (class-variance-authority)
- **Deploy:** Vercel
- **Fonts:** Bangers (titulos), Nunito (body), Noto Sans SC (chino), JetBrains Mono (pinyin)

## Comandos

```bash
npm run dev      # desarrollo local → http://localhost:3000
npm run build    # build de produccion
npm run lint     # eslint
```

## Estructura del Proyecto

```
game-night/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Lobby: crear/unirse a sala
│   ├── room/[code]/page.tsx      # Sala principal de juego
│   └── api/                      # API Routes (serverless)
│       ├── room/route.ts         # Crear/unirse a sala
│       ├── game/route.ts         # Acciones de juego (reducer)
│       └── pusher-auth/route.ts  # Auth canales presencia
├── components/
│   ├── games/                    # Componentes de cada mini-juego
│   └── ui/                       # Design system (Button, Card, Badge, etc.)
├── hooks/                        # usePusher, useTimer
└── lib/                          # Logica core
    ├── types.ts                  # Tipos TypeScript compartidos
    ├── redis.ts                  # Cliente Redis (REDIS_URL)
    ├── pusher.ts                 # Cliente/servidor Pusher apuntando a Sockudo
    ├── store.ts                  # Zustand store
    ├── gameData.ts               # 383 items bilingues (contenido de juegos)
    └── gameLogic.ts              # processAction() — reducer puro
```

## Arquitectura

### Flujo de datos
```
Cliente → POST /api/game → Redis (leer estado) → processAction() → Redis (escribir) → Pusher broadcast → Ambos clientes
```

### Principios
- **Server-authoritative:** Toda la logica de juego corre en el server (API routes). Los clientes son renderers.
- **Sin optimistic updates:** El cliente espera el broadcast de Pusher antes de actualizar la UI.
- **Redis JSON blob:** Cada sala es un unico JSON en Redis con TTL de 24h. No se usan hashes.
- **Trazos de Pictionary:** pasan por `/api/game` y se difunden sin guardarse en Redis. Sockudo no acepta client events.

### Eventos Pusher (canal: presence-room-{CODE})
- `game:state-update` — Estado completo del juego
- `game:player-joined` — Jugadora se unio
- `game:chat` — Frase rapida enviada
- `client-draw-stroke` — Trazos de Pictionary (client event)

## Design System (Shin-chan)

### Colores primarios
| Token | Hex | Uso |
|---|---|---|
| shin-red | #E8272A | CTAs, botones primarios |
| shin-yellow | #FFD700 | Highlights, badges |
| shin-blue | #1B5FAA | Headers, links |
| shin-black | #1A1A1A | Contornos, texto |
| shin-cream | #FFF5E1 | Fondo principal |

### Reglas visuales
- Bordes GRUESOS (3-5px) en todo. Sin gradientes. Colores planos.
- Sombras solidas desplazadas (e.g., `shadow-[6px_6px_0_#1A1A1A]`)
- Botones: hover salta 4px arriba, active se aplasta
- Animaciones exageradas: @shin-bounce, @shin-wiggle, @shin-pop, @shin-slam, @shin-shake
- Onomatopeyas manga (CORRECTO!, BOOM!, WOW!) como overlays animados
- Tipografia: Bangers para titulos (MAYUSCULAS), Nunito para body, Noto Sans SC para chino
- Nunca font-weight < 400. Titulos de juego siempre en Bangers MAYUSCULAS.
- ES y ZH siempre en el mismo tamano — igualdad de idiomas.

### Componentes (CVA)
Los componentes UI usan `class-variance-authority` para variantes:
- `Button`: primary | secondary | ghost | success | danger
- `Card`: game | player | question | phrase | score | result
- `Badge`: points | turn | language | online
- `Input`: default | error | success | code

## Contenido Bilingue

Todo el contenido esta en `lib/gameData.ts`:
- 142 palabras Pictionary (7 categorias)
- 40 preguntas Trivia (6 categorias, 4 opciones + explicacion)
- 96 pares Memory (6 decks de 16 pares ES↔ZH)
- 70 tarjetas Verdad o Reto (35+35, 3 niveles dificultad)
- 35 frases rapidas (con Pinyin)

## Documentos de Referencia

- `GameNight_Documento_Tecnico.md` — Arquitectura, APIs, deploy
- `GameNight_DisenovVisual_ShinChan.md` — Design system completo, componentes, animaciones
- `GameNight_Contenido_Juegos.md` — Todo el contenido bilingue

## Convenciones

- Archivos de componente en PascalCase: `Button.tsx`, `Trivia.tsx`
- Archivos lib/hooks en camelCase: `gameData.ts`, `usePusher.ts`
- Imports con alias `@/`: `import { Button } from '@/components/ui/Button'`
- Tipos compartidos en `lib/types.ts` — nunca duplicar definiciones de tipos
- gameLogic.ts es una funcion pura: `processAction(state, playerId, action) => newState` — sin side effects, sin imports de Redis/Pusher
- Todo texto visible es bilingue (ES + ZH). Usar el campo `lang` del jugador para decidir que mostrar.

## Environment Variables

```
NEXT_PUBLIC_PUSHER_KEY=       # App key de Sockudo (cliente; en deploy-build.env)
NEXT_PUBLIC_PUSHER_HOST=      # Host público de Sockudo (cliente; en deploy-build.env)
NEXT_PUBLIC_PUSHER_TLS=       # "false" para un Sockudo local sin TLS
NEXT_PUBLIC_PUSHER_PORT=      # 443 por defecto con TLS, 6001 sin TLS
PUSHER_APP_ID=                # App ID de Sockudo (solo servidor)
PUSHER_SECRET=                # Secret de Sockudo (solo servidor)
PUSHER_HOST=                  # Host interno de Sockudo (solo servidor)
PUSHER_PORT=                  # 6001 por defecto
PUSHER_USE_TLS=               # "true" si el servidor habla TLS con Sockudo
REDIS_URL=                    # rediss://... (solo servidor)
```

Nunca exponer PUSHER_SECRET ni REDIS_URL en el cliente.
