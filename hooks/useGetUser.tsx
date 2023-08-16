import { useState, useEffect } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useGetUser = (userUID) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!userUID) return; // Return early if userUID is not available

    const userCollection = collection(db, 'users');
    const q = query(userCollection, where('__name__', '==', userUID)); // '__name__' is a special field representing the ID of the document

    // Using onSnapshot to listen to real-time changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userDoc = snapshot.docs[0]; // As we're querying by UID, we should have at most 1 result

      if (userDoc) {
        setUser(userDoc.data());
      } else {
        console.log(`User with UID ${userUID} not found`);
      }
    }, (err) => {
      console.log(`Error: ${err}`);
    });

    // Cleanup: When component unmounts, we should unsubscribe from the snapshot
    return () => unsubscribe();

  }, [userUID]);

  return user;
};
