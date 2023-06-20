import { doc,updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { arrayUnion } from 'firebase/firestore'


export const useAddLikedGigs = async (gigId:string, userId:string) => {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
            likedGigs: arrayUnion(gigId)
        })
    }

