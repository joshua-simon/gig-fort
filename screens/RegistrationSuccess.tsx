import { useCallback } from "react";
import { View,Text,Button,BackHandler } from "react-native";
import { FC } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { registrationSuccessProps } from "../routes/homeStack";

type RegistrationSuccessNavigationProp = registrationSuccessProps['navigation']

interface Props {
    navigation:RegistrationSuccessNavigationProp
}

const RegistrationSuccess:FC<Props> = ({ navigation }) => {

    //prevents user from going back to registration page

    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            // Perform your desired action or show an alert/message here
            // For example, you can show a confirmation dialog to confirm if the user wants to navigate back
    
            // Return true to prevent navigation back
            return true;
          };
    
          // Add a listener for the hardware back button press event
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          // Clean up the listener when the component is unfocused or unmounted
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          };
        }, [])
      );

    return (
        <View>
            <Text>Congratulations! Your Gig Fort profile has been created</Text>
            <Button title="Proceed to profile" onPress={() => navigation.navigate('Profile')} />
        </View>
    )
}
 
export default RegistrationSuccess;