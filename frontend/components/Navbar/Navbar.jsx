import React, {useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, View, Switch} from "react-native";
import { useNavigation } from '@react-navigation/native';

import { defaultStyles } from "../styles/defaultStyles";

const Navbar = (props) => {
    const [provider, setProvider] = useState(-1);
    const navigation = useNavigation();
    
    const [inCompassMode, setinCompassMode] = useState(false);
    const toggleComapssMode = () => {
        if (!inCompassMode) navigation.navigate('Compass');
        else navigation.navigate('Map');
        setinCompassMode(previousState => !previousState);
    }

    useEffect(() => {
        props.func(provider);
    }, [provider])

    return (
        <View style={styles.NavBarBody}>
            <View style={styles.verticalContainer}>
                <View style={styles.providerContainer}>
                    <Pressable style={provider === 1 ? {backgroundColor: '#0019a5', borderRadius: 5, marginBottom: 5} : null}
                            onPress={() => setProvider(provider === 1 ? -1 : 1)}>
                        <Text style={provider === 1 ? {
                            fontSize: 20,
                            fontFamily: 'bold',
                            color: 'white'
                        } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>O2</Text>
                    </Pressable>
                    <Pressable style={provider === 2 ? {backgroundColor: '#e80474', borderRadius: 5, marginBottom: 5} : null}
                            onPress={() => setProvider(provider === 2 ? -1 : 2)}>
                        <Text style={provider === 2 ? {
                            fontSize: 20,
                            fontFamily: 'bold',
                            color: 'white'
                        } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>tmobile</Text>
                    </Pressable>
                    <Pressable style={provider === 3 ? {backgroundColor: '#e60000', borderRadius: 5, marginBottom: 5} : null}
                            onPress={() => setProvider(provider === 3 ? -1 : 3)}>
                        <Text style={provider === 3 ? {
                            fontSize: 20,
                            fontFamily: 'bold',
                            color: 'white'
                        } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>vodafone</Text>
                    </Pressable>
                    <Pressable style={provider === 4 ? {backgroundColor: '#049dd9', borderRadius: 5, marginBottom: 5} : null}
                            onPress={() => setProvider(provider === 4 ? -1 : 4)}>
                        <Text style={provider === 4 ? {
                            fontSize: 20,
                            fontFamily: 'bold',
                            color: 'white'
                        } : StyleSheet.compose(defaultStyles.Text, styles.providerText)}>poda</Text>
                    </Pressable>
                </View>

                <Pressable onPress={() => {toggleComapssMode()}} 
                style={styles.compassModeContainer}>
                    <Text style={defaultStyles.Text}>Compass mode</Text>
                    
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={inCompassMode ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleComapssMode}
                        value={inCompassMode}
                    />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    providerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        backgroundColor: 'white',
        width: "100%",
        flexWrap: "wrap",
    },
    compassModeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: "center",
        backgroundColor: 'white',
        width: "100%",
        flexWrap: "wrap",
    },
    verticalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: "flex-end",
        backgroundColor: 'white',
        padding: 15,
    },
    NavBarBody: {
        height: 100,
    },
    providerText: {
        fontFamily: "bold",
    }
});

export default Navbar;
