import { StyleSheet, View,Text } from 'react-native'
import ListByDay from '../components/ListByDay';
import { listProps } from '../routes/homeStack';
import Footer from '../components/Footer';

const List = ({ navigation }: listProps) => {
    return (
        <View style = {styles.list_container}>
            <ListByDay navigation={navigation} />
            <Footer navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    list_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#F7F6F5',
    },
})
 
export default List;