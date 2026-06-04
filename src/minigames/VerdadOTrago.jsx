import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { verdades } from '../data/verdades';

function preguntaAleatoria() {
  return verdades[Math.floor(Math.random() * verdades.length)];
}

export default function VerdadOTrago({ navigation }) {
  const [eleccion, setEleccion] = useState(null);
  const [pregunta, setPregunta] = useState(null);

  function elegirVerdad() {
    setPregunta(preguntaAleatoria());
    setEleccion('verdad');
  }

  function elegirTrago() {
    setEleccion('trago');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍺 Verdad o Trago</Text>

      {!eleccion && (
        <View style={styles.eleccion}>
          <Text style={styles.elige}>¿Qué elegís?</Text>
          <TouchableOpacity style={styles.btnVerdad} onPress={elegirVerdad}>
            <Text style={styles.btnVerdadText}>Verdad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnTrago} onPress={elegirTrago}>
            <Text style={styles.btnTragoText}>Trago</Text>
          </TouchableOpacity>
        </View>
      )}

      {eleccion === 'verdad' && pregunta && (
        <View style={styles.verdadBox}>
          <Text style={styles.verdadLabel}>Tu pregunta:</Text>
          <Text style={styles.verdadPregunta}>{pregunta.pregunta}</Text>
          <View style={styles.verdadActions}>
            <TouchableOpacity
              style={styles.btnRespondio}
              onPress={() => navigation.navigate('EndRound')}
            >
              <Text style={styles.btnRespondioText}>✅ Respondió</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnTomo}
              onPress={() => navigation.navigate('EndRound')}
            >
              <Text style={styles.btnTomoText}>🍺 Tomó</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {eleccion === 'trago' && (
        <View style={styles.tragoBox}>
          <Text style={styles.tragoEmoji}>🍺</Text>
          <Text style={styles.tragoTexto}>¡Elegiste trago!{'\n'}Tomá directo.</Text>
        </View>
      )}

      {eleccion && (
        <TouchableOpacity
          style={styles.btnTerminar}
          onPress={() => navigation.navigate('EndRound')}
        >
          <Text style={styles.btnTerminarText}>Terminar ronda</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  title: {
    color: '#97C459',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  eleccion: {
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  elige: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 8,
  },
  btnVerdad: {
    backgroundColor: '#97C459',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnVerdadText: {
    color: '#0a0a14',
    fontSize: 22,
    fontWeight: 'bold',
  },
  btnTrago: {
    backgroundColor: '#E24B4A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnTragoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  verdadBox: {
    backgroundColor: '#0a1a0a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#97C459',
    padding: 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  verdadLabel: {
    color: '#97C459',
    fontSize: 14,
    marginBottom: 12,
  },
  verdadPregunta: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 24,
  },
  verdadActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnRespondio: {
    flex: 1,
    backgroundColor: '#5DCAA5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnRespondioText: {
    color: '#0a0a14',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnTomo: {
    flex: 1,
    backgroundColor: '#E24B4A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnTomoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tragoBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tragoEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  tragoTexto: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnTerminar: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#97C459',
  },
  btnTerminarText: {
    color: '#97C459',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
