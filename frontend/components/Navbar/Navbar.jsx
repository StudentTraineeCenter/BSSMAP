import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
    },
});

const Navbar = (props) => {
    const navigation = useNavigation();

    let routes = navigation.getState().routes; // gets the list of routes the user traveled
    const inCompassMode = useState(routes[routes.length - 1].name == "Compass" ? true : false); // checks if user is using the compass
    const toggleComapssMode = () => {
        if (!inCompassMode) navigation.navigate("Compass", { provider: props.provider });
        else navigation.navigate("Map", { provider: props.provider });
    };

    return (
        <View style={{ height: 50, backgroundColor: "white" }}>
            <View style={styles.container}>
                <Pressable onPress={() => toggleComapssMode()}>
                    <Text style={{ fontFamily: "bold" }}>Compass</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Providers")}>
                    <Text style={{ fontFamily: "bold" }}>
                        {props.provider == 1 ? "O2" : props.provider == 2 ? "T-Mobile" : props.provider == 3 ? "Vodafone" : props.provider == 4 ? "poda" : -1}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Navbar;
