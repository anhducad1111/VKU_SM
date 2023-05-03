import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import {
    getDatabase,
    ref as databaseRef,
    set,
    onValue,
    onceValue,
    orderByChild,
    equalTo,
    query,
    get
} from "firebase/database";


const AddFriendButton = ({ sentId, receivedId }) => {
    const [status, setStatus] = useState(0);
    const database = getDatabase();
    const pairRef = databaseRef(database, `pair/${sentId}-${receivedId}`);
    const reversePairRef = databaseRef(database, `pair/${receivedId}-${sentId}`);

    useEffect(() => {
        onValue(pairRef, (snapshot) => {
            const data = snapshot.val();
            setStatus(data?.status || 0);
        });
        onValue(reversePairRef, (snapshot) => {
            const data = snapshot.val();
            setStatus(data?.status || 0);
        });
    }, [sentId, receivedId]);

    const handleAddFriend = async () => {
        let newStatus;
        try {
            if (status === 0) {
                await set(pairRef, { 
                    receivedId: receivedId,
                    sentId: sentId,
                    status: 1
                });
                await set(reversePairRef, { 
                    receivedId: sentId,
                    sentId: receivedId,
                    status: 2 
                });
                newStatus = 1;
                setStatus(newStatus);
            } else if (status === 1) {
                await set(pairRef, null);
                await set(reversePairRef, null);
                newStatus = 0;
                setStatus(newStatus);
            } else if (status === 2) {
                await set(pairRef, { 
                    receivedId: receivedId,
                    sentId: sentId,
                    status: 3 
                });
                await set(reversePairRef, { 
                    receivedId: sentId,
                    sentId: receivedId,
                    status: 3 
                });
                newStatus = 3;
                setStatus(newStatus);
            } else if (status === 3) {
                await set(pairRef, null);
                await set(reversePairRef, null);
                newStatus = 0;
                setStatus(newStatus);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buttonText = () => {
        switch (status) {
            case 1:
                return 'Sent';
            case 2:
                return 'Received';
            case 3:
                return 'Friends';
            case 0:
                return 'Add friend';
            default:
                return 'Add friend';
        }
    }

    return (
        <Pressable style={styles.editButtonEditProfile} onPress={handleAddFriend}>
            <Text style={styles.textButtonEditProfile}>{buttonText()}</Text>
        </Pressable>
    );
};


export default AddFriendButton;
const styles = StyleSheet.create({
    editButtonEditProfile: {
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginHorizontal: 10,
    },
    textButtonEditProfile:{
        color: '#000000',
    }
})