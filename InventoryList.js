import { database, auth } from './Database'
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Text, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { ref, onValue, get, onChildChanged, onChildAdded } from "firebase/database";
import { ListItem, ButtonGroup, Badge, Divider, Dialog } from 'react-native-elements';
import { styles } from './Styles';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';
import { TransparentButton } from './components/TransparentButton';
import { sortInventoryList } from './functions/sortList';
import { StyledInput } from './components/StyledInput';
import { getInventoryAccess } from './database_functions/InventoryData';
import { UserContext } from './AppContext';
import { Icon as RNIcon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export const InventoryList = ({ navigation, route }) => {
    const [initialized, setinitialized] = useState(false)
    const {user, setUser} = useContext(UserContext)
    const [inventories, setInventories] = useState([])
    const [sortedBy, setSortedBy] = useState(0)
    const [reverseSortedBy, setReverseSortedBy] = useState(false)
    const [visibleDialog, setVisibleDialog] = useState('')
    const [accessCode, setAccessCode] = useState('')
    const [error, setError] = useState('')
    const colors = useTheme().colors;

    const sortedItems = (items) => useMemo(() => 
      sortInventoryList(items, sortedBy, reverseSortedBy), [items, sortedBy, reverseSortedBy]
    );

    // Setup automatic observer that updates the list
    useEffect(() => {
      if(!initialized) {
        onValue(ref(
          database, 'users/' + auth.currentUser.uid + '/inventories'
        ), (snapshot) => {
          const data = snapshot.val();
          if(data) {
            // Get own inventories
            let flatlist =
            Object.entries(data).map( // Make array with keys for flatlist
              inventory => {
                return({...inventory[1], key: inventory[0]})
              }
            )
            setInventories(flatlist)
          } else {
              setInventories([])
          }
          setinitialized(true)
        })
      }
    }, [])

    // Update title
    useEffect(() => {
      navigation.setOptions({ title: `My Inventories (${inventories.length ?? 0})` })
    }, [inventories])
    
    const listElement = ({ item }) => {
      return(
        <>
        {item &&
        <ListItem 
          bottomDivider
          onPress={() =>
          navigation.navigate('Item List', {
            inventory: {
              ...item
            }
          })}
          titleStyle={{fontWeight: 'bold'}}
          containerStyle={{backgroundColor: item.color}}
        >
          <ListItem.Content>
            <View style={{flexDirection:"row"}}>
              <ListItem.Title style={{flex:1}}>
                <Text style={{padding:10, color: item.color?colors.lightText:colors.text, fontWeight: "bold"}}>
                  {item.key}
                </Text>
              </ListItem.Title>
              <View style={{flex:1, alignItems:"flex-end"}}>
              {item?.shared ?
                <View style={{flexDirection:"row"}}>
                  <RNIcon
                    name="share"
                    size={22} 
                    color={item.color?colors.lightText:colors.text}
                  />
                  <Text style={{color: item.color?colors.lightText:colors.text}}>
                    {item?.creator === user.displayName ? ` Shared by: you` : ` Shared by: ${item?.creator ?? "Unknown"}`}
                  </Text>
                </View>
              :
                <Text style={{color: item.color?colors.lightText:colors.text}}>
                  {item?.itemCount} items
                </Text>
              }
              </View>
            </View>
          </ListItem.Content>
          <ListItem.Chevron size={20} />
        </ListItem>
        }
        </>
      )
    }

    return(
      <>
      <KeyboardAvoidingView style={[{flex:1, alignItems:"center", backgroundColor:colors.background, padding: 10}]}>
        {/* Main container */}
        <View style={[{height: "100%", width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:10}]}>
          <View style={{width: "100%"}}>
            {/* Sorting */}
            <View style={{width: "100%", height: "10%"}}>
              <Text style={{color:colors.subtle, fontSize:13, marginLeft:10}}>Sorted by:</Text>
              <View style={{flexDirection:"row", width: "100%"}}>
                <ButtonGroup
                  buttons={['Name', 'Created', 'Item Count']}
                  onPress={(value) => {
                    setSortedBy(value)
                  }}
                  selectedIndex={sortedBy}
                  containerStyle={{backgroundColor: colors.background, flex: 1, height: 30}}
                  selectedButtonStyle={{backgroundColor: colors.primary}}
                  textStyle={{color: colors.text}}
                />
                <TransparentButton 
                  style={{width: 40, marginLeft: -5}}
                  icon={reverseSortedBy ? "arrow-up": "arrow-down"}
                  iconColor={reverseSortedBy ? colors.warning : colors.primary}
                  iconSize={25}
                  onPress={() => {
                    setReverseSortedBy(!reverseSortedBy)
                  }}
                />
              </View>
            </View>
            
            {/* Item List */}
            <View style={{width: "100%", height: "90%"}}>
              <Text style={{color:colors.primary3, fontSize:20, fontWeight:"bold", marginTop:10}}>Inventories</Text>
              <Divider color={colors.reverse.card} style={{marginVertical:10}} />
              <View>
                <FlatList
                  data={sortedItems(inventories) ?? null}
                  renderItem={listElement}
                  width={"100%"}
                  height={"75%"}
                />
              </View>
            </View>
          </View>
        </View>
        {/* Footer */}
        <View style={[{width:"100%", alignItems:"center", position:"absolute", bottom:0}]}>
          {/* Add button */}
          <View style={{alignItems:"center", marginVertical:20, width: "90%"}}>
            <View style={{flexDirection:"row"}}>
            <SolidButton
              icon="plus" 
              title="New inventory" 
              style={{width:"50%", marginRight: 5}}
              onPress={() => navigation.navigate('New Inventory')} 
            />
            <SolidButton
              icon="share"
              color="light" 
              title="Open shared" 
              style={{width:"50%", marginLeft: 5}}
              onPress={() => setVisibleDialog("shared")} 
            />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Dialog
        isVisible={visibleDialog === "shared" ? true : false}
        overlayStyle={{backgroundColor: colors.card}}
      >
          <Dialog.Title titleStyle={{color: colors.text}} title="Enter a code" />
          <Text style={{color: colors.text, marginBottom: 20}}>
            To view a shared inventory, you need to enter an access code.
          </Text>
          <StyledInput
            matchType="accesscode"
            iconSet="ionicons"
            //checkValue={doInputValueCheck}
            //handleInvalidValue={handleInvalidValue}
            onChangeText={accessCode => {setAccessCode(accessCode)}}
            value={accessCode}
            placeholder="Access code"
            icon="key-outline"
            inputContainerStyle={{borderWidth:1, borderRadius:5, paddingLeft:10, backgroundColor:colors.background}}
          />
          <Text style={styles.error}>{error}</Text>
          <View style={{width:"100%"}}>
            <Dialog.Actions>
              <SolidButton
                style={{width: "30%", marginLeft:10}}
                title="Cancel"
                color="error"
                onPress={() => setVisibleDialog("")}
              />
              <SolidButton
                style={{width: "30%"}}
                title="Join"
                color="success"
                onPress={() => {
                  getInventoryAccess(accessCode)
                  .then(res => setVisibleDialog(""))
                  .catch(e => setError(`Error (${e})`))
                }}
              />
            </Dialog.Actions>
          </View>
      </Dialog>
      </>
    )
}