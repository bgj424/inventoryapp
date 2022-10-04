import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, ImageBackground } from 'react-native';
import { database, auth } from './Database';
import { userSignIn, userSignOut, registerAccount } from './database_functions/UserAuth';
import { updateUserProfile, changeUserData } from './database_functions/UserData';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Divider } from 'react-native-elements';
import { SolidButton } from './components/SolidButton';
import { TransparentButton } from './components/TransparentButton';
import { StyledInput } from './components/StyledInput';
import { useTheme } from '@react-navigation/native';
import { styles } from './Styles'
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';

export const RegistrationScreen = ( { navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [doInputValueCheck, setDoInputValueCheck] = useState(false)
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    let invalidInputsList = [];
    const colors = useTheme().colors;

    const register = () => {
        setError('')
        registerAccount(email, password, userName)
        .catch(e => setError(e))
    }
    
    const handleInvalidValue = (inputName, valueIsInvalid) => {
        invalidInputsList =
            updateInvalidInputsList(invalidInputsList, inputName, valueIsInvalid) 
    }

    useEffect(() => {
        if(doInputValueCheck && !invalidInputsList.length > 0) {
            register()
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
        <KeyboardAvoidingView style={[{flex:1, alignItems:"center", padding: 70}]}>
        {/* InputContainer Main */}
        <View style={[{width:"100%", flexDirection:"row", alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
          <View style={{width:"100%"}}>
            <Text style={{color:colors.extradark, fontSize:22, fontWeight:"bold",margin:10}}>Register Account</Text>
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
                matchType="password"
                placeholder="Password" 
                secureTextEntry={true}
                checkValue={doInputValueCheck}
                handleInvalidValue={handleInvalidValue}
                onChangeText={password => setPassword(password)} 
                value={password}
                icon="lock"
            />
            <StyledInput
                label="Type password again"
                matchType={{match: password===passwordConfirmation ? true : false, errMsg: "Passwords do not match"}}
                placeholder="Type password again" 
                secureTextEntry={true}
                checkValue={doInputValueCheck}
                handleInvalidValue={handleInvalidValue}
                onChangeText={passwordConfirmation => setPasswordConfirmation(passwordConfirmation)} 
                value={passwordConfirmation}
                icon="lock"
            />
            <StyledInput
                label="Username"
                matchType="username"
                placeholder="Username"
                checkValue={doInputValueCheck}
                handleInvalidValue={handleInvalidValue}
                onChangeText={userName => setUserName(userName)} 
                value={userName}
                icon="tag"
            />
            <View style={{alignItems: 'center'}}>
                {!!error &&
                <Text style={[styles.error, {margin: 20}]}>
                    Registration failed [{error.code}]
                </Text>
                }
                <View style={{width: 170}}>
                    <SolidButton
                        style={styles.buttonSolid} 
                        onPress={() => setDoInputValueCheck(doInputValueCheck + 1)} 
                        title="Register" 
                    />
                    <TransparentButton
                        onPress={() => navigation.navigate('Login')} 
                        title="Back to Login" 
                    />
                </View>
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
        </ImageBackground>
        </View>
    </>
    );
}