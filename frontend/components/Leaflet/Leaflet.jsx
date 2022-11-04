import React, {useEffect, useState} from "react";
import {ExpoLeaflet} from "expo-leaflet";
import * as Location from 'expo-location';
import {View} from "react-native";
import celltowers from "../../db/celltowers.json";
import Navbar from "../Navbar/Navbar";

const Leaflet = () => {

    const [provider, setProvider] = useState(null);
    const [mapMarkers, setMapMarkers] = useState(null);
    const [userCurrentLocation, setUserCurrentLocation] = useState({
        coords: {
            latitude: 49.88865,
            longitude: 15.41015
        }
    });
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [locationNotGranted, setLocationNotGranted] = useState(null);

    useEffect(() => {

        const getCurrentPosition = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationNotGranted('Permission to access location was denied');
                return;
            }

            return Location.getCurrentPositionAsync({});
        }
        getCurrentPosition().then((location) => {
            setUserCurrentLocation(location)
            setLocationLoaded(true);
        })

    }, []);

    const mapLayers = [
        {
            attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            baseLayerIsChecked: true,
            baseLayerName: "OpenStreetMap.Mapnik",
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
    ]

    useEffect(() => {
        setMapMarkers(Array.from(celltowers)
            .filter(tower => tower.operators.includes(provider === 1 ? "o2" : provider === 2 ? "tmobile" : provider === 3 ? "vodafone" : provider === 4 ? "poda" : null))
            .filter(tower => userCurrentLocation.coords.longitude + 0.16 > tower.lng && userCurrentLocation.coords.longitude - 0.16 < tower.lng && userCurrentLocation.coords.latitude + 0.1 > tower.lat && userCurrentLocation.coords.latitude - 0.1 < tower.lat)
            .map(tower => {
                return {
                    position: {
                        lat: tower.lat,
                        lng: tower.lng
                    },
                    icon: '<span>📡</span>',
                    size: [32, 32],
                }
            }))
    }, [provider])

    return (
        <View style={{backgroundColor: "black", flex: 1}}>
            <View style={{height: "12%"}}>
                <Navbar func={(provider => setProvider(provider))}/>
            </View>
            <ExpoLeaflet
                backgroundColor={"white"}
                onMessage={(message) => ""}
                mapLayers={mapLayers}
                mapMarkers={mapMarkers}
                mapCenterPosition={{
                    lat: userCurrentLocation.coords.latitude,
                    lng: userCurrentLocation.coords.longitude
                }}
                zoom={locationLoaded ? 15 : 6}
            />
        </View>
    )

}

export default Leaflet;
