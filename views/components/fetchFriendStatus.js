import { getDatabase, ref as databaseRef, get } from 'firebase/database';

export const fetchFriendStatus = async (sentId, receivedId) => {
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
            return "Friend";
        } else if (sentFollowing) {
            return "Following";
        } else if (receivedFollowing) {
            return "Follow Back";
        } else {
            return "Follow";
        }
    } catch (error) {
        console.error("Error fetching follow status: ", error);
        return "Error";
    }
};