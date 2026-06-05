import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import BackToHomeButton from '../components/BackToHomeButton';
import { Sounds } from '../utils/sounds';

const REGLAS = [
  '6 cámaras, una tiene la bala en posición aleatoria',
  'Cualquiera puede apretar el gatillo — no hay turno fijo',
  'Disparo seguro → pasá el celular al siguiente',
  'Disparo con bala → el que apretó toma un vaso entero',
  'La ronda termina cuando cae la bala',
];

export default function RuletaRusa({ navigation }) {
  const [balaPos] = useState(() => Math.floor(Math.random() * 6));
  const [disparados, setDisparados] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [reglasVisible, setReglasVisible] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const camaraActual = disparados.length;
  const restantes = 6 - camaraActual;
  const porcentaje = restantes > 0 ? Math.round((1 / restantes) * 100) : 0;
  const terminado = resultado === 'bala' || camaraActual >= 6;

  function disparar() {
    if (resultado !== null || terminado) return;
    const esBala = camaraActual === balaPos;
    setDisparados(prev => [...prev, camaraActual]);
    if (esBala) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 14, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -14, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 9, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -9, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      setResultado('bala');
      Sounds.bala();
    } else {
      setResultado('seguro');
    }
  }

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🔫 Ruleta Rusa — Reglas" color="#E24B4A" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🔫 Ruleta Rusa</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <EspejoIndicator />

      <Text style={styles.instruccion}>Pasá el celular de mano en mano 📱</Text>

      <View style={styles.camaras}>
        {Array(6).fill(null).map((_, i) => {
          const yaDisparado = i < camaraActual;
          const esBalaRevelada = yaDisparado && i === balaPos;
          const esSegura = yaDisparado && i !== balaPos;
          const esActual = i === camaraActual && !terminado;
          return (
            <View
              key={i}
              style={[
                styles.camara,
                esSegura && styles.camaraSegura,
                esBalaRevelada && styles.camaraBala,
                esActual && styles.camaraActual,
              ]}
            >
              <Text style={styles.camaraText}>
                {esBalaRevelada ? '💥' : esSegura ? '✅' : esActual ? '🔫' : '❓'}
              </Text>
            </View>
          );
        })}
      </View>

      {!terminado && (
        <View style={styles.probBox}>
          <Text style={styles.probText}>
            Probabilidad: 1/{restantes} ({porcentaje}%)
          </Text>
        </View>
      )}

      {resultado === 'seguro' && !terminado && (
        <Text style={styles.resultadoSeguro}>😅 SALVADO — pasá el celular</Text>
      )}

      {resultado === 'bala' && (
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <Text style={styles.resultadoBala}>💥 ¡BALA! Tomá un vaso entero</Text>
        </Animated.View>
      )}

      {!resultado && !terminado && (
        <TouchableOpacity style={styles.btnDisparar} onPress={disparar}>
          <Text style={styles.btnDispararText}>🔫 Apretar gatillo</Text>
        </TouchableOpacity>
      )}

      {resultado === 'seguro' && !terminado && (
        <TouchableOpacity style={styles.btnSiguiente} onPress={() => setResultado(null)}>
          <Text style={styles.btnSiguienteText}>Listo, ya pasé el celular →</Text>
        </TouchableOpacity>
      )}

      {terminado && (
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
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  title: { color: '#E24B4A', fontSize: 28, fontWeight: 'bold' },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  instruccion: {
    color: '#555',
    fontSize: 15,
    marginBottom: 28,
  },
  camaras: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  camara: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camaraSegura: { borderColor: '#5DCAA5', backgroundColor: '#0a1a14' },
  camaraBala: { borderColor: '#E24B4A', backgroundColor: '#2a0a0a' },
  camaraActual: { borderColor: '#E24B4A', borderWidth: 3 },
  camaraText: { fontSize: 20 },
  probBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  probText: { color: '#E24B4A', fontSize: 18, fontWeight: 'bold' },
  resultadoSeguro: {
    color: '#5DCAA5',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  resultadoBala: {
    color: '#E24B4A',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  btnDisparar: {
    backgroundColor: '#E24B4A',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnDispararText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  btnSiguiente: {
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnSiguienteText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnTerminar: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E24B4A',
    marginTop: 16,
  },
  btnTerminarText: { color: '#E24B4A', fontSize: 18, fontWeight: 'bold' },
});
