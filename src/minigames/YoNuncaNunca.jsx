import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { nuncaNunca } from '../data/nuncaNunca';

const MAX_SALTOS = 3;

function fraseAleatoria() {
  return nuncaNunca[Math.floor(Math.random() * nuncaNunca.length)];
}

export default function YoNuncaNunca({ navigation }) {
  const [item, setItem] = useState(fraseAleatoria());
  const [saltos, setSaltos] = useState(0);
  const [penalizado, setPenalizado] = useState(false);

  function siguiente() {
    const nuevosSaltos = saltos + 1;
    setSaltos(nuevosSaltos);
    if (nuevosSaltos >= MAX_SALTOS) {
      setPenalizado(true);
    } else {
      setItem(fraseAleatoria());
    }
  }

  if (penalizado) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🙅 Yo Nunca Nunca</Text>
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
        <Text style={styles.title}>🙅 Yo Nunca Nunca</Text>
        <Text style={styles.saltosText}>Saltos: {saltos}/{MAX_SALTOS}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.prefix}>Yo nunca nunca...</Text>
        <Text style={styles.frase}>{item.frase}</Text>
      </View>

      <Text style={styles.regla}>Los que sí lo hicieron, toman 🍺</Text>

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
  },
  title: {
    color: '#378ADD',
    fontSize: 24,
    fontWeight: 'bold',
  },
  saltosText: {
    color: '#888',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#0a1a2e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#378ADD',
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  prefix: {
    color: '#378ADD',
    fontSize: 18,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  frase: {
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
    backgroundColor: '#378ADD',
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
    borderColor: '#378ADD',
  },
  btnTerminarText: {
    color: '#378ADD',
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
    color: '#378ADD',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
