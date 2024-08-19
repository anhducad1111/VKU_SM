import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as databaseRef, get } from "firebase/database";
import { fetchFriendStatus } from "../components/fetchFriendStatus"; // Cập nhật đường dẫn chính xác

const FriendScreen = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const db = getDatabase();
        const friendsRef = databaseRef(
          db,
          `users/${currentUser.uid}/following`
        );
        const snapshot = await get(friendsRef);

        if (snapshot.exists()) {
          const followingList = Object.keys(snapshot.val());
          const friendsList = [];

          for (let friendId of followingList) {
            const status = await fetchFriendStatus(currentUser.uid, friendId);
            if (status === "Friend") {
              friendsList.push(friendId);
            }
          }

          setFriends(friendsList);
        } else {
          setFriends([]);
        }
      } catch (error) {
        setError("Error fetching friends.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Friends ({friends.length})</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.friendText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  friendItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  friendText: {
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default FriendScreen;