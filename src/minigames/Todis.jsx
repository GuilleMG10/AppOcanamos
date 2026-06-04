import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

const CASTIGOS = {
  1: { texto: 'TODOS TOMAN 🍺', color: '#EF9F27' },
  2: { texto: 'OBLIGÁS A ALGUIEN', color: '#EF9F27' },
  3: { texto: 'JUGADOR DE LA DERECHA TOMA →', color: '#EF9F27' },
  4: { texto: '← JUGADOR DE LA IZQUIERDA TOMA', color: '#EF9F27' },
  5: { texto: 'TOMÁS SOLO 😬', color: '#EF9F27' },
  6: { texto: 'ELEGÍS A ALGUIEN — ¡ESPEJO!', color: '#FFD700' },
};

const CARAS = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function Todis({ navigation }) {
  const { state, dispatch } = useGame();
  const [resultado, setResultado] = useState(null);
  const [espejoActivado, setEspejoActivado] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  function tirarDado() {
    const num = Math.floor(Math.random() * 6) + 1;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(rotation, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.4, duration: 200, useNativeDriver: true }),
      ]),
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    rotation.setValue(0);
    setResultado(num);
    setEspejoActivado(false);
  }

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  function activarEspejo(idx) {
    dispatch({ type: 'ACTIVAR_ESPEJO', jugadorIndex: idx });
    setEspejoActivado(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎲 Todis</Text>

      <TouchableOpacity onPress={tirarDado} activeOpacity={0.8}>
        <Animated.Text style={[styles.dado, { transform: [{ rotate: spin }, { scale }] }]}>
          {resultado ? CARAS[resultado - 1] : '🎲'}
        </Animated.Text>
      </TouchableOpacity>

      {!resultado && <Text style={styles.hint}>Tocá el dado para tirar</Text>}

      {resultado && (
        <View style={styles.resultadoBox}>
          <Text style={styles.numero}>{resultado}</Text>
          <Text style={styles.castigo}>{CASTIGOS[resultado].texto}</Text>

          {resultado === 6 && !espejoActivado && (
            <View style={styles.espejoSection}>
              <Text style={styles.espejoTitle}>Elegí quién será tu espejo:</Text>
              {state.jugadores.map((j, i) => {
                if (i === state.turnoActual) return null;
                return (
                  <TouchableOpacity
                    key={i}
                    style={styles.btnEspejo}
                    onPress={() => activarEspejo(i)}
                  >
                    <Text style={styles.btnEspejoText}>{j.nombre}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {resultado === 6 && espejoActivado && (
            <Text style={styles.espejoConfirm}>✅ Espejo activado</Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.btnTerminar}
        onPress={() => navigation.navigate('EndRound')}
      >
        <Text style={styles.btnTerminarText}>Terminar ronda</Text>
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
    padding: 24,
  },
  title: {
    color: '#EF9F27',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  dado: {
    fontSize: 120,
    marginBottom: 24,
  },
  hint: {
    color: '#555',
    fontSize: 16,
    marginBottom: 40,
  },
  resultadoBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  numero: {
    color: '#EF9F27',
    fontSize: 64,
    fontWeight: 'bold',
  },
  castigo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  espejoSection: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  espejoTitle: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 8,
  },
  btnEspejo: {
    backgroundColor: '#1e1a00',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  btnEspejoText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  espejoConfirm: {
    color: '#5DCAA5',
    fontSize: 18,
    marginTop: 16,
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
    borderColor: '#EF9F27',
  },
  btnTerminarText: {
    color: '#EF9F27',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
