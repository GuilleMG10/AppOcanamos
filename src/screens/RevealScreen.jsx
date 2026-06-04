import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

const MINIJUEGOS = [
  { key: 'Todis', label: 'Todis', color: '#EF9F27', emoji: '🎲' },
  { key: 'Cartas', label: 'Cartas', color: '#7F77DD', emoji: '🃏' },
  { key: 'CulturaChupistica', label: 'Cultura Chupística', color: '#5DCAA5', emoji: '🧠' },
  { key: 'Trivia', label: 'Trivia', color: '#E24B4A', emoji: '❓' },
  { key: 'RuletaMuerte', label: 'Ruleta de la Muerte', color: '#F09595', emoji: '💀' },
  { key: 'YoNuncaNunca', label: 'Yo Nunca Nunca', color: '#378ADD', emoji: '🙅' },
  { key: 'QuienMasProbable', label: '¿Quién es más probable?', color: '#D4537E', emoji: '👆' },
  { key: 'VerdadOTrago', label: 'Verdad o Trago', color: '#97C459', emoji: '🍺' },
  { key: 'RuletaRusa', label: 'Ruleta Rusa', color: '#E24B4A', emoji: '🔫' },
  { key: 'HoraDelMentiroso', label: 'Hora del Mentiroso', color: '#EF9F27', emoji: '🤥' },
  { key: 'Subasta', label: 'Subasta', color: '#AFA9EC', emoji: '🔨' },
];

function elegirMinijuego() {
  const rand = Math.random();
  if (rand < 0.1) return MINIJUEGOS.find(m => m.key === 'Subasta');
  const otros = MINIJUEGOS.filter(m => m.key !== 'Subasta');
  const idx = Math.floor(Math.random() * otros.length);
  return otros[idx];
}

export default function RevealScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const [elegido, setElegido] = useState(null);
  const [animDone, setAnimDone] = useState(false);
  const fadeAnims = useRef(MINIJUEGOS.map(() => new Animated.Value(0))).current;
  const scaleElegido = useRef(new Animated.Value(1)).current;

  const jugadorActivo = state.jugadores[state.turnoActual];

  useEffect(() => {
    const mini = elegirMinijuego();
    setElegido(mini);
    dispatch({ type: 'SET_MINIJUEGO', minijuego: mini.key });

    const anims = fadeAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        delay: i * 120,
        useNativeDriver: true,
      })
    );

    Animated.sequence([
      Animated.stagger(120, anims),
      Animated.timing(scaleElegido, {
        toValue: 1.15,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setAnimDone(true));
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

      <Text style={styles.pregunta}>Le toca...</Text>

      <View style={styles.grid}>
        {MINIJUEGOS.map((mini, i) => {
          const esElegido = elegido?.key === mini.key;
          return (
            <Animated.View
              key={mini.key}
              style={[
                styles.card,
                { borderColor: mini.color, opacity: fadeAnims[i] },
                esElegido && animDone && {
                  backgroundColor: mini.color + '33',
                  transform: [{ scale: scaleElegido }],
                },
              ]}
            >
              <Text style={styles.cardEmoji}>{mini.emoji}</Text>
              <Text style={[styles.cardLabel, { color: esElegido && animDone ? mini.color : '#888' }]} numberOfLines={2}>
                {mini.label}
              </Text>
            </Animated.View>
          );
        })}
      </View>

      {animDone && elegido && (
        <TouchableOpacity style={[styles.btnJugar, { backgroundColor: elegido.color }]} onPress={jugar}>
          <Text style={styles.btnJugarText}>Jugar {elegido.label} {elegido.emoji}</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  turnoNombre: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pregunta: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    flex: 1,
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
    fontSize: 22,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  btnJugar: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  btnJugarText: {
    color: '#0a0a14',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
