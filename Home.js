import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView } from 'react-native';
import { database, auth } from './Database';
import { logIn, logOut, registerAccount } from './database_functions/UserAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';

export const Frontpage = ({ navigation }) => {
  const colors = useTheme().colors;

  const logOut = () => {
      logOut()
  }

  return (
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <View style={{alignItems: 'center'}}>
            <View style={{width: 170}}>
              <Text style={[styles.buttonLabel, {color: colors.text}]}>
                Welcome to Mobile Inventory!
                You have a total of 0 items
                in 0 collections
              </Text>
              <SolidButton 
                onPress={() => navigation.navigate('Settings')} 
                title="Settings"
              />
              <SolidButton 
                onPress={() => logOut()} 
                title="Log out" 
              />
            </View>
          </View>
        </View>
      </View>
  )
}

export const Login = ({ navigation }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const logIn = () => {
    setLoginError('')
    logIn(email, password)
    .then(result => {
    })
    .catch(e => setLoginError(e))
  }

  return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inputBox}>
          <Text>Email</Text>
          <Input 
            style={styles.input}
            placeholder="email@example.com"
            onChangeText={email => setEmail(email)}
            value={email}
            leftIcon={
              <Icon name='user' size={22} color='#757575' />
            }
          />
          <Text>Password</Text>
          <Input
            style={styles.input}
            placeholder="Password" 
            secureTextEntry={true} 
            onChangeText={password => setPassword(password)} 
            value={password}
            leftIcon={
              <Icon name='lock' size={22} color='#757575' />
            }
          />
          <View style={{alignItems: 'center'}}>
            {!!loginError &&
            <Text 
              style={[styles.error, {margin: 20}]}
            >
              Login failed [{loginError}]
            </Text>
            }
            <View style={{width: 170}}>
              <Button
                onPress={() => logIn()} 
                title="Log in" 
              />
              <Text style={styles.buttonLabel}>No account?</Text>
              <Button 
                style={styles.buttonSolid} 
                onPress={() => navigation.navigate('Registration')} 
                title="Register now" 
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
  );
}

export const Registration = ( { navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [userName, setUserName] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const register = () => {
    setRegistrationError('')
    if(password === passwordConfirmation) {
      registerAccount(email, password)
      .then(result => {
      })
      .catch(e => setRegistrationError(e))
    } else {
      setRegistrationError('Passwords do not match')
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputBox}>
          <Text>Email</Text>
          <Input 
            style={styles.input}
            placeholder="email@example.com"
            onChangeText={email => setEmail(email)} 
            value={email}
            leftIcon={
              <Icon name='user' size={22} color='#757575' />
            }
          />
          <Text>Password</Text>
          <Input
            style={styles.input}
            placeholder="Password" 
            secureTextEntry={true} 
            onChangeText={password => setPassword(password)} 
            value={password}
            leftIcon={
              <Icon name='lock' size={22} color='#757575' />
            }
          />
          <Text>Retype Password</Text>
          <Input
            style={styles.input}
            placeholder="Type password again" 
            secureTextEntry={true} 
            onChangeText={passwordConfirmation => setPasswordConfirmation(passwordConfirmation)} 
            value={passwordConfirmation}
            leftIcon={
              <Icon name='lock' size={22} color='#757575' />
            }
          />
          <Text>Username</Text>
          <Input
            style={styles.input}
            placeholder="Username"
            onChangeText={userName => setUserName(userName)} 
            value={userName}
            leftIcon={
              <Icon name='tag' size={22} color='#757575' />
            }
          />
          <View style={{alignItems: 'center'}}>
            {!!registrationError &&
              <Text style={[styles.error, {margin: 20}]}>
                Registration failed [{registrationError}]
              </Text>
            }
            <View style={{width: 170}}>
              <Button
                style={styles.buttonSolid} 
                onPress={() => register()} 
                title="Register" 
              />
              <Text style={styles.buttonLabel}>Already have an account?</Text>
              <Button 
                style={styles.buttonSolid} 
                onPress={() => navigation.navigate('Login')} 
                title="Log in" 
              />
            </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    row: {
      flexWrap: 'wrap',
      flexDirection: "row",
    },
    error: {
      color: 'red'
    },
    buttonSolid: {
      width: 50,
    },
    inputBox: {
      margin: 20,
      width: 400,
    },
    input: {
      padding: 10,
    },
    buttonLabel: {
      marginBottom: 5, 
      marginTop: 15
    }
  });