import React, { useEffect, useState } from "react";
import { ExpoLeaflet } from "expo-leaflet";
import * as Location from "expo-location";
import { Pressable, View, Text } from "react-native";
import celltowers from "../../db/celltowers.json";
import Navbar from "../Navbar/Navbar";

const Leaflet = ({ navigation, route }) => {
  // const [provider, setProvider] = useState(null);
  const [mapMarkers, setMapMarkers] = useState(null);
  const [userLoc, setuserLoc] = useState({
    position: {
      lat: 49.88865,
      lng: 15.41015,
    },
  });
  const [celltowersInRange, setCelltowersInRange] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [locationNotGranted, setLocationNotGranted] = useState(null);
  const [distance, setDistance] = useState(1);
  const [closestMarker, setClosestMarker] = useState({
    position: {
      lat: null,
      lng: null,
    },
  });

  useEffect(() => {
    const distance = route.params.distance
    setDistance(0.01 * distance)
  }, [route.params.distance])

  useEffect(() => {
    const getCurrentPosition = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationNotGranted("Permission to access location was denied");
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

  const mapLayers = [
    {
      attribution:
        '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      baseLayerIsChecked: true,
      baseLayerName: "OpenStreetMap.Mapnik",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
  ];

  useEffect(() => {
    if (locationLoaded) {
      setCelltowersInRange(
        Array.from(celltowers)
          .filter((tower) =>
            tower.operators.includes(
              route.params.provider === 1
                ? "o2"
                : route.params.provider === 2
                ? "tmobile"
                : route.params.provider === 3
                ? "vodafone"
                : route.params.provider === 4
                ? "poda"
                : null
            )
          )
          .filter(
            (tower) =>
              userLoc.position.lng + distance*1.6 > tower.lng &&
              userLoc.position.lng - distance*1.6 < tower.lng &&
              userLoc.position.lat + distance > tower.lat &&
              userLoc.position.lat - distance < tower.lat
          )
      );
    }
  }, [route.params.provider, locationLoaded]);

  useEffect(() => {
    if (
      celltowersInRange === null ||
      celltowersInRange === undefined ||
      celltowersInRange[0] === undefined
    ) {
      setMapMarkers([]);
      return;
    }

    setMapMarkers(
      celltowersInRange.map((tower) => {
        return {
          position: {
            lat: tower.lat,
            lng: tower.lng,
          },
          icon: "<span>📡</span>",
          size: [32, 32],
        };
      })
    );
  }, [celltowersInRange]);

  useEffect(() => {
    if (
      mapMarkers === null ||
      mapMarkers === undefined ||
      mapMarkers[0] === undefined
    ) {
      setClosestMarker({
        position: {
          lat: null,
          lng: null,
        },
      });
      return;
    }

    let tempClosestMarker = {
      position: {
        lat: mapMarkers[0].position.lat,
        lng: mapMarkers[0].position.lng,
      },
    };

    mapMarkers.forEach((marker, index) => {
      let currentDist = [
        Math.abs(userLoc.position.lat - marker.position.lat),
        Math.abs(userLoc.position.lng - marker.position.lng),
      ];

      let closestDist = [
        Math.abs(userLoc.position.lat - tempClosestMarker.position.lat),
        Math.abs(userLoc.position.lng - tempClosestMarker.position.lng),
      ];

      if (
        Math.sqrt(currentDist[0] ** 2 + currentDist[1] ** 2) <
        Math.sqrt(closestDist[0] ** 2 + closestDist[1] ** 2)
      ) {
        tempClosestMarker = {
          position: {
            lat: marker.position.lat,
            lng: marker.position.lng,
          },
          index: index,
        };
      }
    });

    setClosestMarker({
      position: {
        lat: tempClosestMarker.position.lat,
        lng: tempClosestMarker.position.lng,
      },
    });
    mapMarkers.splice(tempClosestMarker.index, 1);
  }, [mapMarkers, userLoc]);

  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <ExpoLeaflet
        backgroundColor={"white"}
        onMessage={(message) => ""}
        mapLayers={mapLayers}
        mapMarkers={
          Array.isArray(mapMarkers) && mapMarkers.length > 0
            ? mapMarkers
                .concat({
                  position: {
                    lat: closestMarker.position.lat,
                    lng: closestMarker.position.lng,
                  },
                  icon: "<span>🦄</span>",
                  size: [32, 32],
                })
                .concat({
                  position: {
                    lat: userLoc.position.lat,
                    lng: userLoc.position.lng,
                  },
                  icon: "<span>📍</span>",
                  size: [32, 32],
                })
            : locationLoaded
            ? [
                {
                  position: {
                    lat: userLoc.position.lat,
                    lng: userLoc.position.lng,
                  },
                  icon: "<span>📍</span>",
                  size: [32, 32],
                },
              ]
            : []
        }
        mapCenterPosition={{
          lat: userLoc.position.lat,
          lng: userLoc.position.lng,
        }}
        zoom={locationLoaded ? 15 : 6}
      />
      <View>
        <Navbar provider={route.params.provider} />
      </View>
    </View>
  );
};

export default Leaflet;
