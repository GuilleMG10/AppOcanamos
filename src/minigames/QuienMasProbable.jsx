import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { quienMasProbable } from '../data/quienMasProbable';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const TOTAL_RONDAS = 3;
const _usadasSesion = new Set();

const REGLAS = [
  'Se juegan 3 preguntas en total',
  'Se lee "¿Quién es más probable que...?"',
  'Todos señalan al mismo tiempo al que creen más probable',
  'El más señalado toma un sorbo',
  'Después de las 3 preguntas termina la ronda',
];

function itemAleatorio(usados) {
  const disponibles = quienMasProbable.filter((_, i) => !usados.includes(i) && !_usadasSesion.has(i));
  const pool = disponibles.length > 0 ? disponibles : quienMasProbable.filter((_, i) => !usados.includes(i));
  if (pool.length === 0) return { item: quienMasProbable[0], index: 0 };
  const idx = Math.floor(Math.random() * pool.length);
  const item = pool[idx];
  const index = quienMasProbable.indexOf(item);
  _usadasSesion.add(index);
  return { item, index };
}

export default function QuienMasProbable({ navigation }) {
  const [usados, setUsados] = useState([]);
  const [{ item, index }, setActual] = useState(() => {
    const i = Math.floor(Math.random() * quienMasProbable.length);
    return { item: quienMasProbable[i], index: i };
  });
  const [ronda, setRonda] = useState(1);
  const [reglasVisible, setReglasVisible] = useState(false);

  function siguiente() {
    const nuevosUsados = [...usados, index];
    const siguienteRonda = ronda + 1;
    if (siguienteRonda > TOTAL_RONDAS) {
      navigation.navigate('EndRound');
      return;
    }
    const next = itemAleatorio(nuevosUsados);
    setUsados(nuevosUsados);
    setActual(next);
    setRonda(siguienteRonda);
  }

  const esUltima = ronda === TOTAL_RONDAS;

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="👆 ¿Quién más probable? — Reglas" color="#D4537E" reglas={REGLAS} />

      <View style={styles.header}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>👆 ¿Quién es más probable?</Text>
        <Text style={styles.rondaText}>{ronda}/{TOTAL_RONDAS}</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      <View style={styles.card}>
        <Text style={styles.pregunta}>{item.pregunta}</Text>
      </View>

      <Text style={styles.regla}>
        Todos señalan al mismo tiempo.{'\n'}El más señalado toma. 🍺
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btnSiguiente, esUltima && styles.btnFinal]} onPress={siguiente}>
          <Text style={styles.btnSiguienteText}>
            {esUltima ? 'Terminar ronda' : `Siguiente → (${ronda}/${TOTAL_RONDAS})`}
          </Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    color: '#D4537E',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  rondaText: {
    color: '#D4537E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnInfo: { padding: 4 },
  btnInfoText: { fontSize: 22 },
  card: {
    backgroundColor: '#1e0a18',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4537E',
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  pregunta: { color: '#fff', fontSize: 26, textAlign: 'center', fontWeight: 'bold', lineHeight: 34 },
  regla: { color: '#888', fontSize: 18, textAlign: 'center', lineHeight: 26, marginBottom: 40 },
  actions: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  btnSiguiente: {
    backgroundColor: '#D4537E',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnFinal: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#D4537E',
  },
  btnSiguienteText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
