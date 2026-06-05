import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function ReglasModal({ visible, onClose, titulo, color = '#EF9F27', reglas = [] }) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={[styles.titulo, { color }]}>{titulo}</Text>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {reglas.map((regla, i) => (
              <Text key={i} style={styles.regla}>• {regla}</Text>
            ))}
          </ScrollView>
          <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onClose}>
            <Text style={styles.btnText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#12121f',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scroll: {
    maxHeight: 300,
    marginBottom: 20,
  },
  regla: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 4,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#0a0a14',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
