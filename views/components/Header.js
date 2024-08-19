import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
const Header = () => {
  return (
    <View style={styles.headerHome}>
      <View style={styles.textHeader}>
        <Text style={styles.textAppHeader}>VKU SM</Text>
      </View>
      <View style={styles.iconHeader}>
        <View style={styles.searchIconHeader}>
          <Pressable onPress={() => navigation.navigate("AddPostScreen")}>
            <Icon name="plus" color="#000" size={25} />
          </Pressable>
        </View>
        <View style={styles.postIconHeader}>
          <Pressable onPress={() => navigation.navigate("SearchScreen")}>
            <Icon name="search" color="#000" size={25} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerHome: {
    height: 50,
    backgroundColor: "#808080",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  textHeader: {
    flex: 1,
  },
  textAppHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  searchIconHeader: {
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  postIconHeader: {
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
