import { useState, useEffect } from 'react';
import { doc, getDoc,onSnapshot } from "firebase/firestore";
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
    const [isGigSaved, setIsGigSaved] = useState(false);
    const [likes, setLikes] = useState(0);
    const [currentUserRecommendedGigs, setCurrentUserRecommendedGigs] = useState(null);
    const [notifications, setNotifications] = useState(false);
    const [isGigLiked, setIsGigLiked] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const gigRef = doc(db, "gigs", gigId);
    
        // Listen to real-time updates
        const unsubscribe = onSnapshot(gigRef, (gigSnapshot) => {
          const gigData = gigSnapshot.data();
          
          if (gigData) {
            setLikes(gigData.likes);
    
            setNotifications(gigData.notifiedUsers?.includes(userId))
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
              if(userData.likedGigs.includes(gigId)){
                setIsGigLiked(true)
              }
      
              if (userData?.savedGigs.includes(gigId)) {
                setIsGigSaved(true);
              }
      
            }
          }, (err) => {
            setError(err);
          });
        }
    
        // Clean up the listener when the component is unmounted
        return () => {
          unsubscribe();
          if (unsubscribeUser) {
            unsubscribeUser();
          }
        };
    }, []);

    error && console.log(error);

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
  
      // Hide the popup after 2 seconds
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
        isPopupVisible
    }

}