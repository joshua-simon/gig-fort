import { FC, useContext } from "react";
import {View,Text} from 'react-native'
import { useGigs } from "../hooks/useGigs";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";

const Profile:FC = () => {

    const gigs = useGigs()

    const { user } = useContext(AuthContext)

    const userDetails = useGetUser(user.uid)

    const gigIDs = userDetails.likedGigs

    const test = gigs.filter(gig => gigIDs?.includes(gig.id))

    return (
        <View>
            <Text>This is the profile screen</Text>
            {test.map(gig => <Text key = {gig.id}>{gig.gigName}</Text>)}
        </View>
    )
}
 
export default Profile;