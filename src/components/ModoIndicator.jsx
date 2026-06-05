import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function ModoIndicator() {
  const { state } = useGame();
  if (state.modo !== 'heavy') return null;
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>🔥 MODO HEAVY SHIT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#2a0a00',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF4500',
    alignSelf: 'stretch',
  },
  text: {
    color: '#FF4500',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
