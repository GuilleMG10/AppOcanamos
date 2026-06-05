import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function EspejoIndicator() {
  const { state } = useGame();
  const espejos = state.jugadores.filter(j => j.espejo).map(j => j.nombre);
  if (espejos.length === 0) return null;
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>👁 Espejo: {espejos.join(' · ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#1e1500',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignSelf: 'stretch',
  },
  text: {
    color: '#FFD700',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
