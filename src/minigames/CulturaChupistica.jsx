import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const REGLAS = [
  'El jugador activo elige una categoría en voz alta (ej: capitales, jugadores de fútbol, marcas de autos...)',
  'El grupo va nombrando cosas de esa categoría en orden',
  'El primero que no pueda nombrar una o que repita una ya dicha, toma',
];

export default function CulturaChupistica({ navigation }) {
  const [reglasVisible, setReglasVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🧠 Cultura Chupística — Reglas" color="#5DCAA5" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>Cultura Chupística</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      <Text style={styles.emoji}>🧠</Text>
      <Text style={styles.subtitle}>Es hora de Cultura Chupística</Text>
      <Text style={styles.instruccion}>
        El jugador activo pone la categoría en voz alta.{'\n'}
        El grupo juega y el que falla... toma.
      </Text>

      <TouchableOpacity style={styles.btnSiguiente} onPress={() => navigation.navigate('EndRound')}>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  title: {
    color: '#5DCAA5',
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
  },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
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
