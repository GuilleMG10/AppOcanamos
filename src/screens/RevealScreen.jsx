import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useGame } from '../context/GameContext';
import { Sounds } from '../utils/sounds';

const MINIJUEGOS = [
  { key: 'Todis', label: 'Todis', color: '#EF9F27', emoji: '🎲' },
  { key: 'Cartas', label: 'Cartas', color: '#7F77DD', emoji: '🃏' },
  { key: 'CulturaChupistica', label: 'Cultura Chupística', color: '#5DCAA5', emoji: '🧠' },
  { key: 'Trivia', label: 'Trivia', color: '#E24B4A', emoji: '❓' },
  { key: 'RuletaMuerte', label: 'Ruleta de la Muerte', color: '#F09595', emoji: '💀' },
  { key: 'YoNuncaNunca', label: 'Yo Nunca Nunca', color: '#378ADD', emoji: '🙅' },
  { key: 'QuienMasProbable', label: '¿Quién más probable?', color: '#D4537E', emoji: '👆' },
  { key: 'VerdadOTrago', label: 'Verdad o Trago', color: '#97C459', emoji: '🍺' },
  { key: 'RuletaRusa', label: 'Ruleta Rusa', color: '#E24B4A', emoji: '🔫' },
  { key: 'HoraDelMentiroso', label: 'Hora del Mentiroso', color: '#EF9F27', emoji: '🤥' },
  { key: 'Subasta', label: 'Subasta', color: '#AFA9EC', emoji: '🔨' },
  { key: 'BotonCaos', label: 'El Botón del Caos', color: '#FF3B3B', emoji: '🔴' },
];

function elegirMinijuego(anterior) {
  const disponibles = MINIJUEGOS.filter(m => m.key !== anterior);
  const rand = Math.random();
  const subastaDisp = disponibles.find(m => m.key === 'Subasta');
  const otrosDisp = disponibles.filter(m => m.key !== 'Subasta');
  if (subastaDisp && rand < 0.1) return subastaDisp;
  return otrosDisp[Math.floor(Math.random() * otrosDisp.length)];
}

export default function RevealScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const [elegido, setElegido] = useState(null);
  const [slotDisplay, setSlotDisplay] = useState(MINIJUEGOS[0]);
  const [fase, setFase] = useState('spinning');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeGrid = useRef(new Animated.Value(0)).current;

  const jugadorActivo = state.jugadores[state.turnoActual];

  useEffect(() => {
    if (state.jugadores.length === 0) {
      navigation.replace('Home');
      return;
    }
    const mini = elegirMinijuego(state.minijuegoAnterior);
    setElegido(mini);
    dispatch({ type: 'SET_MINIJUEGO', minijuego: mini.key });

    let cycles = 0;
    const totalCycles = 22;

    function tick() {
      cycles++;
      if (cycles < totalCycles) {
        setSlotDisplay(MINIJUEGOS[Math.floor(Math.random() * MINIJUEGOS.length)]);
        const delay = 70 + Math.pow(cycles / totalCycles, 2.5) * 500;
        setTimeout(tick, delay);
      } else {
        setSlotDisplay(mini);
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.15, duration: 200, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();
        setTimeout(() => {
          setFase('done');
          Sounds.reveal();
          Animated.timing(fadeGrid, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        }, 700);
      }
    }
    setTimeout(tick, 70);
  }, []);

  function jugar() {
    if (!elegido) return;
    navigation.navigate(elegido.key);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.ronda}>Ronda {state.rondaActual}</Text>
      {jugadorActivo && (
        <Text style={styles.turno}>
          Turno de <Text style={styles.turnoNombre}>{jugadorActivo.nombre}</Text>
        </Text>
      )}

      {fase === 'spinning' && (
        <>
          <Text style={styles.pregunta}>Le toca...</Text>
          <Animated.View style={[styles.slotCard, { borderColor: slotDisplay.color, transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.slotEmoji}>{slotDisplay.emoji}</Text>
            <Text style={[styles.slotLabel, { color: slotDisplay.color }]}>{slotDisplay.label}</Text>
          </Animated.View>
        </>
      )}

      {fase === 'done' && (
        <Animated.View style={[styles.gridWrap, { opacity: fadeGrid }]}>
          <View style={styles.grid}>
            {MINIJUEGOS.map((mini) => {
              const esElegido = elegido?.key === mini.key;
              return (
                <View
                  key={mini.key}
                  style={[
                    styles.card,
                    { borderColor: mini.color },
                    esElegido && { backgroundColor: mini.color + '33' },
                  ]}
                >
                  <Text style={styles.cardEmoji}>{mini.emoji}</Text>
                  <Text style={[styles.cardLabel, { color: esElegido ? mini.color : '#555' }]} numberOfLines={2}>
                    {mini.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={[styles.btnJugar, { backgroundColor: elegido?.color }]} onPress={jugar}>
            <Text style={styles.btnJugarText}>Jugar {elegido?.label} {elegido?.emoji}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  ronda: {
    color: '#EF9F27',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  turno: {
    color: '#888',
    fontSize: 16,
    marginBottom: 12,
  },
  turnoNombre: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pregunta: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  slotCard: {
    width: 220,
    height: 120,
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: '#111120',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 6,
  },
  slotEmoji: {
    fontSize: 40,
  },
  slotLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  gridWrap: {
    flex: 1,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  card: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor: '#111120',
  },
  cardEmoji: {
    fontSize: 20,
    marginBottom: 3,
  },
  cardLabel: {
    fontSize: 9,
    textAlign: 'center',
  },
  btnJugar: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnJugarText: {
    color: '#0a0a14',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
