import React, { useState, useEffect, useMemo } from 'react';
import { database, auth } from './Database'
import { removeItem } from './database_functions/ItemData';
import { Text, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { ref, onValue } from "firebase/database";
import { ListItem, Dialog, Badge, ButtonGroup, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';
import { TransparentButton } from './components/TransparentButton';
import { convertUnix } from './functions/convertUnix';
import { Ionicons } from '@expo/vector-icons';
import { sortItemList } from './functions/sortList';

export const ItemList = ({ navigation, route }) => {
    const [items, setItems] = useState('');
    const [collection, setCollection] = useState(route.params?.collection)
    const [sortedBy, setSortedBy] = useState(0);
    const [reverseSortedBy, setReverseSortedBy] = useState(false);
    const [expandAccordions, setExpandAccordions] = useState([])
    const [dialogMessage, setDialogMessage] = useState({});
    const [visibleDialog, setVisibleDialog] = useState('');
    const colors = useTheme().colors;

    const sortedItems = (items) => useMemo(() => 
      sortItemList(items, sortedBy, reverseSortedBy), [items, sortedBy, reverseSortedBy]
    );

    const changeVisibleDialog = (value, data = null) => { 
        if(value !== null) setVisibleDialog(value)
        if(data) setDialogMessage(data)
    }

    const dbref = collection.shared ? 
      ref(database, 'shared/itemdata/' + collection.accessCode) :
      ref(database, 'users/' + auth.currentUser.uid + '/itemdata/' + collection.name)

    // Updating list from db
    useEffect(() => {
      onValue(dbref, (snapshot) => {
        const data = snapshot.val();
        if(data) {
          let flatlistArray =
            // Make array with keys for flatlist
            Object.entries(data).map(
              item => ({...item[1], key: item[0]})
            )
          setItems(flatlistArray)
          navigation.setOptions({ title: `${collection.name} (${flatlistArray?.length ?? 0} items)` })
        } else {
          setItems('')
        }
      })
    }, []);

    // Accordion content data
    const itemData = (item) => [
      {
        title: "Name",
        value: item.name,
        icon: "tag"
      },
      {
        title: "Description",
        value: item.description,
        icon: "quote-right"
      },
      {
        title: "Amount",
        value: item.amount,
        icon: "cubes"
      },
      {
        title: "Added",
        value: convertUnix(item.added, true),
        icon: "calendar"
      },
    ]

    // Accordion content element
    const itemDataElement = ({ item }) => {
      return(
        <ListItem bottomDivider containerStyle={{backgroundColor:colors.background, height: 30, paddingVertical: 0}}>
          <ListItem.Content>
            <View style={{flexDirection:"row"}}>
              <View style={{flex:1}}>
                <Icon
                  name={item.icon}
                  style={{marginTop:3}}
                  size={16}
                  color={colors.subtle}
                />
              </View>
              <View style={{flex:3}}>
                <ListItem.Title style={{color: colors.text, width:100}}>
                  {item.title}
                </ListItem.Title>
              </View>
              <View style={{flex:6}}>
                <ListItem.Subtitle style={{color: colors.subtitle, width:200}}>
                  {item.value}
                </ListItem.Subtitle>
              </View>
            </View>
          </ListItem.Content>
        </ListItem>
      )
    }

    // Accordion
    const listElement = ({ item }) => {
      let expanded = expandAccordions.includes(item.key)
      return (
        <ListItem.Accordion
          bottomDivider
          noIcon
          isExpanded={expanded}
          onPress={() => {
            if(expanded) {
              setExpandAccordions(
                expandAccordions.filter(
                  el => el !== item.key
                )   
              )
            } else {
              setExpandAccordions([
                ...expandAccordions,
                item.key
              ])
            }
          }}
          containerStyle={{backgroundColor: expanded ? colors.border : colors.card, height: 40, paddingVertical: 0}}
          content={
            <> 
            {/* Accordion top */}
            <View style={{flex:1, alignItems:"flex-start"}}>
              <Badge 
                value={item.amount}
                textStyle={{fontWeight:"bold"}}
                badgeStyle={{
                  backgroundColor: collection.color ?? colors.primary, marginTop:3
                }}
              />
            </View>
            <ListItem.Title style={{color: colors.text, flex:2}}>
              {item.name}
            </ListItem.Title>
            <ListItem.Subtitle style={{color: colors.subtitle, flex:5}}>
              {item.description}
            </ListItem.Subtitle>
            <View style={{flex:1, alignItems:"flex-end"}}>
              {expanded ?
                <Ionicons name="chevron-up-outline" size={20} color={colors.subtle} /> :
                <Ionicons name="chevron-down-outline" size={20} color={colors.subtle} />
              }
            </View>
            </>
          }
        >
          {/* Accordion content */}
          {expanded &&
            <View style={{}}>
              <FlatList
                data={itemData(item)}
                renderItem={itemDataElement}
              />
              <View style={{alignItems:"center", backgroundColor:colors.background, height:50}}>
                <View style={{flexDirection:"row"}}>
                  <SolidButton
                    style={{width:"50%", height:"100%", borderRadius:0}}
                    icon="trash"
                    color="error"
                    onPress={() => {
                      removeItem(collection.name, item.key)
                    }}
                  />
                  <SolidButton
                    style={{width:"50%", height:"100%", borderRadius:0}}
                    icon="edit"
                    color="warning"
                    onPress={() => {
                      navigation.navigate('Add Item', {
                        collection: collection,
                        color: collection.color,
                        item: {
                          id: item.key,
                          name: item.name,
                          description: item.description,
                          amount: item.amount,
                        },
                        edit: true,
                        shared: collection.shared,
                      })
                    }} 
                  />
                </View>
              </View>
              <Divider color={colors.reverse.background} style={{height:1}} />
            </View>
          }
        </ListItem.Accordion>
      )
    }
  
    return(
      <>
      <KeyboardAvoidingView style={[{flex:1, alignItems:"center", padding: 10}]}>
        {/* Main container */}
        <View style={[{height: "100%", width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:10}]}>
          <View style={{width: "100%"}}>
            {/* Sorting */}
            <View style={{width: "100%", height: "10%"}}>
              <Text style={{color:colors.subtle, fontSize:13, marginLeft:10}}>Sorted by:</Text>
              <View style={{flexDirection:"row", width: "100%"}}>
                <ButtonGroup
                  buttons={['Name', 'Added', 'Amount']}
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
              <Text style={{color:colors.primary3, fontSize:20, fontWeight:"bold", marginTop:10}}>Items</Text>
              <Divider color={colors.reverse.card} style={{marginVertical:10}} />
              <View>
                <FlatList
                  data={sortedItems(items)}
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
          {/* Save button */}
          <View style={{alignItems:"center", marginVertical:20, width: "90%"}}>
            <View style={{flexDirection:"row"}}>
              <SolidButton
                style={{width:"50%", marginRight: 5}}
                onPress={() => 
                  navigation.navigate('Add Item', {
                    collection: collection
                  })
                } 
                title="Add Item"
                icon="plus"
                color="primary"
              />
              <SolidButton
                style={{width:"50%", marginLeft: 5}}
                onPress={() => {
                  navigation.navigate('New Collection', {
                    collection: collection,
                    edit: true
                  })
                }}  
                title="Edit Collection"
                icon="edit"
                color="warning"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      </>
    )
}