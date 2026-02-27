import './global.css';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store }                              from './store/Index';
import { restoreSession }                     from './store/AuthSlice';
import { setFavorites }                       from './store/FavoritesSlice';
import AsyncStorage                           from '@react-native-async-storage/async-storage';
import { NavigationContainer, DarkTheme }     from '@react-navigation/native';
import { createNativeStackNavigator }         from '@react-navigation/native-stack';
import { createBottomTabNavigator }           from '@react-navigation/bottom-tabs';
import { Ionicons }                           from '@expo/vector-icons';

import LoginScreen      from './screens/Login';
import HomeScreen       from './screens/HomeScreen';
import ProductScreen    from './screens/ProductScreen';
import FavouritesScreen from './screens/FavouritesScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary:      '#3b82f6',
    background:   '#050d1a',
    card:         '#080f1e',
    text:         '#f1f5f9',
    border:       '#0f2044',
    notification: '#3b82f6',
  },
};

// ─── Splash while restoring session ──────────────────────────────────────────
const SplashScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#050d1a', alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator size="large" color="#3b82f6" />
  </View>
);

// ─── Tab icon ─────────────────────────────────────────────────────────────────
const TAB_ICONS = {
  Home:       { active: 'grid',  inactive: 'grid-outline'  },
  Favourites: { active: 'heart', inactive: 'heart-outline' },
};
const TAB_LABELS = { Home: 'Catalog', Favourites: 'Saved' };

function TabIcon({ routeName, focused, color }) {
  const icons   = TAB_ICONS[routeName] ?? { active: 'help-circle', inactive: 'help-circle-outline' };
  const isHeart = routeName === 'Favourites';
  return (
    <View style={{
      width: 46, height: 46, borderRadius: 23,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: focused
        ? (isHeart ? 'rgba(239,68,68,0.14)' : 'rgba(37,99,235,0.18)')
        : 'transparent',
      borderWidth: focused ? 1 : 0,
      borderColor:  focused
        ? (isHeart ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.35)')
        : 'transparent',
    }}>
      <Ionicons name={focused ? icons.active : icons.inactive} size={21} color={color} />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:             false,
        tabBarShowLabel:         true,
        tabBarActiveTintColor:   route.name === 'Favourites' ? '#ef4444' : '#3b82f6',
        tabBarInactiveTintColor: '#334155',
        tabBarStyle: {
          position: 'absolute', bottom: 28, left: 28, right: 28,
          borderRadius: 30, height: 72,
          paddingBottom: 0, paddingTop: 0, marginBottom: 25,
          backgroundColor: '#080f1e',
          borderWidth: 1.5, borderColor: '#0f2044',
          shadowColor: '#000', shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.55, shadowRadius: 28, elevation: 24,
          borderTopWidth: 0,
        },
        tabBarItemStyle:  { paddingVertical: 10, borderRadius: 24 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 2 },
        tabBarIcon: ({ focused, color }) => <TabIcon routeName={route.name} focused={focused} color={color} />,
      })}
    >
      <Tab.Screen name="Home"       component={HomeScreen}       options={{ title: TAB_LABELS.Home       }} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} options={{ title: TAB_LABELS.Favourites }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#050d1a' }, animation: 'slide_from_right' }}>
      <Stack.Screen name="MainTabs"      component={MainTabs}     />
      <Stack.Screen name="ProductDetail" component={ProductScreen} />
    </Stack.Navigator>
  );
}

// ─── Root: restores session then routes based on isLoggedIn ──────────────────
function RootNavigator() {
  const dispatch   = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const hydrated   = useSelector((state) => state.auth.hydrated);

  useEffect(() => {
    const bootstrap = async () => {
      // restore favorites
      try {
        const saved = await AsyncStorage.getItem('favorites');
        if (saved) dispatch(setFavorites(JSON.parse(saved)));
      } catch {}

      // restore auth session
      dispatch(restoreSession());
    };
    bootstrap();
  }, []);

  // Show splash until session check is done
  if (!hydrated) return <SplashScreen />;

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#050d1a' } }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainStack" component={MainStack}   options={{ animation: 'fade' }} />
        ) : (
          <Stack.Screen name="Login"     component={LoginScreen} options={{ animation: 'fade' }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}