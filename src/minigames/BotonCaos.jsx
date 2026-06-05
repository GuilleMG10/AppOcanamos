import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const REGLAS = [
  'El celular va al centro de la mesa',
  'Cualquier jugador puede tocar el botón — no hay turno',
  'El resultado aplica a quien lo tocó',
  'No se puede saltar ni terminar la ronda sin tocarlo primero',
];

const RESULTADOS = [
  { tipo: 'bien', emoji: '🎉', texto: 'Nadie toma esta ronda', sub: 'El caos salva a todos' },
  { tipo: 'bien', emoji: '👑', texto: 'Repartís 4 sorbos como quieras', sub: 'El poder es tuyo' },
  { tipo: 'bien', emoji: '🙌', texto: 'Todos toman menos vos', sub: 'Inmunidad total por esta ronda' },
  { tipo: 'bien', emoji: '🎁', texto: 'Elegís a alguien para que tome 1 sorbo', sub: 'Decisión tuya' },
  { tipo: 'bien', emoji: '🤝', texto: 'El jugador a tu derecha te debe un favor de ronda', sub: 'Toma por vos la próxima vez que te toque' },
  { tipo: 'castigo', emoji: '💀', texto: 'Tomás 3 sorbos', sub: 'El caos cobró su precio' },
  { tipo: 'castigo', emoji: '😬', texto: 'Tomás medio vaso', sub: 'No había forma de escapar' },
  { tipo: 'castigo', emoji: '🍻', texto: 'Todos toman, incluyéndote', sub: 'El caos no discrimina' },
  { tipo: 'castigo', emoji: '🎯', texto: 'El jugador a tu izquierda elige qué cantidad tomás', sub: 'El poder pasa a otro' },
  { tipo: 'castigo', emoji: '🔥', texto: 'Decís algo que nunca te animaste a decir o tomás un vaso', sub: 'La verdad o el trago' },
  { tipo: 'castigo', emoji: '😈', texto: 'Tomás por cada ronda que lleva el juego (máx. 4 sorbos)', sub: 'El tiempo te pasa factura' },
  { tipo: 'castigo', emoji: '🤡', texto: 'Hacés un brindis con un discurso de 10 segundos o tomás 2 sorbos', sub: 'El caos quiere entretenimiento' },
  { tipo: 'bien', emoji: '⚡', texto: 'Cambiás el próximo minijuego por el que vos elijas', sub: 'Controla el destino' },
  { tipo: 'castigo', emoji: '🌀', texto: 'Tomás 2 sorbos y elegís a alguien para que tome otros 2', sub: 'El caos se multiplica' },
  { tipo: 'bien', emoji: '🛡️', texto: 'Bloqueás el próximo castigo que te toque', sub: 'Escudo de una sola vez' },
];

function resultadoAleatorio() {
  return RESULTADOS[Math.floor(Math.random() * RESULTADOS.length)];
}

export default function BotonCaos({ navigation }) {
  const [resultado, setResultado] = useState(null);
  const [reglasVisible, setReglasVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.6, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function tocarBoton() {
    if (resultado) return;
    pulseAnim.stopAnimation();
    glowAnim.stopAnimation();
    pulseAnim.setValue(1);
    const res = resultadoAleatorio();
    setResultado(res);
    Animated.spring(revealAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }

  const esBien = resultado?.tipo === 'bien';

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🔴 El Botón del Caos — Reglas" color="#FF3B3B" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🔴 El Botón del Caos</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      {!resultado && (
        <Text style={styles.instruccion}>
          Pongan el celular en el centro{'\n'}de la mesa 📱
        </Text>
      )}

      {!resultado ? (
        <TouchableOpacity onPress={tocarBoton} activeOpacity={0.85} style={styles.btnWrap}>
          <Animated.View style={[styles.glowRing, { opacity: glowAnim, transform: [{ scale: pulseAnim }] }]} />
          <Animated.View style={[styles.boton, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.botonText}>TOCÁ</Text>
          </Animated.View>
        </TouchableOpacity>
      ) : (
        <Animated.View
          style={[
            styles.resultadoCard,
            { borderColor: esBien ? '#5DCAA5' : '#E24B4A' },
            { transform: [{ scale: revealAnim }], opacity: revealAnim },
          ]}
        >
          <Text style={styles.resultadoEmoji}>{resultado.emoji}</Text>
          <Text style={[styles.resultadoTipo, { color: esBien ? '#5DCAA5' : '#E24B4A' }]}>
            {esBien ? '¡ALGO BUENO!' : '¡CASTIGO!'}
          </Text>
          <Text style={styles.resultadoTexto}>{resultado.texto}</Text>
          <Text style={styles.resultadoSub}>{resultado.sub}</Text>
        </Animated.View>
      )}

      {resultado && (
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
    marginBottom: 12,
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
  },
  title: {
    color: '#FF3B3B',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  instruccion: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  btnWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 220,
  },
  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FF3B3B',
  },
  boton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#CC0000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#FF6666',
    shadowColor: '#FF3B3B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },
  botonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  resultadoCard: {
    backgroundColor: '#12121f',
    borderRadius: 24,
    borderWidth: 2,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  resultadoEmoji: {
    fontSize: 64,
  },
  resultadoTipo: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  resultadoTexto: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  resultadoSub: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
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
    borderColor: '#FF3B3B',
  },
  btnTerminarText: {
    color: '#FF3B3B',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
