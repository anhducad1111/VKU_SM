import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { getDatabase, ref as databaseRef, update, get } from 'firebase/database';
import { fetchFriendStatus } from './fetchFriendStatus'; 

const AddFriendButton = ({ sentId, receivedId }) => {
    const [buttonText, setButtonText] = useState("Follow");

    const fetchButtonText = async () => {
        try {
            const status = await fetchFriendStatus(sentId, receivedId);
            setButtonText(status);
        } catch (error) {
            console.error("Error fetching button text: ", error);
        }
    };

    useEffect(() => {
        fetchButtonText();
    }, [sentId, receivedId]);

    const handleFollow = async () => {
        try {
            const db = getDatabase();
            const sentFollowingRef = databaseRef(db, `users/${sentId}/following/${receivedId}`);
            const receivedFollowersRef = databaseRef(db, `users/${receivedId}/followers/${sentId}`);

            const sentFollowingSnap = await get(sentFollowingRef);
            const sentFollowing = sentFollowingSnap.exists();

            if (sentFollowing) {
                await update(databaseRef(db), {
                    [`users/${sentId}/following/${receivedId}`]: null,
                    [`users/${receivedId}/followers/${sentId}`]: null
                });
            } else {
                await update(databaseRef(db), {
                    [`users/${sentId}/following/${receivedId}`]: true,
                    [`users/${receivedId}/followers/${sentId}`]: true
                });
            }
            await fetchButtonText();
        } catch (error) {
            console.error("Error handling follow: ", error);
        }
    };

    return (
        <Pressable style={styles.editButtonEditProfile} onPress={handleFollow}>
            <Text style={styles.textButtonEditProfile}>{buttonText}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    editButtonEditProfile: {
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginHorizontal: 10,
    },
    textButtonEditProfile: {
        color: '#000000',
    }
});

export default AddFriendButton;