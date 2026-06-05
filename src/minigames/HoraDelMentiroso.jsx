import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EspejoIndicator from '../components/EspejoIndicator';
import ReglasModal from '../components/ReglasModal';
import TurnoIndicator from '../components/TurnoIndicator';
import BackToHomeButton from '../components/BackToHomeButton';

const CANTIDADES = ['1 sorbo', '2 sorbos', '3 sorbos', '4 sorbos', 'medio vaso', '1 vaso', '2 vasos'];

const REGLAS = [
  'Solo el jugador activo ve la tarjeta con una cantidad de bebida',
  'Puede declarar esa cantidad en voz alta (verdad) o inventar otra (mentira)',
  'El grupo vota: ¿Verdad o Mentiroso?',
  'Dijo verdad y le creen → nadie toma',
  'Dijo verdad y no le creen → todos toman lo de la tarjeta',
  'Mintió y lo descubren → el jugador toma el doble de la tarjeta',
  'Mintió y le creen → todos toman lo que él declaró',
];

function cantidadAleatoria() {
  return CANTIDADES[Math.floor(Math.random() * CANTIDADES.length)];
}

function duplicar(cant) {
  const map = {
    '1 sorbo': '2 sorbos',
    '2 sorbos': '4 sorbos',
    '3 sorbos': '6 sorbos',
    '4 sorbos': '8 sorbos (un vaso casi)',
    'medio vaso': '1 vaso',
    '1 vaso': '2 vasos',
    '2 vasos': '4 vasos',
  };
  return map[cant] || `el doble (${cant})`;
}

export default function HoraDelMentiroso({ navigation }) {
  const [cantidad] = useState(cantidadAleatoria);
  const [revelado, setRevelado] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [reglasVisible, setReglasVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ReglasModal visible={reglasVisible} onClose={() => setReglasVisible(false)} titulo="🤥 Hora del Mentiroso — Reglas" color="#EF9F27" reglas={REGLAS} />

      <View style={styles.titleRow}>
        <BackToHomeButton navigation={navigation} />
        <Text style={styles.title}>🤥 Hora del Mentiroso</Text>
        <TouchableOpacity onPress={() => setReglasVisible(true)} style={styles.btnInfo}>
          <Text style={styles.btnInfoText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TurnoIndicator />
      <EspejoIndicator />

      <View style={styles.card}>
        {!revelado ? (
          <>
            <Text style={styles.soloVos}>Solo el jugador activo ve la tarjeta</Text>
            <Text style={styles.cantidad}>{cantidad}</Text>
            <Text style={styles.instruccion}>
              Declaralo en voz alta{'\n'}(verdad o mentira, vos sabés)
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.reveal}>La tarjeta decía:</Text>
            <Text style={styles.cantidad}>{cantidad}</Text>
          </>
        )}
      </View>

      {!revelado && (
        <View style={styles.votos}>
          <Text style={styles.votosTitle}>El grupo vota:</Text>
          <TouchableOpacity style={styles.btnVerdad} onPress={() => { setRevelado(true); setResultado('verdad'); }}>
            <Text style={styles.btnVerdadText}>✅ Verdad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMentiroso} onPress={() => { setRevelado(true); setResultado('mentira'); }}>
            <Text style={styles.btnMentirosoText}>🤥 Mentiroso</Text>
          </TouchableOpacity>
        </View>
      )}

      {revelado && resultado && (
        <View style={styles.resultadoBox}>
          <Text style={styles.resultadoTitle}>Resultado:</Text>
          <View style={styles.resultado}>
            <TouchableOpacity style={[styles.opcion]} onPress={() => setResultado('verdad')}>
              <Text style={styles.opcionText}>Dijo verdad y le creyeron → nadie toma</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.opcion, styles.opcionWarn]} onPress={() => setResultado('verdad-nocreyeron')}>
              <Text style={styles.opcionText}>Dijo verdad pero no le creyeron → todos toman {cantidad}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.opcion, styles.opcionDanger]} onPress={() => setResultado('mintio-descubierto')}>
              <Text style={styles.opcionText}>Mintió y lo descubrieron → toma el doble: {duplicar(cantidad)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.opcion, styles.opcionWarn]} onPress={() => setResultado('mintio-creyeron')}>
              <Text style={styles.opcionText}>Mintió y le creyeron → todos toman lo declarado</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 24,
    paddingTop: 60,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: '#EF9F27',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  btnInfo: { padding: 6 },
  btnInfoText: { fontSize: 24 },
  card: {
    backgroundColor: '#1e1500',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EF9F27',
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  soloVos: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  cantidad: {
    color: '#EF9F27',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  instruccion: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  reveal: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  votos: {
    gap: 12,
    marginBottom: 16,
  },
  votosTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'center',
  },
  btnVerdad: {
    backgroundColor: '#5DCAA5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnVerdadText: {
    color: '#0a0a14',
    fontWeight: 'bold',
    fontSize: 18,
  },
  btnMentiroso: {
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnMentirosoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resultadoBox: {
    flex: 1,
  },
  resultadoTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  resultado: {
    gap: 8,
  },
  opcion: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  opcionWarn: {
    borderColor: '#EF9F27',
    backgroundColor: '#1a1000',
  },
  opcionDanger: {
    borderColor: '#E24B4A',
    backgroundColor: '#1a0a0a',
  },
  opcionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  btnTerminar: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF9F27',
    marginTop: 12,
  },
  btnTerminarText: {
    color: '#EF9F27',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
