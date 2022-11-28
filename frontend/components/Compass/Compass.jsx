import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Gyroscope } from "expo-sensors";
import Navbar from "../Navbar/Navbar";

import { defaultStyles } from "../styles/defaultStyles";

import celltowers from "../../db/celltowers.json";
import * as Location from "expo-location";

const Compass = ({ navigation, route }) => {
    const [threeAxisData, setThreeAxisData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [angleX, setAngleX] = useState(0);

    // TODO: remove the vars and replace it by getting it from the same place you'll get it in Leaflet.jsx
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

    // TODO: remove this and replace it by getting it from the same place you'll get it in Leaflet.jsx
    useEffect(() => {
        const getCurrentPosition = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
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
    // TODO: remove this and replace it by getting it from the same place you'll get it in Leaflet.jsx
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
    // TODO: remove this and replace it by getting it from the same place you'll get it in Leaflet.jsx
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

        // console.log("");
        // console.log("");
        // console.log("---Start of new search---");
        // console.log(celltowersList[0], userLoc);

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

            // console.log("/// NEW CYCLE ///");
            // console.log("Current cycled marker's distance from the user:", currentDist, Math.sqrt(currentDist[0]**2 + currentDist[1]**2));
            // console.log("Closest marker's distance from the user:", closestDist, Math.sqrt(closestDist[0]**2 + closestDist[1]**2));

            if (Math.sqrt(currentDist[0] ** 2 + currentDist[1] ** 2) < Math.sqrt(closestDist[0] ** 2 + closestDist[1] ** 2)) {
                // console.log("|||CHANGED CLOSEST CELLTOWER|||");
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

    // calculates distance from the user to the closest CT
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
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
        console.log("Angle to cosest marker in radians:", angle);
    }, [closestMarker, userLoc]);

    const _fast = () => {
        Gyroscope.setUpdateInterval(16);
    };

    const _subscribe = () => {
        setSubscription(
            Gyroscope.addListener((gyroscopeData) => {
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
        setAngleX(angleX + threeAxisData.y);
    }, [threeAxisData]);

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ backgroundColor: "white", flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={defaultStyles.Text}>{angleX < 0 ? "Turn left" : "Turn right"}</Text>
            </View>
            <View>
                <Navbar provider={route.params.provider} />
            </View>
        </View>
    );
};

export default Compass;
