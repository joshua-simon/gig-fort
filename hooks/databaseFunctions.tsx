import { doc,updateDoc,getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { arrayUnion, increment, arrayRemove } from 'firebase/firestore'


export const addLikedGigs = async (gigId:string, userId:string) => {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
            likedGigs: arrayUnion(gigId)
        })
    }


export const removeLikedGig = (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    updateDoc(userRef, {
        likedGigs: arrayRemove(gigId)
    })
}

export const incrementRecommendByOne = async (gigId:string) => {
    const gigRef = doc(db, 'test', gigId)
    await updateDoc(gigRef, {
        likes: increment(1)
    })
}

export const decrementRecommendByOne = async (gigId:string) => {
    const gigRef = doc(db, 'test', gigId)
    await updateDoc(gigRef, {
        likes: increment(-1)
    })
}

export const addRecommendedGigIDtoUser = async (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
        recommendedGigs: arrayUnion(gigId)
    })
}

export const removeRecommendedGigIDfromUser = async (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
        recommendedGigs: arrayRemove(gigId)
    })
}

export const getRecommendations = async (gigID:string) => {
    const gigRef = doc(db, 'test', gigID)
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
    const gigRef = doc(db, 'test', gigId)
    await updateDoc(gigRef, {
        notifiedUsers: arrayUnion(userId)
    })
}

export const removeUserIdFromGig = async (gigId:string, userId:string) => {
    const gigRef = doc(db, 'test', gigId)
    await updateDoc(gigRef, {
        notifiedUsers: arrayRemove(userId)
    })
}







