import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Leaflet from "./components/Leaflet/Leaflet";
import Compass from "./components/Compass/Compass";
import { useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Welcome from './components/Welcome/Welcome';
import Providers from './components/Providers/Providers';


const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        regular: require("./assets/fonts/open-sans/OpenSans-Regular.ttf"),
        bold: require("./assets/fonts/open-sans/OpenSans-Bold.ttf"),
    });

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.body}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
                    <Stack.Screen name="Providers" component={Providers} options={{headerShown: false}}/>
                    <Stack.Screen name="Map" component={Leaflet} options={{headerShown: false}}/>
                    <Stack.Screen name="Compass" component={Compass} options={{headerShown: false}}/>
                </Stack.Navigator>

                <View onLayout={onLayoutRootView}></View>
            </NavigationContainer>
            <StatusBar translucent={false} backgroundColor={"#fff"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
});