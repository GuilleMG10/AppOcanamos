import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { trivia } from '../data/trivia';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const MAX_INTENTOS = 3;
const _usadasSesion = new Set();

const REGLAS = [
  `Tenés ${MAX_INTENTOS} preguntas para responder al menos una correctamente`,
  'Sabía → pasás la ronda sin tomar',
  'Tomó → siguiente pregunta (si quedan intentos)',
  `Si fallás las ${MAX_INTENTOS} → tomás 2 sorbos`,
];

function preguntaAleatoria(usadas) {
  const disponibles = trivia.filter((_, i) => !usadas.includes(i) && !_usadasSesion.has(i));
  const pool = disponibles.length > 0 ? disponibles : trivia.filter((_, i) => !usadas.includes(i));
  if (pool.length === 0) return { item: trivia[Math.floor(Math.random() * trivia.length)], index: 0 };
  const idx = Math.floor(Math.random() * pool.length);
  const item = pool[idx];
  const index = trivia.indexOf(item);
  _usadasSesion.add(index);
  return { item, index };
}

export default function Trivia({ navigation }) {
  const [usadas, setUsadas] = useState([]);
  const [{ item, index }, setActual] = useState(() => {
    const i = Math.floor(Math.random() * trivia.length);
    return { item: trivia[i], index: i };
  });
  const [visible, setVisible] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [fase, setFase] = useState('jugando'); // jugando | aprobado | penalizado
  const [reglasVisible, setReglasVisible] = useState(false);

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
    setVisible(false);
  }

  if (fase === 'aprobado') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>❓ Trivia</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>✅</Text>
          <Text style={styles.resultText}>¡Respondió correctamente!</Text>
          <Text style={styles.resultSub}>Nadie toma</Text>
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
        <Text style={styles.title}>❓ Trivia</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>🍺</Text>
          <Text style={styles.resultText}>Fallaste las {MAX_INTENTOS}</Text>
          <Text style={styles.penaltySubtext}>Tomá 2 sorbos</Text>
        </View>
        <TouchableOpacity style={styles.btnTerminar} onPress={() => navigation.navigate('EndRound')}>
          <Text style={styles.btnTerminarText}>Terminar ronda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="❓ Trivia — Reglas" color="#E24B4A" reglas={REGLAS} />

      <View style={styles.header}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>❓ Trivia</Text>
        <Text style={styles.intentosText}>Intento {intentos + 1}/{MAX_INTENTOS}</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />
      {item.dificultad && (
        <View style={[styles.diffBadge, item.dificultad === 'dificil' && styles.diffBadgeDificil]}>
          <Text style={styles.diffText}>{item.dificultad === 'dificil' ? '🔥 Difícil' : '⭐ Fácil'}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.pregunta}>{item.pregunta}</Text>
        {!visible ? (
          <TouchableOpacity style={styles.btnVer} onPress={() => setVisible(true)}>
            <Text style={styles.btnVerText}>Ver respuesta</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.respuestaBox}>
            <Text style={styles.respuestaLabel}>Respuesta:</Text>
            <Text style={styles.respuesta}>{item.respuesta}</Text>
          </View>
        )}
      </View>

      {visible && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSabia} onPress={() => responder(true)}>
            <Text style={styles.btnSabiaText}>✅ Sabía</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnTomo} onPress={() => responder(false)}>
            <Text style={styles.btnTomoText}>
              ❌ No sabía {intentos + 1 < MAX_INTENTOS ? `(quedan ${MAX_INTENTOS - intentos - 1})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    color: '#E24B4A',
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
  },
  intentosText: {
    color: '#E24B4A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnInfo: { padding: 4 },
  btnInfoText: { fontSize: 22 },
  card: {
    backgroundColor: '#1e0a0a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E24B4A',
    padding: 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  pregunta: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 20,
  },
  btnVer: {
    backgroundColor: '#E24B4A',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnVerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  respuestaBox: { alignItems: 'center' },
  respuestaLabel: { color: '#E24B4A', fontSize: 14, marginBottom: 6 },
  respuesta: { color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: 'bold' },
  actions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  btnSabia: {
    flex: 1,
    backgroundColor: '#5DCAA5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnSabiaText: { color: '#0a0a14', fontWeight: 'bold', fontSize: 16 },
  btnTomo: {
    flex: 1,
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnTomoText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  resultBox: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  resultEmoji: { fontSize: 80 },
  resultText: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  resultSub: { color: '#5DCAA5', fontSize: 20, fontWeight: 'bold' },
  penaltySubtext: { color: '#E24B4A', fontSize: 24, fontWeight: 'bold' },
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
    borderColor: '#E24B4A',
  },
  btnTerminarText: { color: '#E24B4A', fontSize: 18, fontWeight: 'bold' },
  diffBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a2a0a',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#5DCAA5',
  },
  diffBadgeDificil: {
    backgroundColor: '#2a0a0a',
    borderColor: '#E24B4A',
  },
  diffText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
