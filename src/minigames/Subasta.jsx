import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';
import { cartasEspeciales } from '../data/cartasEspeciales';
import CardSpecial from '../components/CardSpecial';
import Timer from '../components/Timer';

function cartaAleatoria() {
  return cartasEspeciales[Math.floor(Math.random() * cartasEspeciales.length)];
}

export default function Subasta({ navigation }) {
  const { state, dispatch } = useGame();
  const [carta] = useState(cartaAleatoria());
  const [fase, setFase] = useState('preview');
  const [timerDone, setTimerDone] = useState(false);
  const [ganador, setGanador] = useState(null);

  function asignarGanador(jugadorIndex) {
    const jugador = state.jugadores[jugadorIndex];
    if (jugador.cartas.length >= 2) {
      Alert.alert(
        'Inventario lleno',
        `${jugador.nombre} ya tiene 2 cartas. Debe descartar una primero en EndRound.`,
        [{ text: 'OK' }]
      );
      return;
    }
    dispatch({ type: 'ASIGNAR_CARTA_ESPECIAL', jugadorIndex, carta });
    setGanador(jugador.nombre);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔨 Subasta</Text>
      <Text style={styles.badge}>Carta especial en juego</Text>

      <CardSpecial carta={carta} />

      {fase === 'preview' && (
        <TouchableOpacity style={styles.btnIniciar} onPress={() => setFase('cronometro')}>
          <Text style={styles.btnIniciarText}>Iniciar subasta</Text>
        </TouchableOpacity>
      )}

      {fase === 'cronometro' && !timerDone && (
        <View style={styles.timerSection}>
          <Text style={styles.timerLabel}>Las apuestas son en voz alta</Text>
          <Timer seconds={60} onEnd={() => setTimerDone(true)} />
          <TouchableOpacity
            style={styles.btnDescartar}
            onPress={() => navigation.navigate('EndRound')}
          >
            <Text style={styles.btnDescartarText}>Nadie quiere — descartar</Text>
          </TouchableOpacity>
        </View>
      )}

      {(timerDone || fase === 'ganador') && !ganador && (
        <View style={styles.ganadorSection}>
          <Text style={styles.ganadorTitle}>¿Quién ganó la subasta?</Text>
          {state.jugadores.map((j, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.btnJugador, j.cartas.length >= 2 && styles.btnJugadorLleno]}
              onPress={() => asignarGanador(i)}
            >
              <Text style={styles.btnJugadorText}>
                {j.nombre} {j.cartas.length >= 2 ? '(lleno)' : `(${j.cartas.length}/2 cartas)`}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.btnDescartar}
            onPress={() => navigation.navigate('EndRound')}
          >
            <Text style={styles.btnDescartarText}>Nadie quiere — descartar</Text>
          </TouchableOpacity>
        </View>
      )}

      {ganador && (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>✅ Carta asignada a {ganador}</Text>
          <TouchableOpacity
            style={styles.btnSiguiente}
            onPress={() => navigation.navigate('EndRound')}
          >
            <Text style={styles.btnSiguienteText}>Siguiente ronda</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  container: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    color: '#AFA9EC',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badge: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  btnIniciar: {
    backgroundColor: '#AFA9EC',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  btnIniciarText: {
    color: '#0a0a14',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerSection: {
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  timerLabel: {
    color: '#888',
    fontSize: 16,
    marginBottom: 16,
  },
  btnDescartar: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
    marginTop: 20,
    width: '100%',
  },
  btnDescartarText: {
    color: '#888',
    fontSize: 15,
  },
  ganadorSection: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  ganadorTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  btnJugador: {
    backgroundColor: '#1e1b3a',
    borderWidth: 1,
    borderColor: '#AFA9EC',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnJugadorLleno: {
    opacity: 0.5,
    borderColor: '#555',
  },
  btnJugadorText: {
    color: '#AFA9EC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmBox: {
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    gap: 16,
  },
  confirmText: {
    color: '#5DCAA5',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnSiguiente: {
    backgroundColor: '#AFA9EC',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnSiguienteText: {
    color: '#0a0a14',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
