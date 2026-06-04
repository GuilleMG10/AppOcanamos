import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CulturaChupistica({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧠</Text>
      <Text style={styles.title}>Cultura Chupística</Text>
      <Text style={styles.subtitle}>
        Es hora de Cultura Chupística
      </Text>
      <Text style={styles.instruccion}>
        El jugador activo pone la categoría en voz alta.{'\n'}
        El grupo juega y el que falla... toma.
      </Text>

      <TouchableOpacity
        style={styles.btnSiguiente}
        onPress={() => navigation.navigate('EndRound')}
      >
        <Text style={styles.btnSiguienteText}>Siguiente ronda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    color: '#5DCAA5',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  instruccion: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  btnSiguiente: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: '#5DCAA5',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnSiguienteText: {
    color: '#0a0a14',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
