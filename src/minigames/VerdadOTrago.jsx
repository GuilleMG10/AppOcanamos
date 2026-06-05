import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { verdades } from '../data/verdades';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const MAX_INTENTOS = 3;
const CANTIDADES = ['1 sorbo', '2 sorbos', '3 sorbos', 'medio vaso'];

const REGLAS = [
  'El jugador activo elige: Verdad o Trago',
  'Trago → toma directo y termina la ronda',
  `Verdad → tenés ${MAX_INTENTOS} preguntas para responder al menos una`,
  'Respondió → pasa la ronda sin tomar',
  `Tomó ${MAX_INTENTOS} veces → tomá 2 sorbos`,
];

function preguntaAleatoria(usadas) {
  const disponibles = verdades.filter((_, i) => !usadas.includes(i));
  if (disponibles.length === 0) return { item: verdades[Math.floor(Math.random() * verdades.length)], index: 0 };
  const idx = Math.floor(Math.random() * disponibles.length);
  return { item: disponibles[idx], index: verdades.indexOf(disponibles[idx]) };
}

export default function VerdadOTrago({ navigation }) {
  const [eleccion, setEleccion] = useState(null);
  const [usadas, setUsadas] = useState([]);
  const [{ item, index }, setActual] = useState(() => {
    const i = Math.floor(Math.random() * verdades.length);
    return { item: verdades[i], index: i };
  });
  const [intentos, setIntentos] = useState(0);
  const [fase, setFase] = useState('eligiendo'); // eligiendo | verdad | trago | aprobado | penalizado
  const [cantidadPenalidad] = useState(() => CANTIDADES[Math.floor(Math.random() * CANTIDADES.length)]);
  const [reglasVisible, setReglasVisible] = useState(false);

  function elegirVerdad() {
    setEleccion('verdad');
    setFase('verdad');
  }

  function responder(correcto) {
    if (correcto) {
      setFase('aprobado');
      return;
    }
    const nuevosIntentos = intentos + 1;
    setIntentos(nuevosIntentos);
    if (nuevosIntentos >= MAX_INTENTOS) {
      setFase('penalizado');
      return;
    }
    const nuevasUsadas = [...usadas, index];
    const next = preguntaAleatoria(nuevasUsadas);
    setUsadas(nuevasUsadas);
    setActual(next);
  }

  if (fase === 'aprobado') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🍺 Verdad o Trago</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>✅</Text>
          <Text style={styles.resultText}>¡Respondió correctamente!</Text>
          <Text style={[styles.resultSub, { color: '#5DCAA5' }]}>Nadie toma</Text>
        </View>
        <TouchableOpacity style={styles.btnTerminar} onPress={() => navigation.navigate('EndRound')}>
          <Text style={styles.btnTerminarText}>Terminar ronda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (fase === 'penalizado') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🍺 Verdad o Trago</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>🍺</Text>
          <Text style={styles.resultText}>Falló las {MAX_INTENTOS}</Text>
          <Text style={[styles.resultSub, { color: '#E24B4A' }]}>Tomá {cantidadPenalidad}</Text>
        </View>
        <TouchableOpacity style={styles.btnTerminar} onPress={() => navigation.navigate('EndRound')}>
          <Text style={styles.btnTerminarText}>Terminar ronda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🍺 Verdad o Trago — Reglas" color="#97C459" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🍺 Verdad o Trago</Text>
        {fase === 'verdad' && (
          <Text style={styles.intentosText}>Intento {intentos + 1}/{MAX_INTENTOS}</Text>
        )}
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      {fase === 'eligiendo' && (
        <View style={styles.eleccion}>
          <Text style={styles.elige}>¿Qué elegís?</Text>
          <TouchableOpacity style={styles.btnVerdad} onPress={elegirVerdad}>
            <Text style={styles.btnVerdadText}>Verdad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnTrago} onPress={() => setFase('trago')}>
            <Text style={styles.btnTragoText}>Trago</Text>
          </TouchableOpacity>
        </View>
      )}

      {fase === 'verdad' && item && (
        <View style={styles.verdadBox}>
          <Text style={styles.verdadLabel}>Tu pregunta:</Text>
          <Text style={styles.verdadPregunta}>{item.pregunta}</Text>
          <View style={styles.verdadActions}>
            <TouchableOpacity style={styles.btnRespondio} onPress={() => responder(true)}>
              <Text style={styles.btnRespondioText}>✅ Respondió</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnTomo} onPress={() => responder(false)}>
              <Text style={styles.btnTomoText}>
                ❌ Tomó {intentos + 1 < MAX_INTENTOS ? `(quedan ${MAX_INTENTOS - intentos - 1})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {fase === 'trago' && (
        <View style={styles.tragoBox}>
          <Text style={styles.tragoEmoji}>🍺</Text>
          <Text style={styles.tragoTexto}>¡Elegiste trago!{'\n'}Tomá directo.</Text>
        </View>
      )}

      {fase === 'trago' && (
        <TouchableOpacity style={styles.btnTerminar} onPress={() => navigation.navigate('EndRound')}>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    color: '#97C459',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  intentosText: {
    color: '#97C459',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  eleccion: {
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  elige: { color: '#fff', fontSize: 22, marginBottom: 8 },
  btnVerdad: {
    backgroundColor: '#97C459',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnVerdadText: { color: '#0a0a14', fontSize: 22, fontWeight: 'bold' },
  btnTrago: {
    backgroundColor: '#E24B4A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnTragoText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  verdadBox: {
    backgroundColor: '#0a1a0a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#97C459',
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  verdadLabel: { color: '#97C459', fontSize: 14, marginBottom: 12 },
  verdadPregunta: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 24,
  },
  verdadActions: { flexDirection: 'row', gap: 12, width: '100%' },
  btnRespondio: {
    flex: 1,
    backgroundColor: '#5DCAA5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnRespondioText: { color: '#0a0a14', fontWeight: 'bold', fontSize: 16 },
  btnTomo: {
    flex: 1,
    backgroundColor: '#E24B4A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnTomoText: { color: '#fff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  tragoBox: { alignItems: 'center', marginBottom: 24 },
  tragoEmoji: { fontSize: 80, marginBottom: 16 },
  tragoTexto: { color: '#fff', fontSize: 26, textAlign: 'center', fontWeight: 'bold' },
  resultBox: { alignItems: 'center', marginBottom: 40, gap: 12 },
  resultEmoji: { fontSize: 80 },
  resultText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  resultSub: { fontSize: 22, fontWeight: 'bold' },
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
  btnTerminarText: { color: '#97C459', fontSize: 18, fontWeight: 'bold' },
});
