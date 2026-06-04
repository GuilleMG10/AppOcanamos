import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import RevealScreen from './src/screens/RevealScreen';
import EndRoundScreen from './src/screens/EndRoundScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import Todis from './src/minigames/Todis';
import Cartas from './src/minigames/Cartas';
import CulturaChupistica from './src/minigames/CulturaChupistica';
import Trivia from './src/minigames/Trivia';
import RuletaMuerte from './src/minigames/RuletaMuerte';
import YoNuncaNunca from './src/minigames/YoNuncaNunca';
import QuienMasProbable from './src/minigames/QuienMasProbable';
import VerdadOTrago from './src/minigames/VerdadOTrago';
import RuletaRusa from './src/minigames/RuletaRusa';
import HoraDelMentiroso from './src/minigames/HoraDelMentiroso';
import Subasta from './src/minigames/Subasta';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Players" component={PlayersScreen} />
          <Stack.Screen name="Reveal" component={RevealScreen} />
          <Stack.Screen name="EndRound" component={EndRoundScreen} />
          <Stack.Screen name="Inventory" component={InventoryScreen} />
          <Stack.Screen name="Todis" component={Todis} />
          <Stack.Screen name="Cartas" component={Cartas} />
          <Stack.Screen name="CulturaChupistica" component={CulturaChupistica} />
          <Stack.Screen name="Trivia" component={Trivia} />
          <Stack.Screen name="RuletaMuerte" component={RuletaMuerte} />
          <Stack.Screen name="YoNuncaNunca" component={YoNuncaNunca} />
          <Stack.Screen name="QuienMasProbable" component={QuienMasProbable} />
          <Stack.Screen name="VerdadOTrago" component={VerdadOTrago} />
          <Stack.Screen name="RuletaRusa" component={RuletaRusa} />
          <Stack.Screen name="HoraDelMentiroso" component={HoraDelMentiroso} />
          <Stack.Screen name="Subasta" component={Subasta} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
