import { useState, useEffect } from 'react'
import {  collection, onSnapshot, query, where  } from 'firebase/firestore'
import { db } from '../firebase'
import { GigObject } from '../routes/homeStack'

export interface Time {
  nanoseconds:number
  seconds:number;
}

export const useGigs = (userLocation?:string) => {
  const [gigs, setGigs] = useState<GigObject[]>([])

  useEffect(() => {
    let gigQuery;

    if (userLocation && userLocation.trim() !== "") {
      // Filter by city if userLocation is defined and not empty
      gigQuery = query(collection(db, 'gigs'), where('city', '==', userLocation));
    } else {
      // Otherwise, get all gigs
      gigQuery = collection(db, 'gigs');
    }

    const unsubscribe = onSnapshot(gigQuery, (querySnapshot) => {
      const queriedGigs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          tickets: doc.data().tickets || "",
          venue: doc.data().venue || "Unknown Venue",
          dateAndTime: doc.data().dateAndTime || { seconds: 0, nanoseconds: 0 },
          isFree: doc.data().isFree || false,
          image: doc.data().image || "",
          genre: doc.data().genre || "",
          gigName: doc.data().gigName || "",
          blurb: doc.data().blurb || "",
          location: doc.data().location || { longitude: 0, latitude: 0 },
          address: doc.data().address || "",
          gigName_subHeader: doc.data().gigName_subHeader || "",
          links: doc.data().links || [],
          ticketPrice: doc.data().ticketPrice || "",
          likes: doc.data().likes || 0,
          likedGigs: doc.data().likedGigs || [],
          savedGigs: doc.data().savedGigs || [],
          city: doc.data().city || "Unknown City",
      }))
      setGigs(queriedGigs)
    })

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe()
  }, [userLocation])

  return gigs
}
