import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useGame } from '../context/GameContext';
import PlayerAvatar from '../components/PlayerAvatar';

export default function PlayersScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const [nombre, setNombre] = useState('');

  function agregar() {
    const n = nombre.trim();
    if (!n) return;
    if (state.jugadores.find(j => j.nombre.toLowerCase() === n.toLowerCase())) {
      Alert.alert('Nombre repetido', 'Ya hay un jugador con ese nombre');
      return;
    }
    dispatch({ type: 'AGREGAR_JUGADOR', nombre: n });
    setNombre('');
  }

  function eliminar(index) {
    dispatch({ type: 'ELIMINAR_JUGADOR', index });
  }

  function empezar() {
    if (state.jugadores.length < 2) {
      Alert.alert('Pocos jugadores', 'Necesitás al menos 2 jugadores');
      return;
    }
    navigation.navigate('Reveal');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Jugadores</Text>
      <Text style={styles.subtitle}>¿Quiénes van a jugar?</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del jugador"
          placeholderTextColor="#555"
          value={nombre}
          onChangeText={setNombre}
          onSubmitEditing={agregar}
          returnKeyType="done"
          maxLength={20}
        />
        <TouchableOpacity style={styles.btnAdd} onPress={agregar}>
          <Text style={styles.btnAddText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.jugadores}
        keyExtractor={(_, i) => String(i)}
        style={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.playerRow}>
            <PlayerAvatar nombre={item.nombre} size={40} />
            <Text style={styles.playerName}>{item.nombre}</Text>
            <TouchableOpacity onPress={() => eliminar(index)} style={styles.btnRemove}>
              <Text style={styles.btnRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Agregá al menos 2 jugadores</Text>
        }
      />

      <TouchableOpacity
        style={[styles.btnStart, state.jugadores.length < 2 && styles.btnDisabled]}
        onPress={empezar}
      >
        <Text style={styles.btnStartText}>¡Empezar!</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    color: '#EF9F27',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  btnAdd: {
    backgroundColor: '#EF9F27',
    width: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAddText: {
    color: '#0a0a14',
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    gap: 12,
  },
  playerName: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
  },
  btnRemove: {
    padding: 8,
  },
  btnRemoveText: {
    color: '#E24B4A',
    fontSize: 18,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  btnStart: {
    backgroundColor: '#EF9F27',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  btnDisabled: {
    backgroundColor: '#5a4010',
  },
  btnStartText: {
    color: '#0a0a14',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
