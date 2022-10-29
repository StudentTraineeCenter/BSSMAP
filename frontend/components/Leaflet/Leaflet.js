import React, {useEffect, useState} from "react";
import {ExpoLeaflet} from "expo-leaflet";
import * as Location from 'expo-location';
import {View} from "react-native";
import celltowers from "../../db/celltowers.json";

const Leaflet = () => {

    const [userCurrentLocation, setUserCurrentLocation] = useState({
        coords: {
            latitude: 50,
            longitude: 15
        }
    });

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
        getCurrentPosition().then((location) => setUserCurrentLocation(location))

    }, []);

    const mapLayers = [
        {
            attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            baseLayerIsChecked: true,
            baseLayerName: "OpenStreetMap.Mapnik",
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
    ]

    const mapMarkers = Array.from(celltowers).map(tower => {
        {
            return {
                position: {
                    lat: tower.lat,
                    lng: tower.lng
                },
                icon: '<span>🍇</span>',
                size: [32, 32],
            }
        }
    })

    return (
        <View style={{backgroundColor: "black", height: "100%"}}>
            <ExpoLeaflet
                backgroundColor={"white"}
                onMessage={(message) => ""}
                mapLayers={mapLayers}
                mapMarkers={mapMarkers}
                mapCenterPosition={{
                    lat: userCurrentLocation.coords.latitude,
                    lng: userCurrentLocation.coords.longitude,
                }}
                zoom={10}
            />
        </View>
    )

}

export default Leaflet;
