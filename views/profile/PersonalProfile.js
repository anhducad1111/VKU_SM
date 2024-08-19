import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  RefreshControl,
  Alert,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref as databaseRef, get } from "firebase/database";
import FetchPostScreen from "../posts/FetchPostScreen";
import DropdownMenu from "../components/DropDownMenu";

const PersonalProfile = ({ navigation }) => {
  const database = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUserUid = currentUser?.uid;
  const [postCount, setPostCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [posts, setPosts] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://picsum.photos/200/200"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        Alert.alert("Signed Out", "You have been signed out successfully.");
        navigation.replace('LoginScreen'); // Navigate to the Login screen or any appropriate screen after sign out
      })
      .catch((error) => {
        // Handle sign-out error
        Alert.alert("Sign Out Error", error.message);
      });
  };

  const dropdownItems = [
    {
      label: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      label: 'Settings',
      onPress: () => navigation.navigate('SettingScreen'),
    },
    {
      label: 'Sign Out',
      onPress: handleSignOut
    },
  ];

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = databaseRef(database, `users/${userId}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserName(userData.name || "No name");
          setProfileImageUrl(userData.photo || profileImageUrl);
        }
      });
      fetchAndCountPosts(userId);
    }
  }, [currentUser]);

  const fetchAndCountPosts = async (userId) => {
    const postRef = databaseRef(database, `posts/${userId}`);
    const snapshot = await get(postRef);
    if (snapshot.exists()) {
      const postsData = snapshot.val();
      const postCount = Object.keys(postsData).length;
      setPostCount(postCount);
    } else {
      setPostCount(0);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    navigation.reset({
      index: 0,
      routes: [{ name: "PersonalProfile" }],
    });
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerProfile}>
        <Pressable
          style={styles.buttonHeaderProfile}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" color="#000" size={25} />
        </Pressable>
        
        <DropdownMenu
          iconName="bars"
          iconSize={25}
          iconColor="#000"
          items={dropdownItems}
        />
      </View>

      <View style={styles.infoProfile}>
        <View style={styles.avatarUser}>
          <Image
            style={styles.imageAvatarUser}
            source={{ uri: profileImageUrl }}
          />
        </View>
        <View style={styles.fetchProfile}>
          <View style={styles.nameBioProfile}>
            <View style={styles.profile}>
              <Text style={styles.nameProfile}>{userName}</Text>
            </View>
            <Text style={styles.bioProfile}>Hello cac b</Text>
          </View>
          <View style={styles.numberProfile}>
            <View style={styles.numberPostProfile}>
              <Text style={styles.postProfile}>Posts</Text>
              <Text style={styles.numberPost}>{postCount}</Text>
            </View>
            <View style={styles.numberFriendProfile}>
              <Text style={styles.friendProfile}>Friends</Text>
              <Text style={styles.numberFriend}>3</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.postFetchProfile}>
      <FetchPostScreen userId={currentUserUid} pageType="personal" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ key: 'posts' }]} // Dummy data to render the FetchPostScreen
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View style={styles.blank}></View>
    </View>
  );
};

export default PersonalProfile;

const styles = StyleSheet.create({
  headerProfile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#fff",
  },
  buttonHeaderProfile: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
    minWidth: 150, 
    paddingVertical: 5, 
  },
  dropdownItem: {
    paddingVertical: 10, 
    paddingHorizontal: 15, 
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  infoProfile: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  avatarUser: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fetchProfile: {
    flex: 1,
  },
  nameBioProfile: {
    marginBottom: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameProfile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  editButtonEditProfile: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  textButtonEditProfile: {
    fontSize: 14,
    color: "#000",
  },
  bioProfile: {
    color: "#666",
  },
  numberProfile: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    marginTop: 10,
  },
  numberPostProfile: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  postProfile: {
    color: "#8e8e8e",
  },
  numberPost: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#666",
  },
  numberFriendProfile: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  friendProfile: {
    color: "#8e8e8e",
  },
  numberFriend: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#666",
  },
  blank: {
    height: 70,
  },
});