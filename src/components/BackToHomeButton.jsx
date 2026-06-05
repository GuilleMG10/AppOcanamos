import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';

export default function BackToHomeButton({ navigation }) {
  function confirmar() {
    Alert.alert(
      'Volver al inicio',
      '¿Seguro? Se perderá la partida actual.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Volver', style: 'destructive', onPress: () => navigation.navigate('Home') },
      ]
    );
  }
  return (
    <TouchableOpacity onPress={confirmar} style={{ padding: 6 }}>
      <Text style={{ fontSize: 22 }}>🏠</Text>
    </TouchableOpacity>
  );
}
