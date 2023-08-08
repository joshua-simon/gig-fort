import { doc,updateDoc,getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { arrayUnion, increment, arrayRemove } from 'firebase/firestore'


export const addSavedGigs = async (gigId: string, userId: string) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, {
      savedGigs: arrayUnion(gigId),
    });
  } catch (error) {
    console.error("Error adding saved gig", error);
  }
};


export const removeSavedGig = async (gigId: string, userId: string) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, {
      savedGigs: arrayRemove(gigId),
    });
  } catch (error) {
    console.error("Error removing saved gig", error);
  }
};

export const incrementLikesByOne = async (gigId: string) => {
  const gigRef = doc(db, "gigs", gigId);
  try {
    await updateDoc(gigRef, {
      likes: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing likes", error);
  }
};

export const decrementLikesByOne = async (gigId: string) => {
  const gigRef = doc(db, "gigs", gigId);
  try {
    await updateDoc(gigRef, {
      likes: increment(-1),
    });
  } catch (error) {
    console.error("Error decrementing likes", error);
  }
};

export const addLikedGigIDtoUser = async (gigId: string, userId: string) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, {
      likedGigs: arrayUnion(gigId),
    });
  } catch (error) {
    console.error("Error adding liked gig id to user", error);
  }
};

export const removeLikedGigIDfromUser = async (gigId:string, userId:string) => {
    const userRef = doc(db, 'users', userId)
    try {
        await updateDoc(userRef, {
            likedGigs: arrayRemove(gigId)
        })
    } catch (error) {
        console.error('Error removing gig id from user', error)
    }
}

export const getLikes = async (gigID: string) => {
  const gigRef = doc(db, "gigs", gigID);
  try {
    const gig = await getDoc(gigRef);
    return gig.data().likes;
  } catch (error) {
    console.error("Error getting likes", error);
  }
};

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

export const addUserIdToGig = async (gigId: string, userId: string) => {
  const gigRef = doc(db, "gigs", gigId);
  try {
    await updateDoc(gigRef, {
      notifiedUsers: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error adding user id to gig", error);
  }
};

export const removeUserIdFromGig = async (gigId: string, userId: string) => {
  const gigRef = doc(db, "gigs", gigId);
  try {
    await updateDoc(gigRef, {
      notifiedUsers: arrayRemove(userId),
    });
  } catch (error) {
    console.error("Error removing user id from gig", error);
  }
};







