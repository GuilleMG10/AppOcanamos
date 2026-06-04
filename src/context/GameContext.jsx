import React, { createContext, useContext, useReducer } from 'react';
import { cartasEspeciales } from '../data/cartasEspeciales';

const initialState = {
  jugadores: [],
  turnoActual: 0,
  rondaActual: 1,
  minijuegoActual: null,
  minijuegoAnterior: null,
  ruletaRusa: {
    camaras: [],
    disparosHechos: 0,
  },
  ruletaMuerte: {
    jugadoresActivos: [],
    eliminados: [],
  },
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_JUGADOR':
      return {
        ...state,
        jugadores: [
          ...state.jugadores,
          { nombre: action.nombre, espejo: false, cartas: [] },
        ],
      };

    case 'ELIMINAR_JUGADOR':
      return {
        ...state,
        jugadores: state.jugadores.filter((_, i) => i !== action.index),
      };

    case 'SIGUIENTE_TURNO': {
      const siguiente = (state.turnoActual + 1) % state.jugadores.length;
      return {
        ...state,
        turnoActual: siguiente,
        rondaActual: state.rondaActual + 1,
        minijuegoAnterior: state.minijuegoActual,
      };
    }

    case 'SET_MINIJUEGO':
      return { ...state, minijuegoActual: action.minijuego };

    case 'ACTIVAR_ESPEJO': {
      const jugadores = state.jugadores.map((j, i) =>
        i === action.jugadorIndex ? { ...j, espejo: true } : j
      );
      return { ...state, jugadores };
    }

    case 'ASIGNAR_CARTA_ESPECIAL': {
      const jugadores = state.jugadores.map((j, i) => {
        if (i !== action.jugadorIndex) return j;
        if (j.cartas.length >= 2) return j;
        return { ...j, cartas: [...j.cartas, action.carta] };
      });
      return { ...state, jugadores };
    }

    case 'USAR_CARTA_ESPECIAL': {
      const jugadores = state.jugadores.map((j, i) => {
        if (i !== action.jugadorIndex) return j;
        return { ...j, cartas: j.cartas.filter(c => c.id !== action.cartaId) };
      });
      return { ...state, jugadores };
    }

    case 'REINICIAR_RULETA_RUSA': {
      const balaPos = Math.floor(Math.random() * 6);
      const camaras = Array(6).fill(false).map((_, i) => i === balaPos);
      return {
        ...state,
        ruletaRusa: { camaras, disparosHechos: 0 },
      };
    }

    case 'DISPARAR_RULETA_RUSA':
      return {
        ...state,
        ruletaRusa: {
          ...state.ruletaRusa,
          disparosHechos: state.ruletaRusa.disparosHechos + 1,
        },
      };

    case 'INIT_RULETA_MUERTE':
      return {
        ...state,
        ruletaMuerte: {
          jugadoresActivos: state.jugadores.map(j => j.nombre),
          eliminados: [],
        },
      };

    case 'ELIMINAR_DE_RULETA_MUERTE': {
      const pos = state.ruletaMuerte.eliminados.length + 1;
      const activos = state.ruletaMuerte.jugadoresActivos.filter(
        n => n !== action.nombre
      );
      let tragos = `${pos} sorbo${pos > 1 ? 's' : ''}`;
      if (pos === 4 || pos === 5) tragos = 'medio vaso';
      if (pos > 5) tragos = 'medio vaso';
      if (activos.length === 0) tragos = 'vaso entero';

      return {
        ...state,
        ruletaMuerte: {
          jugadoresActivos: activos,
          eliminados: [
            ...state.ruletaMuerte.eliminados,
            { nombre: action.nombre, posicion: pos, tragos },
          ],
        },
      };
    }

    case 'NUEVA_PARTIDA':
      return { ...initialState };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
