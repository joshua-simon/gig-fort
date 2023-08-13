import { useState, useEffect } from 'react'
import {  collection, onSnapshot  } from 'firebase/firestore'
import { db } from '../firebase'
import { GigObject } from '../routes/homeStack'

export interface Time {
  nanoseconds:number
  seconds:number;
}

export const useGigs = () => {
  const [gigs, setGigs] = useState<GigObject[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'gigs'), (querySnapshot) => {
      const queriedGigs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          tickets: doc.data().tickets || "",
          venue: doc.data().venue || "Unknown Venue",
          dateAndTime: doc.data().dateAndTime || { seconds: 0, nanoseconds: 0 },
          isFree: doc.data().isFree || false,
          image: doc.data().image || "",
          genre: doc.data().genre || "Unknown Genre",
          gigName: doc.data().gigName || "",
          blurb: doc.data().blurb || "",
          location: doc.data().location || { longitude: 0, latitude: 0 },
          address: doc.data().address || "",
          gigName_subHeader: doc.data().gigName_subHeader || "",
          links: doc.data().links || [],
          ticketPrice: doc.data().ticketPrice || "",
          likes: doc.data().likes || 0,
          likedGigs: doc.data().likedGigs || [],
          savedGigs: doc.data().savedGigs || []
      }))
      setGigs(queriedGigs)
    })

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe()
  }, [])

  return gigs
}
