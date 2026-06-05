import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cartas } from '../data/cartas';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const TOTAL_RONDAS = 3;
const SORBOS_POR_FALLA = 2;
const _usadasSesion = new Set();

const REGLAS = [
  'Se juegan 3 cartas en total',
  '✅ Lo hice → pasás a la siguiente sin castigo',
  `❌ No lo hice → se acumulan ${SORBOS_POR_FALLA} sorbos de castigo`,
  'Al final se muestra el total acumulado para tomar',
];

function cartaAleatoria(usadas) {
  const disponibles = cartas.filter((_, i) => !usadas.includes(i) && !_usadasSesion.has(i));
  const pool = disponibles.length > 0 ? disponibles : cartas.filter((_, i) => !usadas.includes(i));
  if (pool.length === 0) return { item: cartas[0], index: 0 };
  const idx = Math.floor(Math.random() * pool.length);
  const item = pool[idx];
  const index = cartas.indexOf(item);
  _usadasSesion.add(index);
  return { item, index };
}

export default function Cartas({ navigation }) {
  const [usadas, setUsadas] = useState([]);
  const [{ item: carta, index }, setActual] = useState(() => {
    const i = Math.floor(Math.random() * cartas.length);
    _usadasSesion.add(i);
    return { item: cartas[i], index: i };
  });
  const [ronda, setRonda] = useState(1);
  const [sorbosAcumulados, setSorbosAcumulados] = useState(0);
  const [fase, setFase] = useState('jugando'); // jugando | resultado
  const [reglasVisible, setReglasVisible] = useState(false);

  function avanzar(lohizo) {
    const nuevosSorbos = sorbosAcumulados + (lohizo ? 0 : SORBOS_POR_FALLA);
    const nuevasUsadas = [...usadas, index];
    const siguienteRonda = ronda + 1;

    if (siguienteRonda > TOTAL_RONDAS) {
      setSorbosAcumulados(nuevosSorbos);
      setFase('resultado');
      return;
    }

    setSorbosAcumulados(nuevosSorbos);
    setUsadas(nuevasUsadas);
    setActual(cartaAleatoria(nuevasUsadas));
    setRonda(siguienteRonda);
  }

  if (fase === 'resultado') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🃏 Cartas</Text>
        {sorbosAcumulados === 0 ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultEmoji}>🎉</Text>
            <Text style={styles.resultTexto}>¡Lo hiciste todo!</Text>
            <Text style={styles.resultSub}>Nadie toma</Text>
          </View>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultEmoji}>🍺</Text>
            <Text style={styles.resultTexto}>Acumulaste</Text>
            <Text style={styles.resultSorbos}>{sorbosAcumulados} sorbos</Text>
            <Text style={styles.resultSub}>
              {sorbosAcumulados / SORBOS_POR_FALLA} carta{sorbosAcumulados / SORBOS_POR_FALLA > 1 ? 's' : ''} no hecha{sorbosAcumulados / SORBOS_POR_FALLA > 1 ? 's' : ''}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.btnTerminar} onPress={() => navigation.navigate('EndRound')}>
          <Text style={styles.btnTerminarText}>Terminar ronda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🃏 Cartas — Reglas" color="#7F77DD" reglas={REGLAS} />

      <View style={styles.header}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🃏 Cartas</Text>
        <Text style={styles.rondaText}>{ronda}/{TOTAL_RONDAS}</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      {sorbosAcumulados > 0 && (
        <View style={styles.contadorBox}>
          <Text style={styles.contadorText}>🍺 Acumulados: {sorbosAcumulados} sorbos</Text>
        </View>
      )}

      <View style={styles.stack}>
        <View style={[styles.card, styles.card3]} />
        <View style={[styles.card, styles.card2]} />
        <View style={[styles.card, styles.card1]}>
          <Text style={styles.tipo}>{carta.tipo === 'reto' ? '🔥 RETO' : '❓ PREGUNTA'}</Text>
          <Text style={styles.texto}>{carta.texto}</Text>
        </View>
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity style={styles.btnHice} onPress={() => avanzar(true)}>
          <Text style={styles.btnHiceText}>✅ Lo hice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnNoHice} onPress={() => avanzar(false)}>
          <Text style={styles.btnNoHiceText}>❌ No lo hice</Text>
          <Text style={styles.btnNoHiceSub}>+{SORBOS_POR_FALLA} sorbos</Text>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    gap: 8,
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
  },
  title: {
    color: '#7F77DD',
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
  },
  rondaText: {
    color: '#7F77DD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnInfo: { padding: 4 },
  btnInfoText: { fontSize: 22 },
  contadorBox: {
    backgroundColor: '#1e1a3e',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#7F77DD',
  },
  contadorText: {
    color: '#7F77DD',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stack: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  card: {
    position: 'absolute',
    width: '88%',
    borderRadius: 20,
    backgroundColor: '#1e1a3e',
    borderWidth: 1,
    borderColor: '#7F77DD',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  card3: { transform: [{ rotate: '-4deg' }, { translateY: 8 }], opacity: 0.4 },
  card2: { transform: [{ rotate: '2deg' }, { translateY: 4 }], opacity: 0.7 },
  card1: {},
  tipo: { color: '#7F77DD', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  texto: { color: '#fff', fontSize: 20, textAlign: 'center', lineHeight: 28 },
  acciones: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnHice: {
    flex: 1,
    backgroundColor: '#5DCAA5',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnHiceText: { color: '#0a0a14', fontWeight: 'bold', fontSize: 16 },
  btnNoHice: {
    flex: 1,
    backgroundColor: '#2a1a1a',
    borderWidth: 1,
    borderColor: '#E24B4A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnNoHiceText: { color: '#E24B4A', fontWeight: 'bold', fontSize: 16 },
  btnNoHiceSub: { color: '#E24B4A', fontSize: 12, opacity: 0.8, marginTop: 2 },
  resultBox: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  resultEmoji: { fontSize: 80 },
  resultTexto: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  resultSorbos: { color: '#7F77DD', fontSize: 48, fontWeight: 'bold' },
  resultSub: { color: '#888', fontSize: 16 },
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
    borderColor: '#7F77DD',
  },
  btnTerminarText: { color: '#7F77DD', fontSize: 18, fontWeight: 'bold' },
});
