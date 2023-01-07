import { useState, useEffect } from 'react'
import { query, collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export const useGigs = () => {
  const [gigs, setGigs] = useState([])

  useEffect(() => {
    const getGigs = async () => {
      try {
        const q = query(collection(db, 'gigs'))
        const querySnapshot = await getDocs(q)
        const queriedGigs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
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
