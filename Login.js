import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, ImageBackground } from 'react-native';
import { database, auth } from './Database';
import { userSignIn, userSignOut, registerAccount, GoogleSignIn } from './database_functions/UserAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Divider, Avatar } from 'react-native-elements';
import { SolidButton } from './components/SolidButton';
import { TransparentButton } from './components/TransparentButton';
import { StyledInput } from './components/StyledInput';
import { useTheme } from '@react-navigation/native';
import { styles } from './Styles'
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';
import { AuthDialogsComponent } from './components/AuthDialogsComponent';
import { GoogleSignin, GoogleSigninButton, statusCodes, } from '@react-native-google-signin/google-signin';

export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doInputValueCheck, setDoInputValueCheck] = useState(false)
    const [error, setError] = useState('');
    const [visibleDialog, setVisibleDialog] = useState('')
    const [dialogMessage, setDialogMessage] = useState({title: '', message: ''})
    let invalidInputsList = [];
    const colors = useTheme().colors;

    const changeVisibleDialog = (value, data = null) => { 
        if(value !== null) setVisibleDialog(value)
        if(data) setDialogMessage(data)
    }

    const logIn = () => {
        userSignIn(email, password)
        .then(result => {
        })
        .catch(e => setError(e))
    }

    const handleInvalidValue = (inputName, valueIsInvalid) => {
        invalidInputsList =
            updateInvalidInputsList(invalidInputsList, inputName, valueIsInvalid) 
    }

    useEffect(() => {
        if(doInputValueCheck && !invalidInputsList.length > 0) {
            logIn()
        }
    }, [doInputValueCheck])

    return (
      <>
      {/* Background elements */}
      <View style={{backgroundColor: colors.primary2, width: '100%',opacity:0.95, height: '100%',justifyContent:"center",alignContent:"center",alignItems: "center"}}>
      <ImageBackground
          resizeMode='repeat'
          source={require("./assets/cubes.png")}
          style={{width: '100%',opacity:0.95, height: '100%',justifyContent:"center",alignContent:"center",alignItems: "center"}}
      > 
      <KeyboardAvoidingView style={[{flex:1, alignItems:"center", padding: 20}]}>
        {/* Input Container Main */}
        <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
          <View style={{width:"100%"}}>
            <Text style={{color:colors.extradark, fontSize:22, fontWeight:"bold",marginHorizontal:10}}>Login to Inventory App</Text>
            <Divider color={colors.reverse.card} style={{margin:10}} />
            <StyledInput
              label="Email Address"
              matchType="email"
              style={styles.input}
              placeholder="email@example.com"
              checkValue={doInputValueCheck}
              handleInvalidValue={handleInvalidValue}
              onChangeText={email => setEmail(email)}
              value={email}
              icon="user"
            />
            <StyledInput
              label="Password"
              matchType="text"
              style={styles.input}
              placeholder="Password" 
              secureTextEntry={true}
              checkValue={doInputValueCheck}
              handleInvalidValue={handleInvalidValue}
              onChangeText={password => setPassword(password)} 
              value={password}
              icon="lock"
            />
            {/* ButtonContainer */}
            <View style={{alignItems:"center"}}>
              {!!error && <Text style={styles.error}>{error.code}</Text>}
              <SolidButton
                style={{width:185, marginBottom:10}}
                onPress={() => setDoInputValueCheck(doInputValueCheck + 1)} 
                title="Log in" 
              />
              <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={GoogleSignIn}
              />
              <TransparentButton
                style={{width:"60%"}}
                onPress={() => setVisibleDialog("passwordreset")}
                title="Forgot password" 
              />
            </View>
          </View>
        </View>
        {/* InputContainer registration*/}
        <View style={[{marginTop:20,width:"70%", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
            <View style={{alignItems:"center"}}>
              <Text style={{color:colors.text, fontSize:16, fontWeight:"bold"}}>No account?</Text>
              <Text style={{color:colors.text, fontSize:16, marginBottom: 10}}>Register now!</Text>
              <SolidButton
                style={{width:200}}
                onPress={() => navigation.navigate('Registration')} 
                title="Register now" 
              />
            </View>
        </View>
      </KeyboardAvoidingView>
      </ImageBackground></View>
      <AuthDialogsComponent
        visibleDialog={visibleDialog}
        changeVisibleDialog={changeVisibleDialog}
        dialogMessage={dialogMessage}
      />
      </>
    );
}