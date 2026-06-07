# O Cañamos? 🍺

> El juego para cañarse entre reales.

Aplicación móvil de juego de bebidas para grupos, diseñada para ser jugada en un solo dispositivo Android que se pasa de mano en mano. Incluye 12 minijuegos distintos, cartas especiales, sistema de turnos y animaciones para hacer cada ronda más divertida.

---

## Minijuegos

| # | Nombre | Descripción |
|---|--------|-------------|
| 1 | 🎲 Todis | Tirás un dado — cada número tiene un castigo distinto. El 6 activa el espejo. |
| 2 | 🃏 Cartas | Retos y preguntas. Si lo hacés, pasás. Si no, sumás 2 sorbos al contador. |
| 3 | 🧠 Trivia | 3 intentos para acertar al menos 1 pregunta (fácil o difícil). Si fallás las 3, tomás. |
| 4 | 🙅 Yo Nunca Nunca | 3 frases por ronda. El que lo hizo toma. Sin castigo por pasar. |
| 5 | 🤔 ¿Quién es más probable? | 3 preguntas grupales. El grupo señala a alguien, ese toma. |
| 6 | 💬 Verdad o Trago | Verdad: 3 intentos para responder. Trago: bebés directamente. |
| 7 | 🔫 Ruleta Rusa | 6 disparos, 1 bala. Se pasa el celular de mano en mano. El que recibe la bala toma un vaso entero. |
| 8 | 💀 Ruleta de la Muerte | Todos van cayendo en orden. El último en quedar pierde y toma un vaso. |
| 9 | 🏷️ Subasta | Timer de 30 segundos. El que ofrece más sorbos gana una carta especial. |
| 10 | 🔴 Botón del Caos | Presionás el botón sin saber qué va a pasar — puede ser bueno o un castigo. |
| 11 | 🎓 Cultura Chupística | Preguntas de cultura general con penalidades. |
| 12 | 🤥 La Hora del Mentiroso | Uno miente, el grupo lo descubre. El que pierde toma. |

---

## Cartas Especiales

Las cartas se ganan en la Subasta y se usan desde el inventario:

- **Escudo** — Te salvás de tomar una vez
- **Doble castigo** — El próximo castigo es doble para quien lo recibe
- **Inmunosorbo** — Sos inmune a la próxima ronda de castigos
- **Revancha** — Jugás de vuelta el último minijuego
- **Carta Comodín** — Elegís quién toma en tu lugar
- **Espejo inverso** — Transferís tu espejo a otro jugador

---

## Stack Técnico

- **React Native** con **Expo SDK 54** (managed workflow)
- **React Navigation v7** — stack con transiciones horizontales
- **useReducer + Context API** — estado global del juego
- **Animated API** — dado, slot machine, splash, botón del caos
- **Vibration API** — feedback háptico (sin archivos de audio)
- **expo-screen-orientation** — orientación bloqueada en portrait
- **EAS Build** — generación del APK para Android

---

## Estructura del Proyecto

```
ocanamos/
├── assets/
│   └── logo.png
├── src/
│   ├── context/
│   │   └── GameContext.jsx       # Estado global con useReducer
│   ├── screens/
│   │   ├── SplashScreen.jsx      # Animación de entrada
│   │   ├── HomeScreen.jsx        # Pantalla principal
│   │   ├── PlayersScreen.jsx     # Alta de jugadores
│   │   ├── RevealScreen.jsx      # Slot machine — revela el minijuego
│   │   ├── EndRoundScreen.jsx    # Fin de ronda, uso de cartas
│   │   ├── GameOverScreen.jsx    # Fin de partida
│   │   └── InventoryScreen.jsx   # Inventario de cartas
│   ├── minigames/
│   │   ├── Todis.jsx
│   │   ├── Cartas.jsx
│   │   ├── Trivia.jsx
│   │   ├── YoNuncaNunca.jsx
│   │   ├── QuienMasProbable.jsx
│   │   ├── VerdadOTrago.jsx
│   │   ├── RuletaRusa.jsx
│   │   ├── RuletaMuerte.jsx
│   │   ├── Subasta.jsx
│   │   ├── BotonCaos.jsx
│   │   ├── CulturaChupistica.jsx
│   │   └── HoraDelMentiroso.jsx
│   ├── components/
│   │   ├── ReglasModal.jsx       # Modal de reglas por minijuego
│   │   ├── EspejoIndicator.jsx   # Banner de jugadores espejo
│   │   ├── TurnoIndicator.jsx    # Turno actual
│   │   ├── CardSpecial.jsx       # Carta expandible
│   │   ├── BackToHomeButton.jsx  # Con confirmación antes de salir
│   │   ├── PlayerAvatar.jsx
│   │   └── Timer.jsx
│   ├── data/
│   │   ├── trivia.js             # 47 preguntas con dificultad
│   │   ├── cartas.js             # 48 retos y preguntas
│   │   ├── nuncaNunca.js         # 49 frases
│   │   ├── quienMasProbable.js   # 48 preguntas
│   │   ├── verdades.js           # 40 verdades
│   │   └── cartasEspeciales.js   # Definición de cartas
│   └── utils/
│       └── sounds.js             # Patrones de vibración
├── App.js
├── app.json
├── eas.json
└── package.json
```

---

## Instalación y Desarrollo

### Requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Cuenta en [expo.dev](https://expo.dev)

### Correr localmente

```bash
npm install
npx expo start
```

Escaneá el QR con Expo Go (SDK 54) desde tu celular Android o iOS.

---

## Generar APK para Android

```bash
eas build -p android --profile preview
```

El APK se sube a expo.dev/builds. Descargalo desde el link que aparece en la consola o en tu cuenta de Expo.

> **Nota:** Al instalar el APK en Android, debés habilitar "Instalar apps de fuentes desconocidas" en los ajustes de tu teléfono.  
> Ajustes → Aplicaciones → (la app con la que descargaste el APK) → Instalar apps desconocidas → Permitir.

---

## Configuración EAS

El archivo `eas.json` está configurado para:

- **preview** — genera un `.apk` para distribución interna (testeo en dispositivos físicos)
- **production** — build firmado para Play Store con auto-increment de versión

---

## Créditos

Desarrollado para reuniones y juntadas en Bolivia. 🇧🇴  
**Jugá con responsabilidad.**
