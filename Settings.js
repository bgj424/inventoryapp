import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, Switch, FlatList, ScrollView } from 'react-native';
import { database, auth } from './Database';
import { changePassword } from './database_functions/UserAuth';
import { changeUserData, getUserAvatar, getUserData } from './database_functions/UserData';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dialog, Avatar, Divider, ListItem, Badge } from 'react-native-elements';
import { SolidButton } from './components/SolidButton';
import { TransparentButton } from './components/TransparentButton';
import { StyledInput } from './components/StyledInput';
import { styles } from './Styles';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { AuthDialogsComponent } from './components/AuthDialogsComponent';
import { clickProps } from 'react-native-web/dist/cjs/modules/forwardedProps';
import { ThemeContext, UserContext } from './AppContext'; 
import { convertUnix } from './functions/convertUnix';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = ({ navigation, route }) => {
    const {theme, setTheme} = useContext(ThemeContext)
    const {user, setUser} = useContext(UserContext)
    const [visibleDialog, setVisibleDialog] = useState('')
    const [dialogMessage, setDialogMessage] = useState({title: '', message: ''})
    const [expandAccordions, setExpandAccordions] = useState({userinfo: false})
    const [initialStates, setInitialStates] = useState({theme: theme})
    const [currentStates, setCurrentStates] = useState({theme: theme})
    const [changed, setChanged] = useState(false)
    const colors = useTheme().colors;

    const changeVisibleDialog = (value, data = null) => { 
        if(value !== null) setVisibleDialog(value)
        if(data) setDialogMessage(data)
    }

    const saveChanges = () => {
        let values;
        if(initialStates.theme !== currentStates.theme) {
            values = {...values, theme: currentStates.theme}
            setInitialStates({...initialStates, theme: currentStates.theme})
        } 
        if(values)
          changeUserData(values)
          .then(res => setChanged(false))
          .catch(e => console.log(e))
    }

    return (
      <>
      <ScrollView contentContainerStyle={{alignItems:"center"}} style={[{flex:1, padding: 10}]}>
      <View style={{flex:1}}>
        {/* Account Container */}
        <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
          <View style={{width:"100%"}}>
            <Text style={{color:colors.extradark, fontSize:20, fontWeight:"bold", marginTop:5}}>
              Account
            </Text>
            <Divider color={colors.reverse.card} style={{marginTop:10,marginBottom:10}} />
            <View style={{flexDirection:"row"}}>
              <Avatar
                title="user"
                size={65}
                rounded
                source={ user?.photoURL ? { uri: user?.photoURL || {} } : require("./assets/user.png")}
              />
              <View style={{flexDirection:"column",justifyContent:"center"}}>
                <Text style={{color:colors.text, fontSize:20, fontWeight:"bold", marginTop:5, marginLeft: 20}}>
                  {(route.params && route.params.changedSettings.username) ?? auth.currentUser.displayName}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Settings container */}
        <View style={[{marginTop:10, width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
          <View style={{width:"100%"}}>
            <Text style={{color:colors.extradark, fontSize:20, fontWeight:"bold", marginTop:5}}>Settings</Text>
            <Divider color={colors.reverse.card} style={{marginTop:10,marginBottom:10}} />
            {/* Darkmode switch */}
            <ListItem
              bottomDivider
              containerStyle={{backgroundColor: colors.card, height: 60}}
            >
              <ListItem.Content>
                <View style={{flexDirection:"row"}}>
                  <Ionicons name="moon-outline" size={20} color={colors.text} style={{width: 30}} />
                  <ListItem.Title style={{color: colors.text}}>
                    Dark mode
                  </ListItem.Title>
                  <ListItem.Subtitle style={{color: colors.subtitle}}>
                  </ListItem.Subtitle>
                </View>
              </ListItem.Content>
              <Switch
                value={theme === "dark" ? true : false}
                onValueChange={() => {
                    let newTheme = theme === "dark" ? "light" : "dark"
                    setTheme(newTheme)
                    setCurrentStates({...currentStates, theme: newTheme})
                    setChanged(true)
                }}
              />
            </ListItem>
            {/* Edit profile */}
            <ListItem
              bottomDivider
              containerStyle={{backgroundColor: colors.card, height: 60}}
              onPress={() => navigation.navigate('Edit Profile')}
            >
              <ListItem.Content>
                <View style={{flexDirection:"row"}}>
                  <Icon
                    name="pencil"
                    size={20}
                    style={{width: 30}}
                    color={colors.text}
                  />
                  <ListItem.Title style={{color: colors.text}}>
                    Edit profile
                  </ListItem.Title>
                  <ListItem.Subtitle style={{color: colors.subtitle}}>
                  </ListItem.Subtitle>
                </View>
              </ListItem.Content>
              <ListItem.Chevron size={20} />
            </ListItem>
            {/* Change pw */}
            <ListItem
              onPress={() => setVisibleDialog("passwordchange")}
              bottomDivider
              containerStyle={{backgroundColor: colors.card, height: 60}}
            >
              <ListItem.Content>
                <View style={{flexDirection:"row"}}>
                  <Icon
                    name="lock"
                    size={20}
                    style={{width: 30}}
                    color={colors.text}
                  />
                  <ListItem.Title style={{color: colors.text}}>
                    Change password
                  </ListItem.Title>
                  <ListItem.Subtitle style={{color: colors.subtitle}}>
                  </ListItem.Subtitle>
                </View>
              </ListItem.Content>
              <ListItem.Chevron size={20} />
            </ListItem>
            {/* View info */}
            <ListItem.Accordion
              bottomDivider
              noIcon
              isExpanded={expandAccordions.userinfo}
              onPress={() => setExpandAccordions({userinfo: !expandAccordions.userinfo})}
              containerStyle={{backgroundColor: colors.card}}

              content={<>
                <ListItem.Content>
                  <View style={{flexDirection:"row"}}>
                    <Icon
                      name="user"
                      size={20}
                      style={{width: 30}}
                      color={colors.text}
                    />
                    <ListItem.Title style={{color: colors.text}}>
                      View user information
                    </ListItem.Title>
                    <ListItem.Subtitle style={{color: colors.subtitle}}>
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </>}
            >
              <ListItem bottomDivider containerStyle={{backgroundColor: colors.card}}>
                <ListItem.Content>
                  <View style={{flexDirection:"row"}}>
                    <ListItem.Title style={{color: colors.text, flex: 10}}>
                      Email address
                    </ListItem.Title>
                    <ListItem.Subtitle style={{color: colors.subtitle}}>
                      {user?.email}
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </ListItem>
              <ListItem bottomDivider containerStyle={{backgroundColor: colors.card}}>
                <ListItem.Content>
                  <View style={{flexDirection:"row"}}>
                    <ListItem.Title style={{color: colors.text, flex: 10}}>
                      Registration date
                    </ListItem.Title>
                    <ListItem.Subtitle style={{color: colors.subtitle}}>
                      {convertUnix(user?.registrationDate, false)}
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>
          </View>
        </View>
      </View>
      </ScrollView>
      {/* Footer */}
      <View style={[{width:"100%", alignItems:"center", position:"absolute", bottom:0}]}>
        {/* Save button */}
        <View style={{flexDirection:"row", alignItems:"center"}}>
          {changed &&
            <SolidButton
              color="primary"
              style={{width:"50%", marginVertical: 20}}
              onPress={() => saveChanges()}
              title="Save changes" 
            />
          }
        </View>
      </View>
      <AuthDialogsComponent 
        visibleDialog={visibleDialog}
        changeVisibleDialog={changeVisibleDialog}
        dialogMessage={dialogMessage}
      />
      </>
    )
}