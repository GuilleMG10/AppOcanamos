import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useGame } from '../context/GameContext';

export default function GameOverScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const rondas = state.rondaActual;

  function nuevaPartida() {
    dispatch({ type: 'NUEVA_PARTIDA' });
    navigation.replace('Players');
  }

  function inicio() {
    navigation.replace('Home');
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.titulo}>¡Eso fue todo!</Text>
      <Text style={styles.rondas}>
        Se jugaron <Text style={styles.rondasNum}>{rondas}</Text> rondas
      </Text>

      <View style={styles.divider} />

      <Text style={styles.jugadoresLabel}>Jugadores de esta noche</Text>
      <FlatList
        data={state.jugadores}
        keyExtractor={(_, i) => String(i)}
        style={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.jugadorRow}>
            <Text style={styles.jugadorNombre}>{item.nombre}</Text>
            {item.espejo && <Text style={styles.espejoTag}>👁 Espejo</Text>}
          </View>
        )}
      />

      <View style={styles.acciones}>
        <TouchableOpacity style={styles.btnNueva} onPress={nuevaPartida}>
          <Text style={styles.btnNuevaText}>🔄 Nueva partida</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnInicio} onPress={inicio}>
          <Text style={styles.btnInicioText}>Volver al inicio</Text>
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
    padding: 24,
    paddingTop: 60,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  titulo: {
    color: '#EF9F27',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  rondas: {
    color: '#888',
    fontSize: 20,
    marginBottom: 24,
  },
  rondasNum: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#1a1a2e',
    marginBottom: 20,
  },
  jugadoresLabel: {
    color: '#555',
    fontSize: 14,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  lista: {
    width: '100%',
    flex: 1,
  },
  jugadorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  jugadorNombre: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  },
  espejoTag: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
  acciones: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  btnNueva: {
    backgroundColor: '#EF9F27',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnNuevaText: {
    color: '#0a0a14',
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnInicio: {
    borderWidth: 1,
    borderColor: '#555',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnInicioText: {
    color: '#888',
    fontSize: 16,
  },
});
