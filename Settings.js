import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, Switch } from 'react-native';
import * as db from './Database';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { SolidButton } from './components/SolidButton';
import { styles } from './Styles';
import { ThemeContext } from './App';
import { useTheme } from '@react-navigation/native';

export const SettingsScreen = ({ navigation }) => {
    const {theme, setTheme} = useContext(ThemeContext);
    const [settingChangedTimestamp, setSettingChangedTimestamp] = useState({});
    const colors = useTheme().colors;

    const changeTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
      db.changeUserSettings({theme: theme})
    }

    const changeSetting = (setting) => {
      let changedSettings = {};

      // Add 5 sec cooldown to prevent spamming 
      if((Date.now() - settingChangedTimestamp[setting]) < 5000)
        return;

      switch (setting) {
        case "theme":
          let newTheme = theme === 'light' ? 'dark' : 'light'
          setTheme(newTheme)
          changedSettings = {...changedSettings, theme: newTheme}
          setSettingChangedTimestamp({...settingChangedTimestamp, theme: Date.now()})
          break;
        default:
          break;
      }

      console.log(changedSettings)
      if(changedSettings) db.changeUserSettings(changedSettings)
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <View style={{alignItems: 'center'}}>
            <View style={{width: 170}}>
              <Text style={[{color: colors.text}, styles.buttonLabel ]}>
                Settings
              </Text>
              <SolidButton
                color="primary"
                onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                title="Save changes" 
              />
              <Text style={{color: colors.text}}>Dark theme</Text>
              <Switch
                value={theme === 'dark' ? true : false}
                onValueChange={() => changeSetting("theme")}
              />
            </View>
          </View>
        </View>
      </View>
    )
}