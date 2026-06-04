import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlayerAvatar({ nombre, espejo, size = 48, color = '#EF9F27' }) {
  const initial = nombre ? nombre.charAt(0).toUpperCase() : '?';
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4, color }]}>{initial}</Text>
      {espejo && <View style={styles.espejoTag}><Text style={styles.espejoText}>👁</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontWeight: 'bold',
  },
  espejoTag: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0a0a14',
    borderRadius: 8,
  },
  espejoText: {
    fontSize: 12,
  },
});
