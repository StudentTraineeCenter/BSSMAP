import React, {useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";

const Navbar = (props) => {

    const [provider, setProvider] = useState(-1);

    useEffect(() => {
        props.func(provider);
    }, [provider])

    return (
        <View style={styles.container}>
            <Pressable style={provider === 1 ? {backgroundColor: '#cecc', borderRadius: 5} : null}
                       onPress={() => setProvider(provider === 1 ? -1 : 1)}>
                <Text>O2</Text>
            </Pressable>
            <Pressable style={provider === 2 ? {backgroundColor: '#cecc', borderRadius: 5} : null}
                       onPress={() =>  setProvider(provider === 2 ? -1 : 2)}>
                <Text>tmobile</Text>
            </Pressable>
            <Pressable style={provider === 3 ? {backgroundColor: '#cecc', borderRadius: 5} : null}
                       onPress={() =>  setProvider(provider === 3 ? -1 : 3)}>
                <Text>vodafone</Text>
            </Pressable>
            <Pressable style={provider === 4 ? {backgroundColor: '#cecc', borderRadius: 5} : null}
                       onPress={() =>  setProvider(provider === 4 ? -1 : 4)}>
                <Text>poda</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        backgroundColor: 'white'
    }
});

export default Navbar;
