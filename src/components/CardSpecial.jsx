import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const iconMap = {
  shield: '🛡️',
  'user-x': '🚫',
  coin: '🪙',
  'shield-half': '🔰',
  'hand-grab': '🤏',
  refresh: '🔄',
  multiplier: '✖️',
};

export default function CardSpecial({ carta, small = false }) {
  const [expandida, setExpandida] = useState(false);
  if (!carta) return null;

  if (small) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.cardSmall, expandida && styles.cardExpandida]}
        onPress={() => setExpandida(prev => !prev)}
        activeOpacity={0.8}
      >
        <View style={styles.rowSmall}>
          <Text style={styles.iconSmall}>{iconMap[carta.icono] || '🃏'}</Text>
          <Text style={styles.nombreSmall}>{carta.nombre}</Text>
          <Text style={styles.hint}>{expandida ? '▲' : '▼'}</Text>
        </View>
        {expandida && (
          <Text style={styles.descripcionSmall}>{carta.descripcion}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{iconMap[carta.icono] || '🃏'}</Text>
      <Text style={styles.nombre}>{carta.nombre}</Text>
      <Text style={styles.descripcion}>{carta.descripcion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1b3a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AFA9EC',
    marginVertical: 8,
  },
  cardSmall: {
    padding: 10,
    marginVertical: 4,
    flex: 1,
  },
  cardExpandida: {
    borderColor: '#CCC8FF',
    backgroundColor: '#252244',
  },
  rowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  iconSmall: {
    fontSize: 20,
  },
  nombre: {
    color: '#AFA9EC',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nombreSmall: {
    color: '#AFA9EC',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  hint: {
    color: '#666',
    fontSize: 11,
  },
  descripcion: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  descripcionSmall: {
    color: '#bbb',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
});
