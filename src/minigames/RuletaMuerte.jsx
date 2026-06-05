import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useGame } from '../context/GameContext';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import BackToHomeButton from '../components/BackToHomeButton';

const REGLAS = [
  'La ruleta gira y elimina jugadores uno por uno',
  '1° eliminado: 1 sorbo',
  '2° eliminado: 2 sorbos',
  '3° eliminado: 3 sorbos',
  '4° en adelante: medio vaso',
  'El último que queda también pierde — toma un vaso entero',
];

export default function RuletaMuerte({ navigation }) {
  const { state, dispatch } = useGame();
  const { jugadoresActivos, eliminados } = state.ruletaMuerte;
  const [girando, setGirando] = useState(false);
  const [eliminadoActual, setEliminadoActual] = useState(null);
  const [reglasVisible, setReglasVisible] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch({ type: 'INIT_RULETA_MUERTE' });
  }, []);

  const terminado = jugadoresActivos.length <= 1;

  function girar() {
    if (girando || terminado) return;
    setGirando(true);
    setEliminadoActual(null);
    const vueltas = 5 + Math.random() * 5;
    Animated.timing(rotation, { toValue: vueltas, duration: 2000, useNativeDriver: true }).start(() => {
      rotation.setValue(0);
      const idx = Math.floor(Math.random() * jugadoresActivos.length);
      const nombre = jugadoresActivos[idx];
      setEliminadoActual(nombre);
      dispatch({ type: 'ELIMINAR_DE_RULETA_MUERTE', nombre });
      setGirando(false);
    });
  }

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const anguloPorJugador = jugadoresActivos.length > 0 ? 360 / jugadoresActivos.length : 360;

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="💀 Ruleta de la Muerte — Reglas" color="#F09595" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>💀 Ruleta de la Muerte</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <EspejoIndicator />

      <View style={styles.ruletaContainer}>
        <Animated.View style={[styles.ruleta, { transform: [{ rotate: spin }] }]}>
          {jugadoresActivos.map((nombre, i) => {
            const angle = (i * anguloPorJugador) - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 80 * Math.cos(rad);
            const y = 80 * Math.sin(rad);
            return (
              <View key={nombre} style={[styles.playerDot, { transform: [{ translateX: x }, { translateY: y }] }]}>
                <Text style={styles.playerDotText} numberOfLines={1}>{nombre.charAt(0)}</Text>
              </View>
            );
          })}
          <View style={styles.center}><Text style={styles.centerText}>💀</Text></View>
        </Animated.View>
        <View style={styles.pointer}><Text style={styles.pointerText}>▼</Text></View>
      </View>

      {eliminadoActual && (
        <View style={styles.eliminadoBox}>
          <Text style={styles.eliminadoNombre}>💀 {eliminadoActual}</Text>
          {eliminados.length > 0 && (
            <Text style={styles.eliminadoTragos}>Posición #{eliminados.length} → {eliminados[eliminados.length - 1]?.tragos}</Text>
          )}
        </View>
      )}

      {terminado && jugadoresActivos.length === 1 && (
        <View style={styles.perdedorBox}>
          <Text style={styles.perdedorText}>💀 {jugadoresActivos[0]} es el último</Text>
          <Text style={styles.perdedorTragos}>¡Tomá un vaso entero!</Text>
        </View>
      )}

      {eliminados.length > 0 && (
        <View style={styles.eliminadosList}>
          <Text style={styles.eliminadosTitle}>Eliminados:</Text>
          {eliminados.map((e, i) => (
            <Text key={i} style={styles.eliminadoItem}>#{e.posicion} {e.nombre} — {e.tragos}</Text>
          ))}
        </View>
      )}

      {!terminado ? (
        <TouchableOpacity style={[styles.btnGirar, girando && styles.btnDisabled]} onPress={girar} disabled={girando}>
          <Text style={styles.btnGirarText}>{girando ? 'Girando...' : '🎯 Girar'}</Text>
        </TouchableOpacity>
      ) : (
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
    padding: 20,
    paddingTop: 60,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  title: {
    color: '#F09595',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  ruletaContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ruleta: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1a0a0a',
    borderWidth: 3,
    borderColor: '#F09595',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0a0a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: { fontSize: 24 },
  playerDot: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F09595',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerDotText: { color: '#0a0a14', fontWeight: 'bold', fontSize: 14 },
  pointer: { position: 'absolute', top: 0 },
  pointerText: { color: '#F09595', fontSize: 24 },
  eliminadoBox: { alignItems: 'center', marginBottom: 12 },
  eliminadoNombre: { color: '#F09595', fontSize: 22, fontWeight: 'bold' },
  eliminadoTragos: { color: '#fff', fontSize: 18 },
  perdedorBox: {
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1a0a0a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E24B4A',
  },
  perdedorText: { color: '#E24B4A', fontSize: 22, fontWeight: 'bold' },
  perdedorTragos: { color: '#fff', fontSize: 18, marginTop: 4 },
  eliminadosList: { flex: 1, width: '100%', paddingHorizontal: 8 },
  eliminadosTitle: { color: '#888', fontSize: 14, marginBottom: 6 },
  eliminadoItem: { color: '#F09595', fontSize: 15, marginBottom: 4 },
  btnGirar: {
    backgroundColor: '#F09595',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnDisabled: { backgroundColor: '#7a4a4a' },
  btnGirarText: { color: '#0a0a14', fontSize: 20, fontWeight: 'bold' },
  btnTerminar: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F09595',
    marginBottom: 20,
  },
  btnTerminarText: { color: '#F09595', fontSize: 18, fontWeight: 'bold' },
});
