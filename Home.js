import React, { useState } from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import * as db from './Database';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';

export const Frontpage = ({ navigation }) => {
  
  const logOut = () => {
    db.logOut()
    navigation.popToTop()
    console.log(db.auth.currentUser)
  }

  return (
      <View>
          <Text>Welcome to Mobile Inventory</Text>
          <Button onPress={() => logOut()} title="Log out" />
      </View>
  )
}

export const Login = ( { navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    db.auth.onAuthStateChanged(function(user) {
      if (user) {
        navigation.navigate('Frontpage')
      }
    })

    return (
        <View>
            <Text>Email</Text>
            <Input 
              placeholder="email@example.com"
              onChangeText={email => setEmail(email)}
              value={email}
              leftIcon={
                <Icon name='user' size={22} color='#757575' />
              }
              />
            <Text>Password</Text>
            <Input
              placeholder="Password" 
              secureTextEntry={true} 
              onChangeText={password => setPassword(password)} 
              value={password}
              leftIcon={
                <Icon name='lock' size={22} color='#757575' />
              }
            />
            <Text style={styles.error}>{loginError}</Text>
            <Button onPress={() => db.logIn(email, password)} title="Log in" />

            <Text>No account?</Text>
            <Button onPress={() => navigation.navigate('Registration')} title="Register now" />
        </View>
    );
}

export const Registration = ( { navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const register = () => {
    if(db.registerAccount(email, password)) {
      setRegistrationError('')
      navigation.navigate('Frontpage')
    }
  }

  return (
      <View>
          <Text>Email</Text>
          <Input 
            placeholder="email@example.com"
            onChangeText={email => setEmail(email)} 
            value={email}
            leftIcon={
              <Icon name='user' size={22} color='#757575' />
            }
          />
          <Text>Password</Text>
          <Input
            placeholder="Password" 
            secureTextEntry={true} 
            onChangeText={password => setPassword(password)} 
            value={password}
            leftIcon={
              <Icon name='lock' size={22} color='#757575' />
            }
          />
          <Button onPress={() => register()} title="Register" />
          <Text>Already have an account?</Text>
          <Button onPress={() => navigation.navigate('Login')} title="Log in" />
      </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    error: {
      color: 'red'
    }
  });