import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Leaflet from "./components/Leaflet/Leaflet";
import Compass from "./components/Compass/Compass";
import Welcome from './components/Welcome/Welcome';

export default function App() {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Wellcome" component={Welcome} options={{headerShown: false}}/>
                <Stack.Screen name="Map" component={Leaflet} options={{headerShown: false}}/>
                <Stack.Screen name="Compass" component={Compass} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>

    );
}
