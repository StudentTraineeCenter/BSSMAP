import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Leaflet from "./components/Leaflet/Leaflet";
import Navbar from "./components/Navbar/Navbar";
import Compass from "./components/Compass/Compass";

export default function App() {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Gyroscope" component={Compass} options={{headerShown: false}}/>
                <Stack.Screen name="Map" component={Leaflet} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>

    );
}
