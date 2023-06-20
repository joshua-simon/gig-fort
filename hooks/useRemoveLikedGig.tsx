import { doc,updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { arrayRemove } from 'firebase/firestore'

export const useRemoveLikedGig = (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    updateDoc(userRef, {
        likedGigs: arrayRemove(gigId)
    })
}