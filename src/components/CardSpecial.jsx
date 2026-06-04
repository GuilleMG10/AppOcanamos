import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  if (!carta) return null;
  return (
    <View style={[styles.card, small && styles.cardSmall]}>
      <Text style={[styles.icon, small && styles.iconSmall]}>{iconMap[carta.icono] || '🃏'}</Text>
      <Text style={[styles.nombre, small && styles.nombreSmall]}>{carta.nombre}</Text>
      {!small && <Text style={styles.descripcion}>{carta.descripcion}</Text>}
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
    padding: 8,
    marginVertical: 4,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  iconSmall: {
    fontSize: 22,
    marginBottom: 4,
  },
  nombre: {
    color: '#AFA9EC',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nombreSmall: {
    fontSize: 13,
  },
  descripcion: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
});
