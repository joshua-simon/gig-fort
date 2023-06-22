import { useContext,useState,useEffect } from 'react';
import { StyleSheet,View,Image,Text,Platform,TouchableOpacity } from 'react-native'
import { Ionicons, AntDesign, Entypo  } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';
import { useAddLikedGigs } from '../hooks/useAddLikedGigs';
import { useRemoveLikedGig } from '../hooks/useRemoveLikedGig';
import { incrementRecommendByOne, addRecommendedGigIDtoUser, getRecommendations } from '../hooks/useAddLikedGigs';
import { useGetUser } from '../hooks/useGetUser';
import { doc,updateDoc,getDoc } from 'firebase/firestore'
import { db } from '../firebase'


const GigCard = ({item}) => {

  const [ isGigLiked, setIsGigLiked ] = useState(false)
  const [ recommended,setRecommended ] = useState(0)

  const { user } = useContext(AuthContext)

  const currentUser = useGetUser(user.uid)

    const addGigToLikedGigs = (gigId:string) => {
      useAddLikedGigs(gigId, user.uid)
    }

    const removeGigFromLikedGigs = (gigId:string) => {
      useRemoveLikedGig(gigId, user.uid)
    }

    const changeGig = (gigID:string) => {
      if(isGigLiked){ 
        setIsGigLiked(false)
        removeGigFromLikedGigs(gigID)
      }else{
        setIsGigLiked(true) 
        addGigToLikedGigs(gigID)
      }
    }

    useEffect(() => {
      const fetchLikes =  async () => {
        const gigRef = doc(db, 'gigs', item.id)
        const gig = await getDoc(gigRef)
        setRecommended(gig.data().likes)
      }
      const fetchSaves = async () => {
        const userRef = doc(db, 'users', user.uid)
        const userDetails = await getDoc(userRef)
        if(userDetails.data().likedGigs.includes(item.id)){
          setIsGigLiked(true)
        }
      }
      fetchLikes()
      fetchSaves()
    },[recommended])


    const increaseRecommendations = (gigID:string) => {
      if(!currentUser.recommendedGigs.includes(gigID)){
        incrementRecommendByOne(gigID)
        addRecommendedGigIDtoUser(gigID, user.uid)
        setRecommended(recommended + 1)
      } else {
        console.log('already recommended')
      }
    }

    
    const gigTitle = item.gigName.length > 30 ? `${item.gigName.substring(0,30)}...` : item.gigName


    return (
    <View style={styles.gigCard_items}>
        <Text style={styles.gigCard_header}>{gigTitle}</Text>
            <View style = {styles.venueDetails}>
                <Ionicons name="location-outline" size={14} color="black" />
                <Text style={styles.gigCard_details}>{item.venue}  |  {item.genre}</Text>
            </View>
            <View style = {styles.imageAndBlurb}>
                <Image style = {styles.gigCard_items_img} source = {{uri: item.image}}/>
                <Text style={styles.blurbText}>{`${item.blurb.substring(0,60)}...`}</Text>
            </View>
        <Text style = {styles.seeMore}>See more {`>`}</Text>    
            <TouchableOpacity
              onPress = {() => changeGig(item.id)}
            >
               {isGigLiked ? <AntDesign name="heart" size={24} color="black" /> : <AntDesign name="hearto" size={24} color="black" />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress = {() => increaseRecommendations(item.id)}
            >
              <Entypo name="arrow-bold-up" size={24} color="black" />
            </TouchableOpacity>
            <Text>{`  ${recommended} ${recommended == 1 ? 'person has' : 'people have'} reccomended this gig`}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    gigCard: {
      marginLeft:'7%',
      marginRight:'7%',
      backgroundColor:'#FAF7F2',
      height:'auto',
      marginBottom:16,
      padding:'3%',
      borderRadius:10,
      ...Platform.select({
        ios:{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        },
        android:{
         elevation: 4,       
        }
      })
    },
    header: {
      padding: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      padding: 15,
    },
    touchable: {
      padding: 6,
    },
    gigCard_header: {
      fontFamily: "NunitoSans",
      fontSize: 18,
      lineHeight:24.55
    },
    gigCard_details: {
      fontFamily: "LatoRegular",
      color: "#000000",
      flexShrink: 1,
      fontSize:12,
      lineHeight:17.04
    },
    venueDetails:{
      flexDirection:'row',
      alignItems:'center'
    },
    date: {
      paddingLeft: 10,
      fontFamily: "Sofia-Pro",
      fontSize: 20,
      textDecorationLine: "underline",
    },
    gigCard_items: {
      flexDirection:'column',
    },
    gigCard_items_img:{
      height:85.63,
      width:100,
      borderRadius:8,
      marginRight:'3%'
    },
    imageAndBlurb:{
      flexDirection:'row',
      transform:[{translateY:15}]
    },
    seeMore:{
      textAlign:'right',
      fontFamily:'LatoRegular',
      fontSize:12,
      lineHeight:17.04,
      color:'#377D8A'
    },
    blurbText:{
      flex: 1,
      fontFamily:'LatoRegular',
      size:10,
      lineHeight:14.2
    }
  });

export default GigCard;



