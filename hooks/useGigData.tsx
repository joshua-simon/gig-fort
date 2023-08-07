import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import {
    incrementLikesByOne,
    addLikedGigIDtoUser,
    removeSavedGig,
    addSavedGigs,
    addUserIdToGig,
    removeUserIdFromGig,
    decrementLikesByOne,
    removeLikedGigIDfromUser
} from "./databaseFunctions";

export const useGigData = (gigId:string | null,userId:string | null) => {
    // Check if gigId or userId is undefined
    if (typeof gigId === 'undefined' || typeof userId === 'undefined') {
        throw new Error('gigId or userId is undefined');
    }

    const [isGigSaved, setIsGigSaved] = useState(false);
    const [likes, setLikes] = useState(0);
    const [currentUserRecommendedGigs, setCurrentUserRecommendedGigs] = useState(null);
    const [notifications, setNotifications] = useState(false);
    const [isGigLiked, setIsGigLiked] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const gigRef = doc(db, "gigs", gigId);
    
        const unsubscribe = onSnapshot(gigRef, (gigSnapshot) => {
          const gigData = gigSnapshot.data();

          if (gigData) {
            setLikes(gigData.likes || 0);
            setNotifications(gigData.notifiedUsers ? gigData.notifiedUsers.includes(userId) : false);
          }
        }, (err) => {
          setError(err);
        });
    
        let unsubscribeUser;
        if (userId) {
          const userRef = doc(db, 'users', userId);
          unsubscribeUser = onSnapshot(userRef, (userSnapshot) => {
            const userData = userSnapshot.data();
            
            if (userData) {
              setIsGigLiked(userData.likedGigs ? userData.likedGigs.includes(gigId) : false);
              setIsGigSaved(userData.savedGigs ? userData.savedGigs.includes(gigId) : false);
            }
          }, (err) => {
            setError(err);
          });
        }

        return () => {
          unsubscribe();
          if (unsubscribeUser) {
            unsubscribeUser();
          }
        };
    }, [gigId, userId]);

    const toggleSaveGig = (gigID: string) => {
        if (isGigSaved) {
          setIsGigSaved(false);
          removeSavedGig(gigID, userId);
        } else { 
          setIsGigSaved(true);
          addSavedGigs(gigID, userId);
        }
    };
    
    const toggleLiked = (gigID: string) => {
        setIsGigLiked(prevState => {
          if (prevState) {
            decrementLikesByOne(gigID);
            removeLikedGigIDfromUser(gigID, userId);
          } else {
            incrementLikesByOne(gigID);
            addLikedGigIDtoUser(gigID, userId);
          }
          return !prevState;
        });
    };

    const showPopup = () => {
      setPopupVisible(true);

      setTimeout(() => {
        setPopupVisible(false);
      }, 3000);
    };

    const toggleNotifications = (gigId: string) => {
      if (notifications) {
        removeUserIdFromGig(gigId, userId);
      } else {
        addUserIdToGig(gigId, userId);
        showPopup()
      }
    };

    return {
        isGigSaved,
        toggleSaveGig,
        likes,
        toggleLiked,
        notifications,
        toggleNotifications,
        isGigLiked,
        isPopupVisible,
        error  // Return the error state for external components to handle
    }
}
