import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { nuncaNunca } from '../data/nuncaNunca';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const TOTAL_RONDAS = 3;
const _usadasSesion = new Set();

const REGLAS = [
  'Se juegan 3 frases en total',
  'Se lee cada frase "Yo nunca nunca..."',
  'Todos los que SÍ lo hicieron levantan la mano y toman un sorbo',
  'Después de las 3 frases termina la ronda',
];

function fraseAleatoria(usadas) {
  const disponibles = nuncaNunca.filter((_, i) => !usadas.includes(i) && !_usadasSesion.has(i));
  const pool = disponibles.length > 0 ? disponibles : nuncaNunca.filter((_, i) => !usadas.includes(i));
  if (pool.length === 0) return { item: nuncaNunca[0], index: 0 };
  const idx2 = Math.floor(Math.random() * pool.length);
  const item2 = pool[idx2];
  const index2 = nuncaNunca.indexOf(item2);
  _usadasSesion.add(index2);
  return { item: item2, index: index2 };
}

export default function YoNuncaNunca({ navigation }) {
  const [usadas, setUsadas] = useState([]);
  const [{ item, index }, setActual] = useState(() => {
    const i = Math.floor(Math.random() * nuncaNunca.length);
    return { item: nuncaNunca[i], index: i };
  });
  const [ronda, setRonda] = useState(1);
  const [reglasVisible, setReglasVisible] = useState(false);

  function siguiente() {
    const nuevasUsadas = [...usadas, index];
    const siguienteRonda = ronda + 1;
    if (siguienteRonda > TOTAL_RONDAS) {
      navigation.navigate('EndRound');
      return;
    }
    const next = fraseAleatoria(nuevasUsadas);
    setUsadas(nuevasUsadas);
    setActual(next);
    setRonda(siguienteRonda);
  }

  const esUltima = ronda === TOTAL_RONDAS;

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🙅 Yo Nunca Nunca — Reglas" color="#378ADD" reglas={REGLAS} />

      <View style={styles.header}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🙅 Yo Nunca Nunca</Text>
        <Text style={styles.rondaText}>{ronda}/{TOTAL_RONDAS}</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      <View style={styles.card}>
        <Text style={styles.prefix}>Yo nunca nunca...</Text>
        <Text style={styles.frase}>{item.frase}</Text>
      </View>

      <Text style={styles.regla}>Los que sí lo hicieron, toman 🍺</Text>

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
    color: '#378ADD',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  rondaText: {
    color: '#378ADD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnInfo: { padding: 4 },
  btnInfoText: { fontSize: 22 },
  card: {
    backgroundColor: '#0a1a2e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#378ADD',
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  prefix: { color: '#378ADD', fontSize: 18, marginBottom: 12, fontStyle: 'italic' },
  frase: { color: '#fff', fontSize: 26, textAlign: 'center', fontWeight: 'bold', lineHeight: 34 },
  regla: { color: '#888', fontSize: 18, textAlign: 'center', marginBottom: 40 },
  actions: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  btnSiguiente: {
    backgroundColor: '#378ADD',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnFinal: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#378ADD',
  },
  btnSiguienteText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
