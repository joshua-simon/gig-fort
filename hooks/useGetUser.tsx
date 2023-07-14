import { useState, useEffect } from 'react'
import { query, collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export const useGetUser = (userUID) => {
    const [user,setUser] = useState<any>([])

    useEffect(() => {
        const getUser = async () => {
            try {
                const q = query(collection(db, 'users'))
                const querySnapshot = await getDocs(q)
                const filteredUser = querySnapshot.docs.filter(doc => doc.id === userUID)
                filteredUser.map(doc => setUser(doc.data()))
            } catch (err) {
                console.log(`Error: ${err}`)
            }
        }
        getUser()
    },[userUID])

    return user
}