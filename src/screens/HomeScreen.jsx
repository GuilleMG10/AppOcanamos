import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useGame } from '../context/GameContext';

export default function HomeScreen({ navigation }) {
  const { dispatch } = useGame();

  function handleStart() {
    dispatch({ type: 'NUEVA_PARTIDA' });
    navigation.navigate('Players');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>El juego para cañarse entre reales</Text>

      <TouchableOpacity style={styles.btnPrimary} onPress={handleStart}>
        <Text style={styles.btnText}>Nueva partida</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Para cañarse entre reales 🍺</Text>
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
  logo: {
    width: 280,
    height: 280,
    marginBottom: 16,
  },
  subtitle: {
    color: '#888',
    fontSize: 18,
    marginBottom: 60,
    marginTop: 0,
  },
  btnPrimary: {
    backgroundColor: '#EF9F27',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#0a0a14',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    color: '#444',
    fontSize: 14,
    position: 'absolute',
    bottom: 32,
  },
});
