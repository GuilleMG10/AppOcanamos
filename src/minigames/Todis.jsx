import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import { useGame } from '../context/GameContext';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';
import { Sounds } from '../utils/sounds';

const CASTIGOS = {
  1: { texto: 'TODOS TOMAN 🍺', color: '#EF9F27' },
  2: { texto: 'OBLIGÁS A ALGUIEN', color: '#EF9F27' },
  3: { texto: 'JUGADOR DE LA DERECHA TOMA →', color: '#EF9F27' },
  4: { texto: '← JUGADOR DE LA IZQUIERDA TOMA', color: '#EF9F27' },
  5: { texto: 'TOMÁS SOLO 😬', color: '#EF9F27' },
  6: { texto: 'ELEGÍS A ALGUIEN — ¡ESPEJO!', color: '#FFD700' },
};

// Grilla 3x3: true = punto visible
const FACES = {
  1: [[false,false,false],[false,true,false],[false,false,false]],
  2: [[false,false,true],[false,false,false],[true,false,false]],
  3: [[false,false,true],[false,true,false],[true,false,false]],
  4: [[true,false,true],[false,false,false],[true,false,true]],
  5: [[true,false,true],[false,true,false],[true,false,true]],
  6: [[true,false,true],[true,false,true],[true,false,true]],
};

const REGLAS = [
  'Tocá el dado para tirarlo',
  '1 → Todos toman un sorbo',
  '2 → Obligás a alguien a tomar (decís en voz alta a quién)',
  '3 → El jugador de tu derecha toma',
  '4 → El jugador de tu izquierda toma',
  '5 → Tomás solo',
  '6 → Elegís a alguien para ser tu espejo: esa persona toma cada vez que vos tomés por el resto de la partida',
];

function DiceFace({ number, size = 160, dotColor = '#EF9F27' }) {
  if (!number || !FACES[number]) return null;
  const grid = FACES[number];
  const dotSize = size * 0.18;
  const cellSize = size / 3;

  return (
    <View style={{ width: size, height: size }}>
      {grid.map((row, rowIdx) =>
        row.map((visible, colIdx) => (
          <View
            key={`${rowIdx}-${colIdx}`}
            style={{
              position: 'absolute',
              top: rowIdx * cellSize + (cellSize - dotSize) / 2,
              left: colIdx * cellSize + (cellSize - dotSize) / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: visible ? dotColor : 'transparent',
            }}
          />
        ))
      )}
    </View>
  );
}

export default function Todis({ navigation }) {
  const { state, dispatch } = useGame();
  const [displayFace, setDisplayFace] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [rodando, setRodando] = useState(false);
  const [espejoActivado, setEspejoActivado] = useState(false);
  const [reglasVisible, setReglasVisible] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const resultadoAnim = useRef(new Animated.Value(0)).current;
  const shakeLoop = useRef(null);

  function tirarDado() {
    if (rodando) return;
    setRodando(true);
    setResultado(null);
    setEspejoActivado(false);
    resultadoAnim.setValue(0);

    // Shake loop mientras rueda
    shakeLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 14, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -14, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
      ])
    );
    shakeLoop.current.start();

    const num = Math.floor(Math.random() * 6) + 1;
    let cycles = 0;
    const maxCycles = 18;

    function tick() {
      cycles++;
      if (cycles < maxCycles) {
        setDisplayFace(Math.floor(Math.random() * 6) + 1);
        const delay = 60 + Math.pow(cycles / maxCycles, 2.5) * 320;
        setTimeout(tick, delay);
      } else {
        shakeLoop.current?.stop();
        shakeAnim.setValue(0);
        setDisplayFace(num);
        setResultado(num);
        setRodando(false);
        Sounds.dado();
        Animated.sequence([
          Animated.spring(bounceAnim, { toValue: 1.2, friction: 3, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
        Animated.spring(resultadoAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
      }
    }
    tick();
  }

  function activarEspejo(idx) {
    dispatch({ type: 'ACTIVAR_ESPEJO', jugadorIndex: idx });
    setEspejoActivado(true);
  }

  const dotColor = resultado === 6 ? '#FFD700' : '#EF9F27';

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🎲 Todis — Reglas" color="#EF9F27" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🎲 Todis</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      <TouchableOpacity onPress={tirarDado} activeOpacity={0.85} disabled={rodando}>
        <Animated.View
          style={[
            styles.diceContainer,
            rodando && styles.diceContainerRolling,
            resultado === 6 && styles.diceContainerGold,
            { transform: [{ translateX: shakeAnim }, { scale: bounceAnim }] },
          ]}
        >
          {displayFace ? (
            <DiceFace number={displayFace} size={150} dotColor={dotColor} />
          ) : (
            <Text style={styles.dadoPlaceholder}>🎲</Text>
          )}
        </Animated.View>
      </TouchableOpacity>

      <Text style={[styles.hint, rodando && styles.hintRolling]}>
        {rodando ? '🎲  TIRANDO...' : resultado ? '' : 'Tocá el dado para tirar'}
      </Text>

      {resultado && (
        <Animated.View
          style={[
            styles.resultadoCard,
            { borderColor: resultado === 6 ? '#FFD700' : '#EF9F27' },
            { opacity: resultadoAnim, transform: [{ translateY: resultadoAnim.interpolate({ inputRange: [0,1], outputRange: [40, 0] }) }] },
          ]}
        >
          <Text style={[styles.numero, { color: resultado === 6 ? '#FFD700' : '#EF9F27' }]}>
            {resultado}
          </Text>
          <Text style={styles.castigo}>{CASTIGOS[resultado].texto}</Text>

          {(resultado === 1 || resultado === 5) && state.jugadores.some(j => j.espejo) && (
            <View style={styles.espejoReminder}>
              <Text style={styles.espejoReminderText}>
                👁 También toman (espejo):{' '}
                {state.jugadores.filter(j => j.espejo).map(j => j.nombre).join(', ')}
              </Text>
            </View>
          )}

          {resultado === 6 && !espejoActivado && (
            <View style={styles.espejoSection}>
              <Text style={styles.espejoTitle}>Elegí quién será tu espejo:</Text>
              {state.jugadores.map((j, i) => {
                if (i === state.turnoActual) return null;
                return (
                  <TouchableOpacity key={i} style={styles.btnEspejo} onPress={() => activarEspejo(i)}>
                    <Text style={styles.btnEspejoText}>{j.nombre}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {resultado === 6 && espejoActivado && (
            <Text style={styles.espejoConfirm}>✅ Espejo activado</Text>
          )}
        </Animated.View>
      )}

      <TouchableOpacity style={styles.btnTerminar} onPress={() => navigation.navigate('EndRound')}>
        <Text style={styles.btnTerminarText}>Terminar ronda</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
  },
  title: {
    color: '#EF9F27',
    fontSize: 28,
    fontWeight: 'bold',
  },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  diceContainer: {
    width: 180,
    height: 180,
    backgroundColor: '#1a1200',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#EF9F27',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#EF9F27',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  diceContainerRolling: {
    borderColor: '#FFB347',
    shadowOpacity: 0.8,
    backgroundColor: '#221800',
  },
  diceContainerGold: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.7,
    backgroundColor: '#1a1500',
  },
  dadoPlaceholder: {
    fontSize: 80,
  },
  hint: {
    color: '#555',
    fontSize: 16,
    marginBottom: 20,
    height: 24,
  },
  hintRolling: {
    color: '#EF9F27',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultadoCard: {
    backgroundColor: '#12100a',
    borderRadius: 20,
    borderWidth: 2,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  numero: {
    fontSize: 72,
    fontWeight: 'bold',
    lineHeight: 80,
  },
  castigo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  espejoSection: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  espejoTitle: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 4,
  },
  btnEspejo: {
    backgroundColor: '#1e1a00',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  btnEspejoText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  espejoConfirm: {
    color: '#5DCAA5',
    fontSize: 18,
    marginTop: 8,
  },
  espejoReminder: {
    marginTop: 12,
    backgroundColor: '#1e1500',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FFD700',
    width: '100%',
  },
  espejoReminderText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
    borderColor: '#EF9F27',
  },
  btnTerminarText: {
    color: '#EF9F27',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
