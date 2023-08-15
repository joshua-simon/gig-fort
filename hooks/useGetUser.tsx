import { useState, useEffect } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useGetUser = (userUID) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      if (!userUID) return; // Return early if userUID is not available

      try {
        const userCollection = collection(db, 'users');
        const q = query(userCollection, where('__name__', '==', userUID)); // '__name__' is a special field representing the ID of the document

        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0]; // As we're querying by UID, we should have at most 1 result

        if (userDoc) {
          setUser(userDoc.data());
        } else {
          console.log(`User with UID ${userUID} not found`);
        }

      } catch (err) {
        console.log(`Error: ${err}`);
      }
    };

    getUser();
  }, [userUID]);

  return user;
};
