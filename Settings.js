import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, Switch, FlatList } from 'react-native';
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
        } if(values)
            changeUserData(values)
    }

    return (
      <>
      <KeyboardAvoidingView style={[{flex:1, alignItems:"center", backgroundColor:colors.background, padding: 20}]}>
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
                  <Ionicons name="moon-outline" size={20} color={colors.text} style={{flex:1}} />
                  <ListItem.Title style={{color: colors.text, flex: 10}}>
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
                    style={{flex:1}}
                    color={colors.text}
                  />
                  <ListItem.Title style={{color: colors.text, flex: 10}}>
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
                    style={{flex:1}}
                    color={colors.text}
                  />
                  <ListItem.Title style={{color: colors.text, flex: 10}}>
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
                      style={{flex:1}}
                      color={colors.text}
                    />
                    <ListItem.Title style={{color: colors.text, flex: 10}}>
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
                      {convertUnix(user?.registrationDate)}
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>
          </View>
        </View>
      </View>
      <SolidButton 
          onPress={() => {getUserData().then(res => console.log(res))}}
          icon="pencil"
          color="warning"
          style={{width:40, marginTop:25, marginLeft:-50}}
      />
      {/* Footer */}
      <View style={[{width:"100%",flexDirection:"row",alignItems:"center"}]}>
        {/* Add button */}
        <View style={{flex:1, alignItems:"center"}}>
          <SolidButton
            color="primary"
            style={{width:200}}
            onPress={() => saveChanges()}
            title="Save changes" 
          />
        </View>
      </View>
      </KeyboardAvoidingView>
      <AuthDialogsComponent 
        visibleDialog={visibleDialog}
        changeVisibleDialog={changeVisibleDialog}
        dialogMessage={dialogMessage}
      />
      </>
    )
}