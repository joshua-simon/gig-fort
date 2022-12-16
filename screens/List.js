import { View,Text } from 'react-native'
import ListByDay from '../components/ListByDay';

const List = ({ navigation }) => {
    return (
        <View>
            <ListByDay navigation={navigation}/>
        </View>
    )
}
 
export default List;