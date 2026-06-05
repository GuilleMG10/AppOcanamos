import { Vibration } from 'react-native';

// Patrones de vibración como feedback táctil para cada evento
export const Sounds = {
  dado:     () => Vibration.vibrate([0, 25, 20, 25, 20, 90]),
  reveal:   () => Vibration.vibrate([0, 80, 40, 180]),
  bala:     () => Vibration.vibrate([0, 130, 60, 130, 60, 450]),
  timerFin: () => Vibration.vibrate([0, 100, 50, 100, 50, 100]),
  exito:    () => Vibration.vibrate([0, 50, 30, 120]),
  castigo:  () => Vibration.vibrate([0, 200]),
};
