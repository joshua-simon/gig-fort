import { useCallback } from "react";
import { View,Text,BackHandler,TouchableOpacity,StyleSheet } from "react-native";
import { FC } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { registrationSuccessProps } from "../routes/homeStack";
import { buttonFilled,buttonFilled_text } from "../styles";

type RegistrationSuccessNavigationProp = registrationSuccessProps['navigation']

interface Props {
    navigation:RegistrationSuccessNavigationProp
}

const RegistrationSuccess:FC<Props> = ({ navigation }) => {


    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    

          return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          };
        }, [])
      );

    return (
        <View style = {{marginLeft:'7%', marginRight: '7%'}}>
            <Text style = {{fontFamily:'NunitoSans', fontSize:16,marginBottom: '5%',marginTop:'5%', textAlign:'center'}}>Congratulations! Your Gig Fort profile has been created</Text>
            <TouchableOpacity onPress={() => navigation.replace('Profile')} style = {buttonFilled}>
              <Text style = {buttonFilled_text}>Proceed to profile</Text> 
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

})
 
export default RegistrationSuccess;