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
    const [userLoc, setuserLoc] = useState({
        position: {
            lat: 49.88865,
            lng: 15.41015
        }
    });
    const [targetLoc, setTargetLoc] = useState({
        position: {
            lat: 50.88865,
            lng: 16.41015
        }
    });
    const [angle, setAngle] = useState(0)
    const [realY, setRealY] = useState(threeAxisData.y)

    useEffect(() => {
        setRealY(realY - threeAxisData.y)
        setAngle((Math.atan2(targetLoc.position.lat - userLoc.position.lat, targetLoc.position.lng - userLoc.position.lng) * 180 / Math.PI) - realY);
    }, [threeAxisData])

    useEffect(() => {
        console.log(angle)
    }, [angle])

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
