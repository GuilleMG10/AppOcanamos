import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cartas } from '../data/cartas';

const MAX_SALTOS = 3;

function cartaAleatoria() {
  return cartas[Math.floor(Math.random() * cartas.length)];
}

export default function Cartas({ navigation }) {
  const [carta, setCarta] = useState(cartaAleatoria());
  const [respuestaVisible, setRespuestaVisible] = useState(false);
  const [saltos, setSaltos] = useState(0);
  const [penalizado, setPenalizado] = useState(false);

  function nuevaCarta() {
    setCarta(cartaAleatoria());
    setRespuestaVisible(false);
  }

  function saltar() {
    const nuevosSaltos = saltos + 1;
    setSaltos(nuevosSaltos);
    if (nuevosSaltos >= MAX_SALTOS) {
      setPenalizado(true);
    } else {
      nuevaCarta();
    }
  }

  if (penalizado) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🃏 Cartas</Text>
        <View style={styles.penaltyBox}>
          <Text style={styles.penaltyEmoji}>🍺</Text>
          <Text style={styles.penaltyText}>Saltaste 3 veces</Text>
          <Text style={styles.penaltySubtext}>Tomá 2 sorbos</Text>
        </View>
        <TouchableOpacity
          style={styles.btnTerminar}
          onPress={() => navigation.navigate('EndRound')}
        >
          <Text style={styles.btnTerminarText}>Terminar ronda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🃏 Cartas</Text>
        {saltos > 0 && (
          <Text style={styles.saltosText}>Saltos: {saltos}/{MAX_SALTOS}</Text>
        )}
      </View>

      <View style={styles.stack}>
        <View style={[styles.card, styles.card3]} />
        <View style={[styles.card, styles.card2]} />
        <View style={[styles.card, styles.card1]}>
          <Text style={styles.tipo}>{carta.tipo === 'reto' ? '🔥 RETO' : '❓ PREGUNTA'}</Text>
          <Text style={styles.texto}>{carta.texto}</Text>

          {carta.tipo === 'pregunta' && !respuestaVisible && (
            <TouchableOpacity
              style={styles.btnVerResp}
              onPress={() => setRespuestaVisible(true)}
            >
              <Text style={styles.btnVerRespText}>Ver respuesta</Text>
            </TouchableOpacity>
          )}

          {carta.tipo === 'pregunta' && respuestaVisible && (
            <View style={styles.respuestaBox}>
              <Text style={styles.respuestaLabel}>Respuesta:</Text>
              <Text style={styles.respuesta}>{carta.respuesta}</Text>
            </View>
          )}
        </View>
      </View>

      {carta.tipo === 'reto' && (
        <View style={styles.retoActions}>
          <TouchableOpacity style={styles.btnHice} onPress={nuevaCarta}>
            <Text style={styles.btnHiceText}>✅ Lo hice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSaltar} onPress={saltar}>
            <Text style={styles.btnSaltarText}>
              ⏭ Saltar ({MAX_SALTOS - saltos})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.btnTerminar}
        onPress={() => navigation.navigate('EndRound')}
      >
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  title: {
    color: '#7F77DD',
    fontSize: 28,
    fontWeight: 'bold',
  },
  saltosText: {
    color: '#888',
    fontSize: 14,
  },
  stack: {
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
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
    minHeight: 240,
  },
  card3: { transform: [{ rotate: '-4deg' }, { translateY: 8 }], opacity: 0.4 },
  card2: { transform: [{ rotate: '2deg' }, { translateY: 4 }], opacity: 0.7 },
  card1: { transform: [{ rotate: '0deg' }] },
  tipo: {
    color: '#7F77DD',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  texto: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  btnVerResp: {
    marginTop: 20,
    backgroundColor: '#7F77DD',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  btnVerRespText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  respuestaBox: {
    marginTop: 16,
    alignItems: 'center',
  },
  respuestaLabel: {
    color: '#7F77DD',
    fontSize: 14,
    marginBottom: 4,
  },
  respuesta: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  retoActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  btnHice: {
    flex: 1,
    backgroundColor: '#5DCAA5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnHiceText: {
    color: '#0a0a14',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnSaltar: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnSaltarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  penaltyBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  penaltyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  penaltyText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  penaltySubtext: {
    color: '#7F77DD',
    fontSize: 24,
    fontWeight: 'bold',
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
    borderColor: '#7F77DD',
  },
  btnTerminarText: {
    color: '#7F77DD',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
