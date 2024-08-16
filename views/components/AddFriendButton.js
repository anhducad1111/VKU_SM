import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { getDatabase, ref as databaseRef, set, update, get } from 'firebase/database';

const AddFriendButton = ({ sentId, receivedId }) => {
    const [buttonText, setButtonText] = useState("Follow");

    const fetchButtonText = async () => {
        try {
            const db = getDatabase();
            
            const sentFollowingRef = databaseRef(db, `users/${sentId}/following/${receivedId}`);
            const receivedFollowingRef = databaseRef(db, `users/${receivedId}/following/${sentId}`);
            
            const [sentFollowingSnap, receivedFollowingSnap] = await Promise.all([
                get(sentFollowingRef),
                get(receivedFollowingRef)
            ]);

            const sentFollowing = sentFollowingSnap.exists();
            const receivedFollowing = receivedFollowingSnap.exists();

            if (sentFollowing && receivedFollowing) {
                setButtonText("Friend");
            } else if (sentFollowing) {
                setButtonText("Following");
            } else if (receivedFollowing) {
                setButtonText("Follow Back");
            } else {
                setButtonText("Follow");
            }
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
