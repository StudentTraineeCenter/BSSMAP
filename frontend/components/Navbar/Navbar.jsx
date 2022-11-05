import React, {useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import { useNavigation } from '@react-navigation/native';

import { defaultStyles } from "../styles/defaultStyles";

const Navbar = (props) => {

    const [provider, setProvider] = useState(-1);
    const navigation = useNavigation();

    useEffect(() => {
        props.func(provider);
    }, [provider])

    return (
        <View style={styles.container}>
            <Pressable style={provider === 1 ? {backgroundColor: '#0019a5', borderRadius: 5, marginBottom: 5} : null}
                       onPress={() => setProvider(provider === 1 ? -1 : 1)}>
                <Text style={provider === 1 ? {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white'
                } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>O2</Text>
            </Pressable>
            <Pressable style={provider === 2 ? {backgroundColor: '#e80474', borderRadius: 5, marginBottom: 5} : null}
                       onPress={() => setProvider(provider === 2 ? -1 : 2)}>
                <Text style={provider === 2 ? {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white'
                } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>tmobile</Text>
            </Pressable>
            <Pressable style={provider === 3 ? {backgroundColor: '#e60000', borderRadius: 5, marginBottom: 5} : null}
                       onPress={() => setProvider(provider === 3 ? -1 : 3)}>
                <Text style={provider === 3 ? {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white'
                } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>vodafone</Text>
            </Pressable>
            <Pressable style={provider === 4 ? {backgroundColor: '#049dd9', borderRadius: 5, marginBottom: 5} : null}
                       onPress={() => setProvider(provider === 4 ? -1 : 4)}>
                <Text style={provider === 4 ? {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white'
                } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>poda</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Compass')}>
                <Text style={defaultStyles.Text}>Compass</Text>
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
        backgroundColor: 'white',
    },
    providerText: {
        fontFamily: "bold",
    }
});

export default Navbar;
