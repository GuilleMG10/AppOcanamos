import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function Timer({ seconds, onEnd, running = true }) {
  const [remaining, setRemaining] = useState(seconds);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      onEnd && onEnd();
      return;
    }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, running]);

  useEffect(() => {
    if (remaining <= 10 && remaining > 0) {
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [remaining]);

  const color = remaining <= 10 ? '#E24B4A' : '#EF9F27';

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.timer, { color, transform: [{ scale: pulse }] }]}>
        {remaining}
      </Animated.Text>
      <Text style={styles.label}>segundos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  label: {
    color: '#888',
    fontSize: 16,
  },
});
