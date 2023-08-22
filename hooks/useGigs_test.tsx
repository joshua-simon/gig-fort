import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, startAfter, limit } from 'firebase/firestore';
import { db } from '../firebase'

const PAGE_SIZE = 10;

export const useGigs_test = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null); // Track the last document in the results for pagination

  const fetchGigs = async (afterDoc = null) => {
    setLoading(true);

    let gigQuery = query(
      collection(db, 'gigs'),
      orderBy('gigName') // Assume gigs are ordered by name for simplicity. Adjust as needed.
    );

    if (afterDoc) {
      gigQuery = query(gigQuery, startAfter(afterDoc), limit(PAGE_SIZE));
    } else {
      gigQuery = query(gigQuery, limit(PAGE_SIZE));
    }

    onSnapshot(
      gigQuery,
      snapshot => {
        if (!snapshot.empty) {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          setLastDoc(lastVisible);

          const newGigs = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));

          setGigs(prevGigs => [...prevGigs, ...newGigs]);
        }

        setLoading(false);
      },
      err => {
        setError(err);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  return { gigs, loading, error, fetchGigs, lastDoc };
};

export default useGigs_test;
