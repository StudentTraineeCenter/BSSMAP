import { Pressable, StyleSheet, Text, View} from "react-native";
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
    text: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        padding: 30
    }
})

const Welcome = () => {
    const navigation = useNavigation();

    return (
    <View style={styles.text}>
        <Text style={{
            fontSize: 40,
            fontFamily: "bold",
            color: "#5263A0"
        }}>BSSMAP</Text>
        <Text style={{color: "#5263A0", fontSize: 15}}>
            Aplikace na vyhledávání internetových věží ve vašem okolí. 
            Funguje zcela offline pro chvíle bez internetu.
        </Text>
        <Pressable onPress={() => navigation.navigate("Providers")}>
            <Text style={{color: "#5263A0", fontSize: 20 }}>
                Operátoři →
            </Text>
        </Pressable>
    </View>
    )
}

export default Welcome;
