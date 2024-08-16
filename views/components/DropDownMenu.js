import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";

const DropdownMenu = ({ iconName, iconSize, iconColor, items }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleItemPress = (onPress) => {
    setMenuVisible(false);
    onPress();
  };

  return (
    <View style={styles.menuContainer}>
      {menuVisible && (
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)} />
      )}
      <Pressable style={styles.menuButton} onPress={toggleMenu}>
        <Icon name={iconName} color={iconColor} size={iconSize} />
      </Pressable>
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          {items.map((item, index) => (
            <Pressable
              key={index}
              style={styles.dropdownItem}
              onPress={() => handleItemPress(item.onPress)}
            >
              <Text style={styles.dropdownText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
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
    zIndex: 2,
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
});

export default DropdownMenu;
