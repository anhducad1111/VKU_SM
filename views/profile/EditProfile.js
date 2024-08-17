import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Button,
  Pressable,
  Alert,
  Platform,
  RefreshControl,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getAuth, updatePassword } from "firebase/auth";
import {
  getDatabase,
  ref as databaseRef,
  get,
  update,
} from "firebase/database";
import ImagePicker from "react-native-image-crop-picker";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const EditProfile = ({ navigation }) => {
  const database = getDatabase();
  const storage = getStorage();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = databaseRef(database, `users/${userId}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      });
    }
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    navigation.reset({
      index: 0,
      routes: [{ name: "EditProfile" }],
    });
    setRefreshing(false);
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      const imageUri = Platform.OS === "android" ? image.path : image.uri;
      setNewPhoto(imageUri);
    });
  };

  const uploadImage = async () => {
    if (newPhoto == null) {
      return null;
    }
    const uploadUri = newPhoto;
    const filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    // Add timestamp to File Name
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");
    const newFilename = `${name}-${Date.now()}.${extension}`;
    const photosRef = storageRef(storage, "photos/" + newFilename);
    const metadata = {
      contentType: "image/jpeg",
    };
    const response = await fetch(uploadUri);
    const blob = await response.blob();

    try {
      await uploadBytes(photosRef, blob, metadata);
      const downloadURL = await getDownloadURL(photosRef);
      setNewPhoto(null);
      return downloadURL;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    const userId = currentUser.uid;
    const userRef = databaseRef(database, `users/${userId}`);

    const updatedData = {};
    if (newPhoto) {
      const downloadURL = await uploadImage();
      if (downloadURL) {
        updatedData.photo = downloadURL;
      }
    }

    update(userRef, updatedData)
      .then(() => {
        Alert.alert("Success", "Profile updated successfully!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleChangePassword = () => {
    if (newPassword) {
      updatePassword(currentUser, newPassword)
        .then(() => {
          Alert.alert("Success", "Password updated successfully!");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  if (!userData) return null;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerProfile}>
        <Pressable
          style={styles.buttonHeaderProfile}
          onPress={() => navigation.navigate('PersonalProfile')}
        >
          <Icon name="arrow-left" color="#000" size={25} />
        </Pressable>
        <Pressable
          style={styles.editButtonEditProfile}
          onPress={handleSaveProfile}
        >
          <Text style={styles.textButtonEditProfile}>Save</Text>
        </Pressable>
      </View>
      <Pressable onPress={choosePhotoFromLibrary}>
        <Image
          source={{
            uri:
              newPhoto ||
              userData.photo ||
              "https://example.com/default-photo.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.editText}>Edit Photo</Text>
      </Pressable>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{userData.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{userData.phoneNumber}</Text>

        <Text style={styles.label}>Date of Birth</Text>
        <Text style={styles.value}>{userData.dob}</Text>

        <Text style={styles.label}>Gender</Text>
        <Text style={styles.value}>{userData.gender}</Text>

        <Text style={styles.label}>Class</Text>
        <Text style={styles.value}>{userData.class}</Text>

        <Pressable
          style={styles.changePasswordButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.changePasswordButtonText}>Change Password</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>

              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Enter old password"
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ height: 70 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  buttonHeaderProfile: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
  },
  editButtonEditProfile: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  textButtonEditProfile: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  editText: {
    textAlign: "center",
    color: "#007BFF",
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  changePasswordButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF5733",
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 20,
  },
  changePasswordButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    width: "45%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default EditProfile;
