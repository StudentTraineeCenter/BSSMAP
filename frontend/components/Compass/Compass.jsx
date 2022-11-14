import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {Gyroscope} from 'expo-sensors';
import Navbar from "../Navbar/Navbar";

import { defaultStyles } from "../styles/defaultStyles";

const Compass = () => {
    const [provider, setProvider] = useState(null);
    const [threeAxisData, setThreeAxisData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [angleX, setAngleX] = useState(0);

    const _fast = () => {
        Gyroscope.setUpdateInterval(16);
    };

    const _subscribe = () => {
        setSubscription(
            Gyroscope.addListener(gyroscopeData => {
                setThreeAxisData(gyroscopeData);
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        _fast();
        _subscribe();
        return () => _unsubscribe();
    }, []);

    useEffect(() => {
        setAngleX(angleX + threeAxisData.y)
    }, [threeAxisData])

    return (
        <View style={{backgroundColor: "white", flex: 1, justifyContent: "center", alignItems: "center"}}>
        <View>
            <Navbar func={((provider) => {
                setProvider(provider);
            })}/>
        </View>

            <View style={{backgroundColor: "white", flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={defaultStyles.Text}>{angleX < 0 ? "Turn left" : "Turn right"}</Text>
            </View>
        </View>
    )
}

export default Compass;
