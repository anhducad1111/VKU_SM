import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  getDatabase,
  ref as databaseRef,
  set,
  onValue,
  orderByChild,
  orderByKey,
  get,
  query,
} from "firebase/database";
import moment from "moment";
import "moment/locale/vi";
import DropdownMenu from "../components/DropDownMenu";

const FetchPostScreen = ({ navigation, userPostId, pageType }) => {
  const database = getDatabase();
  const [posts, setPosts] = useState([]);
  const currentUserId = getAuth().currentUser.uid;

  const fetchUserDetails = async (userId) => {
    const userRef = databaseRef(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    return userSnapshot.val();
  };

  const fetchAndSetPosts = async (
    postRef,
    userIdMapper,
    filterUserId = null
  ) => {
    const postQuery = query(postRef, orderByChild("timestamp"));
    const snapshot = await get(postQuery);
    const postsData = snapshot.val();
    const userDetailsPromises = Object.keys(postsData).map(userIdMapper);
    const userDetailsArray = await Promise.all(userDetailsPromises);
    const userDetailsMap = Object.fromEntries(
      userDetailsArray.map((details, index) => [
        Object.keys(postsData)[index],
        details,
      ])
    );

    let postList = Object.entries(postsData).flatMap(
      ([userIdPost, userPosts]) =>
        Object.entries(userPosts).map(([timestamp, post]) => ({
          userIdPost: userIdPost,
          id: timestamp,
          postText: post.postText,
          privacy: post.privacy,
          postImg: post.postImg,
          timestamp: parseInt(timestamp),
          userPostAdd: userDetailsMap[userIdPost].name,
          photoURL: userDetailsMap[userIdPost].photo,
        }))
    );

    if (filterUserId) {
      postList = postList.filter((post) => post.userIdPost === filterUserId);
    }

    setPosts(postList.reverse());
  };

  useEffect(() => {
    if (pageType === "home") {
      const postRef = databaseRef(database, "posts");
      fetchAndSetPosts(postRef, (userIdPost) => fetchUserDetails(userIdPost));
    } else if (pageType === "personal") {
      const postRef = databaseRef(database, `posts`);
      fetchAndSetPosts(
        postRef,
        (userIdPost) => fetchUserDetails(userIdPost),
        currentUserId
      );
    }
  }, [pageType, currentUserId]);

  const dropdownItems = [
    {
      label: 'Edit Post',
      
    },
    {
      label: 'Sign Out',
    },
  ];

  return (
    <View>
      <ScrollView>
        {posts.map((post) => (
          <View style={styles.container} key={`${post.userIdPost}-${post.id}`}>
            <View style={styles.postContainer}>
              <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                  <View style={styles.avatarContainer}>
                    <Image
                      style={styles.avatar}
                      source={{ uri: post.photoURL }}
                    />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{post.userPostAdd}</Text>
                    <Text style={styles.time}>
                      {moment(post.timestamp).locale("en").fromNow()}
                    </Text>
                  </View>
                </View>
                <View style={styles.postHeaderRight}>
                  <DropdownMenu
                    iconName="ellipsis-h"
                    iconSize={25}
                    iconColor="#000"
                    items={dropdownItems}
                  />
                </View>
              </View>
              <View style={styles.postContent}>
                <Text style={styles.postText}>{post.postText}</Text>
                {post.postImg && (
                  <Image
                    style={styles.postImage}
                    source={{ uri: post.postImg }}
                  />
                )}
              </View>
              <View style={styles.postFooter}>
                <Icon
                  style={styles.iconContainer}
                  name="heart"
                  color="#000"
                  size={25}
                />
                <Icon
                  style={styles.iconContainer}
                  name="comment"
                  color="#000"
                  size={25}
                />
                <Icon
                  style={styles.iconContainer}
                  name="share"
                  color="#000"
                  size={25}
                />
                <Icon
                  style={styles.iconRight}
                  name="bookmark"
                  color="#000"
                  size={25}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FetchPostScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  userInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  postHeaderRight: {
    alignItems: "flex-end",
  },
  postText: {
    fontSize: 16,
    lineHeight: 20,
    margin: 10,
    color: "#666",
  },
  postImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 20,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  iconGroupLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  iconGroupRight: {
    flexDirection: "row",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 50,
  },
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
