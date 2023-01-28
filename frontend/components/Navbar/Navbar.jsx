import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

const Navbar = (props) => {
  const navigation = useNavigation();

  return (
    <View style={{ height: 50, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Pressable onPress={() => navigation.navigate("Providers")}>
          <Text style={{ fontSize: 18 }}>
            {props.provider == 1
              ? "O2"
              : props.provider == 2
              ? "T-Mobile"
              : props.provider == 3
              ? "Vodafone"
              : props.provider == 4
              ? "poda"
              : -1}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Navbar;
