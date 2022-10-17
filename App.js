import React, { useEffect, useState, createContext, useMemo, useContext } from 'react';
import { useColorScheme, Appearance, Image,Text } from 'react-native';
import { LoginScreen } from './Login';
import { RegistrationScreen } from './Registration';
import { Frontpage } from './Home';
import { AddInventory } from './AddInventory';
import { AddItem } from './AddItem';
import { SettingsScreen, Settings } from './Settings';
import { EditProfile } from './EditProfile';
import { LoadingScreen } from './Misc';
import { NavigationContainer, StackActions, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { database, auth } from './Database';
import { ref, get, onValue} from "firebase/database";
import { BarcodeScanner } from './BarcodeScanner';
import { ItemList } from './ItemList';
import { InventoryList } from './InventoryList';
import { InventoryAppLight, InventoryAppDark } from './Themes';
import { colors } from 'react-native-elements';
import { ThemeContext, UserContext } from './AppContext'; 
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Logo } from './components/Logo';

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const NavigatorStyles = {
    headerMode: 'screen',
    headerTintColor: 'white',
}

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={() => ({
        headerTitle: () => <Logo />,
        headerTitleAlign: 'center',
      })}
    >
        <AuthStack.Screen name="Login" component={LoginScreen} 
          options={() => ({title: "Welcome!"})}
        />
        <AuthStack.Screen name="Registration" component={RegistrationScreen} />
    </AuthStack.Navigator>
  )
}

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={() => ({
        headerTitle: () => <Logo />,
        headerTitleAlign: 'center',
      })}
    >
        <HomeStack.Screen name="Frontpage" component={Frontpage}/>
        <HomeStack.Screen name="Settings" component={SettingsScreen} />
        <HomeStack.Screen name="Edit Profile" component={EditProfile} />
    </HomeStack.Navigator>
  )
}

const ItemsNavigator = () => {
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen name="Inventories" component={InventoryList} />
      <ItemsStack.Screen name="New Inventory" component={AddInventory} />
      <ItemsStack.Screen name="Item List" component={ItemList} 
        options={({ route }) => ({ 
          title: route.params.inventory.name ?? "Inventory",
          headerStyle: {
            backgroundColor: route.params.inventory.color,
          },
          headerTintColor: route.params.inventory.color ? "white" : colors.text
        })} 
      />
      <ItemsStack.Screen name="Add Item" component={AddItem} 
        options={({ route }) => ({ 
          title: route.params.edit ? "Edit Item Information" : "Add Item",
          headerStyle: {
            backgroundColor: route.params.color
          },
        })} 
      />
      <ItemsStack.Screen name="Barcode Scanner" component={BarcodeScanner} />
    </ItemsStack.Navigator>
  )
}

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [theme, setTheme] = useState(null);
  const [user, setUser] = useState(null);
  const themeData = { theme, setTheme };
  const userData = { user, setUser };
  
  // Get auth status from firebase
  auth.onAuthStateChanged((authUser) => {
      if(!user && authUser) {
          // User is signed in, set user info
          if(!user) setUser(authUser)

          if(!initialized) {
            // Get user data with listener
            onValue(ref(
                database, 'users/' + authUser.uid + '/userdata'
            ), (snapshot) => {
                const data = snapshot.val();
                if(data) {
                  setUser({...authUser, ...data})
                  if(data.theme) setTheme(data.theme)
                }
                setInitialized(true)
            })
          }
      } else if(!authUser) {
          setTheme("light")
          setUser(null)
          setInitialized(true)
      }
  });

  if(!initialized) {
      return <LoadingScreen />
  }

  return(
    <ThemeContext.Provider value={themeData}>
      <NavigationContainer theme={theme === 'dark' ? InventoryAppDark : InventoryAppLight}>
        {!auth?.currentUser && initialized ? (
          <AuthNavigator
            theme={InventoryAppLight}
            screenOptions={({ route }) => ({
              ...NavigatorStyles,
            })}
          />
        ) : (
          <UserContext.Provider value={userData}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                ...NavigatorStyles,
                headerShown: false,
                /*headerStyle: { backgroundColor: '#168CAD' },*/
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = 'home-outline';
                  } else if (route.name === 'Items') {
                    iconName = 'reorder-four-outline';
                  } return <Ionicons name={iconName} size={size} color={color} />;  
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeNavigator} />
              <Tab.Screen name="Items" component={ItemsNavigator} />
            </Tab.Navigator>
          </UserContext.Provider>
        )}
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}