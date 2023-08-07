import { doc,updateDoc,getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { arrayUnion, increment, arrayRemove } from 'firebase/firestore'


export const addSavedGigs = async (gigId:string, userId:string) => {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
            savedGigs: arrayUnion(gigId)
        })
    }


export const removeSavedGig = (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    updateDoc(userRef, {
        savedGigs: arrayRemove(gigId)
    })
}

export const incrementLikesByOne = async (gigId:string) => {
    const gigRef = doc(db, 'gigs', gigId)
    await updateDoc(gigRef, {
        likes: increment(1)
    })
}

export const decrementLikesByOne = async (gigId:string) => {
    const gigRef = doc(db, 'gigs', gigId)
    await updateDoc(gigRef, {
        likes: increment(-1)
    })
}

export const addLikedGigIDtoUser = async (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
        likedGigs: arrayUnion(gigId)
    })
}

export const removeLikedGigIDfromUser = async (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
        likedGigs: arrayRemove(gigId)
    })
}

export const getLikes = async (gigID:string) => {
    const gigRef = doc(db, 'gigs', gigID)
    const gig = await getDoc(gigRef)
    return gig.data().likes
}

export const updateUserDetails = async (newFirstName:string,newLastName:string,id:string) => {
    try {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, {
            firstName: newFirstName,
            lastName: newLastName
        });
    } catch (error) {
        alert(error);
    }
}

export const addUserIdToGig = async (gigId:string, userId:string) => {
    const gigRef = doc(db, 'gigs', gigId)
    await updateDoc(gigRef, {
        notifiedUsers: arrayUnion(userId)
    })
}

export const removeUserIdFromGig = async (gigId:string, userId:string) => {
    const gigRef = doc(db, 'gigs', gigId)
    await updateDoc(gigRef, {
        notifiedUsers: arrayRemove(userId)
    })
}







