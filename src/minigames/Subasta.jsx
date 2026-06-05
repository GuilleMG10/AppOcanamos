import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';
import { cartasEspeciales } from '../data/cartasEspeciales';
import CardSpecial from '../components/CardSpecial';
import Timer from '../components/Timer';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const REGLAS = [
  'Se revela una carta especial con un poder único',
  'Presionás "Iniciar subasta" y arranca el cronómetro de 30 segundos',
  'Los jugadores pujan en voz alta — la apuesta es la cantidad que están dispuestos a tomar',
  'El que ofrece más gana la carta',
  'Al terminar el tiempo elegís quién ganó',
  'Si el ganador tiene 2 cartas, descarta una para quedarse con la nueva',
  'Si nadie quiere la carta, se descarta',
];

function cartaAleatoria() {
  return cartasEspeciales[Math.floor(Math.random() * cartasEspeciales.length)];
}

export default function Subasta({ navigation }) {
  const { state, dispatch } = useGame();
  const [carta] = useState(cartaAleatoria());
  const [fase, setFase] = useState('preview'); // preview | cronometro | elegirGanador | reemplazar | confirmado
  const [timerDone, setTimerDone] = useState(false);
  const [ganadorNombre, setGanadorNombre] = useState(null);
  const [ganadorIndex, setGanadorIndex] = useState(null);
  const [reglasVisible, setReglasVisible] = useState(false);

  function seleccionarGanador(jugadorIndex) {
    const jugador = state.jugadores[jugadorIndex];
    setGanadorIndex(jugadorIndex);
    if (jugador.cartas.length >= 2) {
      setFase('reemplazar');
    } else {
      dispatch({ type: 'ASIGNAR_CARTA_ESPECIAL', jugadorIndex, carta });
      setGanadorNombre(jugador.nombre);
      setFase('confirmado');
    }
  }

  function descartarYReemplazar(cartaIdADescartar) {
    dispatch({ type: 'USAR_CARTA_ESPECIAL', jugadorIndex: ganadorIndex, cartaId: cartaIdADescartar });
    dispatch({ type: 'ASIGNAR_CARTA_ESPECIAL', jugadorIndex: ganadorIndex, carta });
    setGanadorNombre(state.jugadores[ganadorIndex].nombre);
    setFase('confirmado');
  }

  const faseElegir = timerDone || fase === 'elegirGanador';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🔨 Subasta — Reglas" color="#AFA9EC" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🔨 Subasta</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>
      <TurnoIndicator />
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
          <Timer seconds={30} onEnd={() => setTimerDone(true)} />
          <TouchableOpacity style={styles.btnDescartar} onPress={() => navigation.navigate('EndRound')}>
            <Text style={styles.btnDescartarText}>Nadie quiere — descartar</Text>
          </TouchableOpacity>
        </View>
      )}

      {faseElegir && fase !== 'reemplazar' && fase !== 'confirmado' && (
        <View style={styles.ganadorSection}>
          <Text style={styles.ganadorTitle}>¿Quién ganó la subasta?</Text>
          {state.jugadores.map((j, i) => (
            <TouchableOpacity
              key={i}
              style={styles.btnJugador}
              onPress={() => seleccionarGanador(i)}
            >
              <Text style={styles.btnJugadorText}>{j.nombre}</Text>
              <Text style={styles.btnJugadorSub}>
                {j.cartas.length >= 2 ? '🔄 Reemplaza una carta' : `${j.cartas.length}/2 cartas`}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.btnDescartar} onPress={() => navigation.navigate('EndRound')}>
            <Text style={styles.btnDescartarText}>Nadie quiere — descartar</Text>
          </TouchableOpacity>
        </View>
      )}

      {fase === 'reemplazar' && ganadorIndex !== null && (
        <View style={styles.reemplazarSection}>
          <Text style={styles.ganadorTitle}>
            {state.jugadores[ganadorIndex].nombre} tiene 2 cartas
          </Text>
          <Text style={styles.reemplazarSub}>¿Cuál descartás para quedarte con la nueva?</Text>

          <View style={styles.nuevaCartaBox}>
            <Text style={styles.nuevaCartaLabel}>Carta nueva:</Text>
            <CardSpecial carta={carta} />
          </View>

          <Text style={styles.reemplazarSub}>Cartas actuales — tocá la que querés descartar:</Text>

          {state.jugadores[ganadorIndex].cartas.map((cartaActual) => (
            <TouchableOpacity
              key={cartaActual.id}
              style={styles.btnDescartarCarta}
              onPress={() => descartarYReemplazar(cartaActual.id)}
            >
              <View style={styles.descartarRow}>
                <Text style={styles.descartarEmoji}>🗑️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.descartarNombre}>{cartaActual.nombre}</Text>
                  <Text style={styles.descartarDesc}>{cartaActual.descripcion}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.btnDescartar} onPress={() => navigation.navigate('EndRound')}>
            <Text style={styles.btnDescartarText}>Cancelar — descartar la nueva</Text>
          </TouchableOpacity>
        </View>
      )}

      {fase === 'confirmado' && (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>✅ Carta asignada a {ganadorNombre}</Text>
          <TouchableOpacity style={styles.btnSiguiente} onPress={() => navigation.navigate('EndRound')}>
            <Text style={styles.btnSiguienteText}>Siguiente ronda</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#0a0a14' },
  container: { padding: 24, paddingTop: 60, alignItems: 'center', flexGrow: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  title: { color: '#AFA9EC', fontSize: 30, fontWeight: 'bold' },
  badge: { color: '#888', fontSize: 14, marginBottom: 20 },
  btnIniciar: {
    backgroundColor: '#AFA9EC',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  btnIniciarText: { color: '#0a0a14', fontSize: 20, fontWeight: 'bold' },
  timerSection: { alignItems: 'center', marginTop: 24, width: '100%' },
  timerLabel: { color: '#888', fontSize: 16, marginBottom: 16 },
  btnDescartar: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
    marginTop: 16,
    width: '100%',
  },
  btnDescartarText: { color: '#888', fontSize: 15 },
  ganadorSection: { width: '100%', marginTop: 24, gap: 12 },
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  btnJugadorText: { color: '#AFA9EC', fontSize: 18, fontWeight: 'bold' },
  btnJugadorSub: { color: '#888', fontSize: 12, marginTop: 2 },
  reemplazarSection: { width: '100%', marginTop: 16, gap: 12 },
  reemplazarSub: { color: '#888', fontSize: 14, textAlign: 'center' },
  nuevaCartaBox: { width: '100%', alignItems: 'center', marginVertical: 8 },
  nuevaCartaLabel: { color: '#AFA9EC', fontSize: 14, marginBottom: 4 },
  btnDescartarCarta: {
    backgroundColor: '#1a0a0a',
    borderWidth: 1,
    borderColor: '#E24B4A',
    borderRadius: 14,
    padding: 14,
    width: '100%',
  },
  descartarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  descartarEmoji: { fontSize: 24 },
  descartarNombre: { color: '#E24B4A', fontSize: 16, fontWeight: 'bold' },
  descartarDesc: { color: '#aaa', fontSize: 13, marginTop: 2 },
  confirmBox: { alignItems: 'center', marginTop: 24, width: '100%', gap: 16 },
  confirmText: { color: '#5DCAA5', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  btnSiguiente: {
    backgroundColor: '#AFA9EC',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnSiguienteText: { color: '#0a0a14', fontSize: 18, fontWeight: 'bold' },
});
