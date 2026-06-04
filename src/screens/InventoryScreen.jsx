import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useGame } from '../context/GameContext';
import CardSpecial from '../components/CardSpecial';
import PlayerAvatar from '../components/PlayerAvatar';

export default function InventoryScreen({ navigation }) {
  const { state } = useGame();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.closeBtnText}>✕ Cerrar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Inventario</Text>
      <Text style={styles.subtitle}>Cartas especiales activas</Text>

      <FlatList
        data={state.jugadores}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.playerBlock}>
            <View style={styles.playerHeader}>
              <PlayerAvatar nombre={item.nombre} size={36} espejo={item.espejo} />
              <Text style={styles.playerName}>{item.nombre}</Text>
              {item.espejo && <Text style={styles.espejoTag}>👁 Espejo</Text>}
            </View>
            {item.cartas.length === 0 ? (
              <Text style={styles.noCartas}>Sin cartas especiales</Text>
            ) : (
              item.cartas.map(carta => (
                <CardSpecial key={carta.id} carta={carta} />
              ))
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay jugadores</Text>
        }
      />
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
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  closeBtnText: {
    color: '#888',
    fontSize: 16,
  },
  title: {
    color: '#AFA9EC',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
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
  empty: {
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
