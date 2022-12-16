import { StyleSheet, Text, View,FlatList,TouchableOpacity } from 'react-native';
import { useGigs } from '../hooks/useGigs';

const ListByDay = () => {

    const gigs = useGigs()

    return ( 
        <View>
            <FlatList
                data = {gigs}
                renderItem = {({ item }) => (
                    <TouchableOpacity>
                        <Text>{item.venue}</Text>
                        <Text>{item.gigName}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
     );
}
 
export default ListByDay;