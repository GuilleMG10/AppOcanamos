import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { trivia } from '../data/trivia';

const MAX_SALTOS = 3;

function preguntaAleatoria() {
  return trivia[Math.floor(Math.random() * trivia.length)];
}

export default function Trivia({ navigation }) {
  const [item, setItem] = useState(preguntaAleatoria());
  const [visible, setVisible] = useState(false);
  const [saltos, setSaltos] = useState(0);
  const [penalizado, setPenalizado] = useState(false);

  function pasar() {
    const nuevosSaltos = saltos + 1;
    setSaltos(nuevosSaltos);
    if (nuevosSaltos >= MAX_SALTOS) {
      setPenalizado(true);
    } else {
      setItem(preguntaAleatoria());
      setVisible(false);
    }
  }

  function siguiente() {
    setItem(preguntaAleatoria());
    setVisible(false);
  }

  if (penalizado) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>❓ Trivia</Text>
        <View style={styles.penaltyBox}>
          <Text style={styles.penaltyEmoji}>🍺</Text>
          <Text style={styles.penaltyText}>Pasaste 3 veces</Text>
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
        <Text style={styles.title}>❓ Trivia</Text>
        <Text style={styles.saltosText}>Saltos: {saltos}/{MAX_SALTOS}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.pregunta}>{item.pregunta}</Text>
        {!visible ? (
          <View style={styles.botonesCard}>
            <TouchableOpacity style={styles.btnVer} onPress={() => setVisible(true)}>
              <Text style={styles.btnVerText}>Ver respuesta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPasar} onPress={pasar}>
              <Text style={styles.btnPasarText}>Pasar ({MAX_SALTOS - saltos} restantes)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.respuestaBox}>
            <Text style={styles.respuestaLabel}>Respuesta:</Text>
            <Text style={styles.respuesta}>{item.respuesta}</Text>
          </View>
        )}
      </View>

      {visible && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSabia} onPress={siguiente}>
            <Text style={styles.btnSabiaText}>✅ Sabía</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnTomo} onPress={siguiente}>
            <Text style={styles.btnTomoText}>🍺 Tomó</Text>
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
    marginBottom: 32,
  },
  title: {
    color: '#E24B4A',
    fontSize: 28,
    fontWeight: 'bold',
  },
  saltosText: {
    color: '#888',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1e0a0a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E24B4A',
    padding: 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  pregunta: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 20,
  },
  botonesCard: {
    width: '100%',
    gap: 10,
  },
  btnVer: {
    backgroundColor: '#E24B4A',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnVerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnPasar: {
    backgroundColor: '#2a2a3e',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  btnPasarText: {
    color: '#888',
    fontSize: 14,
  },
  respuestaBox: {
    alignItems: 'center',
  },
  respuestaLabel: {
    color: '#E24B4A',
    fontSize: 14,
    marginBottom: 6,
  },
  respuesta: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    width: '100%',
  },
  btnSabia: {
    flex: 1,
    backgroundColor: '#5DCAA5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnSabiaText: {
    color: '#0a0a14',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnTomo: {
    flex: 1,
    backgroundColor: '#E24B4A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnTomoText: {
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
    color: '#E24B4A',
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
    borderColor: '#E24B4A',
  },
  btnTerminarText: {
    color: '#E24B4A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
