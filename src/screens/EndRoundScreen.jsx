import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useGame } from '../context/GameContext';
import CardSpecial from '../components/CardSpecial';
import PlayerAvatar from '../components/PlayerAvatar';

export default function EndRoundScreen({ navigation }) {
  const { state, dispatch } = useGame();

  function usarCarta(jugadorIndex, cartaId) {
    Alert.alert(
      'Usar carta',
      '¿Querés usar esta carta? Se eliminará del inventario.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Usar',
          onPress: () => dispatch({ type: 'USAR_CARTA_ESPECIAL', jugadorIndex, cartaId }),
        },
      ]
    );
  }

  function siguienteRonda() {
    dispatch({ type: 'SIGUIENTE_TURNO' });
    navigation.navigate('Reveal');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ronda {state.rondaActual} completada 🎉</Text>
      <Text style={styles.subtitle}>Inventario de cartas</Text>

      <FlatList
        data={state.jugadores}
        keyExtractor={(_, i) => String(i)}
        style={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.playerBlock}>
            <View style={styles.playerHeader}>
              <PlayerAvatar nombre={item.nombre} size={36} espejo={item.espejo} />
              <Text style={styles.playerName}>{item.nombre}</Text>
              {item.espejo && <Text style={styles.espejoTag}>Espejo 👁</Text>}
            </View>
            {item.cartas.length === 0 ? (
              <Text style={styles.noCartas}>Sin cartas</Text>
            ) : (
              item.cartas.map(carta => (
                <View key={carta.id} style={styles.cartaRow}>
                  <CardSpecial carta={carta} small />
                  <TouchableOpacity
                    style={styles.btnUsar}
                    onPress={() => usarCarta(index, carta.id)}
                  >
                    <Text style={styles.btnUsarText}>Usar</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnSiguiente} onPress={siguienteRonda}>
          <Text style={styles.btnSiguienteText}>Siguiente ronda →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTerminar}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.btnTerminarText}>Terminar juego</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#EF9F27',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  playerBlock: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    paddingBottom: 12,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  espejoTag: {
    color: '#EF9F27',
    fontSize: 12,
  },
  noCartas: {
    color: '#444',
    fontSize: 14,
    marginLeft: 8,
  },
  cartaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnUsar: {
    backgroundColor: '#AFA9EC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnUsarText: {
    color: '#0a0a14',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  btnSiguiente: {
    backgroundColor: '#EF9F27',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnSiguienteText: {
    color: '#0a0a14',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnTerminar: {
    borderWidth: 1,
    borderColor: '#E24B4A',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnTerminarText: {
    color: '#E24B4A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
