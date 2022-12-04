import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {Magnetometer} from "expo-sensors";
import Navbar from "../Navbar/Navbar";

import {defaultStyles} from "../styles/defaultStyles";

import celltowers from "../../db/celltowers.json";
import * as Location from "expo-location";

const Compass = ({navigation, route}) => {
    const [threeAxisData, setThreeAxisData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [angleX, setAngleX] = useState(0);

    const [userLoc, setuserLoc] = useState(null);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [celltowersList, setCelltowersList] = useState([]);
    const [closestMarker, setClosestMarker] = useState({
        position: {
            lat: null,
            lng: null,
        },
    });
    const [AngleToClosestCellTower, setAngleToClosestCellTower] = useState(null);
    const [distance, setDistance] = useState(null);

    const earthRadius = 6371;

    // gets user location
    useEffect(() => {
        // console.log(route)
        const getCurrentPosition = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }

            return Location.getCurrentPositionAsync({});
        };

        getCurrentPosition().then((location) => {
            setuserLoc({
                position: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                },
            });
            setLocationLoaded(true);
        });
    }, []);

    // makes a list of CTs using the current provider
    useEffect(() => {
        if (route.params.provider == null) {
            setCelltowersList([]);
            return;
        }
        setCelltowersList(
            Array.from(celltowers).filter((tower) =>
                tower.operators.includes(
                    route.params.provider === 1
                        ? "o2"
                        : route.params.provider === 2
                            ? "tmobile"
                            : route.params.provider === 3
                                ? "vodafone"
                                : route.params.provider === 4
                                    ? "poda"
                                    : []
                )
            )
        );
    }, []);

    // figures out closest CT
    useEffect(() => {
        if (celltowersList === null || celltowersList === undefined || celltowersList[0] === undefined || !locationLoaded) {
            setClosestMarker({
                position: {
                    lat: null,
                    lng: null,
                },
            });
            return;
        }

        let tempClosestCelltower = {
            position: {
                lat: celltowersList[0].lat,
                lng: celltowersList[0].lng,
            },
        };

        celltowersList.forEach((celltower, index) => {
            let currentDist = [Math.abs(userLoc.position.lat - celltower.lat), Math.abs(userLoc.position.lng - celltower.lng)];
            let closestDist = [
                Math.abs(userLoc.position.lat - tempClosestCelltower.position.lat),
                Math.abs(userLoc.position.lng - tempClosestCelltower.position.lng),
            ];

            if (Math.sqrt(currentDist[0] ** 2 + currentDist[1] ** 2) < Math.sqrt(closestDist[0] ** 2 + closestDist[1] ** 2)) {
                tempClosestCelltower = {
                    position: {
                        lat: celltower.lat,
                        lng: celltower.lng,
                    },
                    index: index,
                };
            }
        });

        setClosestMarker({
            position: {
                lat: tempClosestCelltower.position.lat,
                lng: tempClosestCelltower.position.lng,
            },
        });
    }, [celltowersList, userLoc, locationLoaded]);

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    // calculates the DISTANCE from the user to the closest CT
    useEffect(() => {
        if (!locationLoaded || closestMarker == null || closestMarker.position.lat == null || closestMarker.position.lng == null) return;

        let tempCoords = {
            lat: deg2rad(closestMarker.position.lat - userLoc.position.lat),
            lng: deg2rad(closestMarker.position.lng - userLoc.position.lng),
        };

        let a =
            Math.sin(tempCoords.lat / 2) * Math.sin(tempCoords.lat / 2) +
            Math.cos(deg2rad(userLoc.position.lat)) *
            Math.cos(deg2rad(closestMarker.position.lat)) *
            Math.sin(tempCoords.lng / 2) *
            Math.sin(tempCoords.lng / 2);

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        setDistance(earthRadius * c);
        console.log("distance to closest cell tower:", Math.round(earthRadius * c * 1000), "m");
    }, [closestMarker, userLoc]);

    // calculates the ANGLE from the user to the closest CT might not work yet
    useEffect(() => {
        if (!locationLoaded || closestMarker == null || closestMarker.position.lat == null || closestMarker.position.lng == null) {
            return;
        }
        let tempCoords = {
            lat: closestMarker.position.lat - userLoc.position.lat,
            lng: closestMarker.position.lng - userLoc.position.lng,
        };
        let angle = Math.atan2(tempCoords.lat, tempCoords.lng);
        setAngleToClosestCellTower(angle);
        console.log("Angle to cosest marker in degrees:", deg2rad(angle), angle);
    }, [closestMarker, userLoc]);

    const _fast = () => {
        Magnetometer.setUpdateInterval(16);
    };

    const _subscribe = () => {
        setSubscription(
            Magnetometer.addListener(setThreeAxisData)
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
        setAngleX(angleX + threeAxisData.y);
        // console.log(threeAxisData)
    }, [threeAxisData]);

    return (
        <View style={{backgroundColor: "white", flex: 1}}>
            <View style={{backgroundColor: "white", flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={defaultStyles.Text}>{angleX < 0 ? "Turn left" : "Turn right"}</Text>
            </View>
            <View>
                <Navbar provider={route.params.provider}/>
            </View>
        </View>
    );
};

export default Compass;
