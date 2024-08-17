import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useWindowDimensions } from "react-native";

const daotaoUrl = "https://daotao.vku.udn.vn";

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(daotaoUrl);
        const html = result.data;

        const daotaoNotifies = extractNotifiesFromDaotao(html);
        setNotifications([...daotaoNotifies]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const extractNotifiesFromDaotao = (html) => {
    let notifications = [];

    const regex =
      /<li class="">\s*<a href="([^"]*)">([^<]*)<\/a>\s*<span[^>]*>([^<]*)<\/span>/g;
    let match;

    // Lặp qua tất cả các kết quả tìm được
    while ((match = regex.exec(html)) !== null) {
      const href = match[1];
      const title = match[2].replace(/\s+/g, " ").trim();
      const date = match[3].trim();
      notifications.push({
        title,
        href: `${daotaoUrl}${href}`,
        date,
      });
    }

    return notifications;
  };

  // Hàm render mỗi thông báo trong danh sách
  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() =>
        navigation.navigate("NotificationDetail", { url: item.href })
      }
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Hiển thị danh sách thông báo và footer
  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications available.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
      <View style={styles.footerView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  footerView: {
    height: 70,
    backgroundColor: "#f0f0f0", // Màu nền tùy chỉnh
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default NotificationScreen;
