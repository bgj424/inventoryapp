import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, Linking, ImageBackground, ScrollView } from 'react-native';
import { database, auth } from './Database';
import { userSignIn, userSignOut, registerAccount } from './database_functions/UserAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Divider, Avatar } from 'react-native-elements';
import { SolidButton } from './components/SolidButton';
import { TransparentButton } from './components/TransparentButton';
import { StyledInput } from './components/StyledInput';
import { useTheme } from '@react-navigation/native';
import { styles } from './Styles'
import { InfoDialog } from './components/InfoDialog';
import { UserContext } from './AppContext'; 
import { Ionicons } from '@expo/vector-icons';

export const Frontpage = ({ navigation }) => {
  const [visibleDialog, setVisibleDialog] = useState('');
  const { user, setUser } = useContext(UserContext);
  const [dialogMessage, setDialogMessage] = useState({title: '', message: ''})
  const colors = useTheme().colors;

  const changeVisibleDialog = (value, data = null) => { 
    if(value !== null) setVisibleDialog(value)
    if(data) setDialogMessage(data)
  }

  return (
    <>
    <ScrollView contentContainerStyle={{alignItems:"center"}} style={[{flex:1, padding: 10}]}>
      <View style={{flex:1}}>
        {/* Input Container Main */}
        <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
          <View style={{width:"100%"}}>
            <View style={{flexDirection:"row"}}>
              <Ionicons name="logo-react" size={27} color={colors.primary2} style={{marginRight:10}} />
            <Text style={{color:colors.primary3, fontSize:22, fontWeight:"bold"}}>
              Welcome {user?.displayName}
            </Text>
            </View>
            <Divider color={colors.reverse.card} style={{marginTop:10,marginBottom:10}} />
            <View style={{flexDirection:"row"}}>
              <View style={{marginRight:10}}>
                <Avatar
                  title="user"
                  size={65}
                  rounded
                  source={ user?.photoURL ? { uri: user?.photoURL || {} } : require("./assets/user.png")}
                />
              </View>
              <View>
                <Text style={[styles.buttonLabel, {color: colors.text, fontSize:16}]}>
                  Welcome to Mobile Inventory!
                  You have a total of 0 items
                  in 0 inventories
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Profile Containers */}
        <View style={[{width:"100%",flexDirection:"row",alignItems:"center"}]}>
          {/* User profile */}
          <View style={{flex: 1, marginTop:10, marginBottom:10, marginRight:5, backgroundColor:colors.card, borderRadius:5, padding:20}}>
            <View style={{flexDirection:"row"}}>
              <Icon
                  style={{marginRight: 15}}
                  name="user"
                  size={30}
                  color={colors.primary2}
              />
              <Text style={{color:colors.primary3, fontSize:20, fontWeight:"bold"}}>Account</Text>
            </View>
            <Divider color={colors.reverse.card} style={{marginTop:10,marginBottom:10}} />
            <Text style={[styles.buttonLabel, {color: colors.text, fontSize:16, marginBottom:18}]}>
              Change preferences and edit account details at Settings
            </Text>
            <SolidButton
              style={{width:"100%", marginTop:10}}
              onPress={() => navigation.navigate('Settings')} 
              title="Go to Settings"
            />
          </View>
          {/* User item data */}
          <View style={{flex: 1, marginTop:10, marginBottom:10, marginLeft:5, backgroundColor:colors.card, borderRadius:5, padding:20}}>
            <View style={{flexDirection:"row"}}>
              <Icon
                  style={{marginRight: 15}}
                  name="briefcase"
                  size={30}
                  color={colors.primary2}
              />
              <Text style={{color:colors.primary3, fontSize:20, fontWeight:"bold"}}>My Items</Text>
            </View>
            <Divider color={colors.reverse.card} style={{marginTop:10,marginBottom:10}} />
            <View style={{flexDirection:"row"}}></View>
            <Text style={[styles.buttonLabel, {color: colors.text, fontSize:16}]}>
              View your inventory, inventories and items at the Items tab
            </Text>
            <SolidButton 
              style={{width:"100%", marginTop:10}}
              onPress={() => navigation.navigate('Items', { screen: 'Inventories' })} 
              title="Go to Items"
            />
          </View>
        </View>
        {/* Help Container */}
        <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
          <View style={{width:"100%", alignItems:"center"}}>
          <View style={{flexDirection:"row"}}>
              <Icon
                  style={{marginRight: 15}}
                  name="question-circle"
                  size={30}
                  color={colors.primary2}
              />
              <Text style={{color:colors.extradark, fontSize:20, fontWeight:"bold", textDecorationLine:"underline"}}
                onPress={() => {
                  setVisibleDialog("info")
                  setDialogMessage({
                    title: "About the app",
                    message: <>
                      <Text style={{color: colors.text}}>
                        Inventory App allows you to create lists which contain information about items. Get started by clicking 
                      </Text>
                      <Text style={{color:colors.primary3}}> Items</Text>
                      <Text style={{color: colors.text}}> on the bottom right corner.</Text>
                      <Text style={{color: colors.text}}>{"\n\n"}GitHub:{"\n"}</Text>
                      <Text 
                        style={{color: colors.primary3, textDecorationLine:"underline", fontSize:16}} 
                        onPress={() => Linking.openURL('https://github.com/bgj424/inventoryapp')}
                      >
                        github.com/bgj424/inventoryapp
                      </Text>
                      <Text style={{color: colors.text}}>{"\n\n"}Made with </Text>
                      <Ionicons name="logo-firebase" size={20} color={colors.text} style={{marginRight:5}} />
                      <Ionicons name="logo-react" size={20} color={colors.text} style={{marginRight:5}} />
                    </>
                  })
                }}
              >
                About the app
              </Text>
            </View>
          </View>
        </View>
        {/* Footer */}
        <View style={{alignItems:"center", marginVertical: 20}}>
          <View style={[{width:"70%", alignItems:"center"}]}>
            {/* Logout Button */}
            <SolidButton
                style={{width:"50%", marginBottom:10}}
                color={colors.extradark}
                onPress={() => userSignOut()} 
                title="Log out" 
            />
            {/* App info */}
            <View style={{flexDirection:"row", borderRadius:5, alignItems:"center"}}>
              <Ionicons name="logo-react" size={20} color={colors.subtle} style={{marginRight:5}} />
              <Text style={{color: colors.subtle, fontSize:16, marginRight:6}}>
                Inventory App (Version 1.0)
              </Text>
              <Ionicons name="logo-github" size={20} color={colors.text} style={{marginRight:5, marginLeft: 6}} />
              <Text 
                style={{color: colors.primary3, textDecorationLine:"underline", fontSize:16}} 
                onPress={() => Linking.openURL('https://github.com/bgj424/inventoryapp')}
              >
                GitHub&nbsp;
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    <InfoDialog
      visibleDialog={visibleDialog}
      changeVisibleDialog={changeVisibleDialog}
      title={dialogMessage.title}
      message={dialogMessage.message}
      icon={dialogMessage.icon}
    />
    </>
  )
}