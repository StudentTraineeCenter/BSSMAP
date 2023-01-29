import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "column",
  },
  button: {
    margin: 30,
    backgroundColor: "white",
    paddingVertical: 20,
    width: "70%",
    shadowColor: "black",
    shadowOpacity: 0.9,
    elevation: 4,
  },
  text: {
    fontSize: 20,
    alignSelf: "center",
  },
});

const Providers = ({ navigation }) => {
  const [distance, setDistance] = useState(0.1);

  const handleDistance = () => {
    if (distance < 300) {
      setDistance(distance*2)
      return
    }

    setDistance(0.1)
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 40,
          fontFamily: "bold",
          color: "#5263A0",
          marginBottom: 30,
        }}
      >
        Operátoři
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Map", { provider: 1, distance: distance })}
      >
        <Text style={styles.text}>O2</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Map", { provider: 2, distance: distance })}
      >
        <Text style={styles.text}>T-Mobile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Map", { provider: 3, distance: distance })}
      >
        <Text style={styles.text}>Vodafone</Text>
      </TouchableOpacity>

      <Text style={{textAlign: "left"}}>
        Vzdálenost vykreslování
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleDistance}>
        <Text style={styles.text}>{distance}km</Text>
      </TouchableOpacity>

      <Text style={{ color: "#5263A0", fontSize: 15, margin: 15 }}>
        Někteří operátoři využívají sítě jiných operátorů, pokud nevíte, kterou
        síť váš operátor využívá, kontaktujte ho.
      </Text>
    </View>
  );
};

export default Providers;
