import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function TurnoIndicator() {
  const { state } = useGame();
  const jugador = state.jugadores[state.turnoActual];
  if (!jugador) return null;
  return (
    <Text style={styles.text}>
      👤 Turno de <Text style={styles.nombre}>{jugador.nombre}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#888',
    fontSize: 15,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  nombre: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
