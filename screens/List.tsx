import { StyleSheet, View,Text } from 'react-native'
import ListByDay from '../components/ListByDay';
import { listProps } from '../routes/homeStack';

const List = ({ navigation }: listProps) => {
    return (
        <View style = {styles.list_container}>
            <ListByDay navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    list_container: {
        flex:1,
        backgroundColor: 'azure'
    }
})
 
export default List;