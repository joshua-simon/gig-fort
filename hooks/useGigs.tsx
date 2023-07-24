import { useState, useEffect } from 'react'
import { query, collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export interface Time {
  nanoseconds:number
  seconds:number;
}

export interface IGigs {
  tickets:string,
  venue:string,
  dateAndTime: Time,
  isFree:boolean,
  image:string,
  genre: string,
  gigName:string, 
  gigName_subHeader:string,
  blurb:string,
  id:string,
  ticketPrice:string,
  address:string,
  links: string[],
  location:{longitude:number,latitude:number},
  likes:number,
  likedGigs:string[],
  savedGigs:string[]
}

export const useGigs = () => {
  const [gigs, setGigs] = useState<IGigs[]>([])

  useEffect(() => {
    const getGigs = async () => {
      try {
        const q = query(collection(db, 'test'))
        const querySnapshot = await getDocs(q)
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
      } catch (err) {
        console.log(`Error: ${err}`)
      }
    }

    getGigs()
  }, [])

  return gigs
}
