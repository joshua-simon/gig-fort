import { useState,useEffect } from 'react';
import { query,collection,getDocs } from 'firebase/firestore';
import { db } from '../firebase';


export const useGigs = () => {
    const [gigs, setGigs] = useState([]);

    useEffect(() => {
        
        const getGigs = async () => {
          try {
            const gigArray = [];
            const q = query(collection(db, "gigs"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) =>
              gigArray.push({ id: doc.id, ...doc.data() })
            );
            setGigs(gigArray);
          } catch (err) {
            console.log(`Error: ${err}`);
          }
        };
        getGigs();
      }, []);

      return gigs
}