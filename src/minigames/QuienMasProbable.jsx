import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { quienMasProbable } from '../data/quienMasProbable';

const MAX_SALTOS = 3;

function itemAleatorio() {
  return quienMasProbable[Math.floor(Math.random() * quienMasProbable.length)];
}

export default function QuienMasProbable({ navigation }) {
  const [pregunta, setPregunta] = useState(itemAleatorio());
  const [saltos, setSaltos] = useState(0);
  const [penalizado, setPenalizado] = useState(false);

  function siguiente() {
    const nuevosSaltos = saltos + 1;
    setSaltos(nuevosSaltos);
    if (nuevosSaltos >= MAX_SALTOS) {
      setPenalizado(true);
    } else {
      setPregunta(itemAleatorio());
    }
  }

  if (penalizado) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>👆 ¿Quién es más probable?</Text>
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
        <Text style={styles.title}>👆 ¿Quién es más probable?</Text>
        {saltos > 0 && (
          <Text style={styles.saltosText}>{saltos}/{MAX_SALTOS}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.pregunta}>{pregunta.pregunta}</Text>
      </View>

      <Text style={styles.regla}>
        Todos señalan al mismo tiempo.{'\n'}
        El más señalado toma. 🍺
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnSiguiente} onPress={siguiente}>
          <Text style={styles.btnSiguienteText}>
            Siguiente ({MAX_SALTOS - saltos} restantes)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTerminar}
          onPress={() => navigation.navigate('EndRound')}
        >
          <Text style={styles.btnTerminarText}>Terminar ronda</Text>
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
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    color: '#D4537E',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  saltosText: {
    color: '#888',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1e0a18',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4537E',
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  pregunta: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 34,
  },
  regla: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  actions: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    gap: 12,
  },
  btnSiguiente: {
    backgroundColor: '#D4537E',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnSiguienteText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnTerminar: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4537E',
  },
  btnTerminarText: {
    color: '#D4537E',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#D4537E',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
