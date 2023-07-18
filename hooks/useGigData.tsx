import { useState, useEffect } from 'react';
import { doc, getDoc,onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import {
    incrementRecommendByOne,
    addRecommendedGigIDtoUser,
    removeSavedGig,
    addSavedGigs,
    addUserIdToGig,
    removeUserIdFromGig,
    decrementRecommendByOne,
    removeRecommendedGigIDfromUser
  } from "./databaseFunctions";


export const useGigData = (gigId:string,userId:string) => {
    const [isGigSaved, setIsGigSaved] = useState(false);
    const [recommended, setRecommended] = useState(0);
    const [currentUserRecommendedGigs, setCurrentUserRecommendedGigs] = useState(null);
    const [notifications, setNotifications] = useState(false);
    const [isGigRecommended, setIsGigRecommended] = useState(false);

    useEffect(() => {
        const gigRef = doc(db, "test", gigId);
    
        // Listen to real-time updates
        const unsubscribe = onSnapshot(gigRef, (gigSnapshot) => {
          const gigData = gigSnapshot.data();
          
          if (gigData) {
            setRecommended(gigData.likes);
    
            setNotifications(gigData.notifiedUsers?.includes(userId))
          }
        });
    
        let unsubscribeUser;
        if (userId) {
          const userRef = doc(db, 'users', userId);
          unsubscribeUser = onSnapshot(userRef, (userSnapshot) => {
            const userData = userSnapshot.data();
      
            if (userData) {
              if(userData.recommendedGigs.includes(gigId)){
                setIsGigRecommended(true)
              }
      
              if (userData.likedGigs.includes(gigId)) {
                setIsGigSaved(true);
              }
      
            }
          });
        }
    
        // Clean up the listener when the component is unmounted
        return () => {
          unsubscribe();
          unsubscribeUser();
        };
    }, []);

    const toggleSaveGig = (gigID: string) => {
        if (isGigSaved) {
          setIsGigSaved(false);
          removeSavedGig(gigID, userId);
        } else {
          setIsGigSaved(true);
          addSavedGigs(gigID, userId);
        }
      };
    
    const toggleRecommendations = (gigID: string) => {
        setIsGigRecommended(prevState => {
          if (prevState) {
            decrementRecommendByOne(gigID);
            removeRecommendedGigIDfromUser(gigID, userId);
          } else {
            incrementRecommendByOne(gigID);
            addRecommendedGigIDtoUser(gigID, userId);
          }
          return !prevState;
        });
    };
    
    const toggleNotifications = (gigId: string) => {
      if (notifications) {
        removeUserIdFromGig(gigId, userId);
      } else {
        addUserIdToGig(gigId, userId);
      }
    };

    return {
        isGigSaved,
        toggleSaveGig,
        recommended,
        toggleRecommendations,
        notifications,
        toggleNotifications,
        isGigRecommended
    }

}