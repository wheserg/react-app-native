import React , {useState,useEffect} from 'react';
import { AppRegistry, ScrollView, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import Login from './src/components/Login'
import Dashboard  from './src/components/Dashboard';
import { NativeRouter, Route, Link } from "react-router-native";

import { configureFonts, DefaultTheme } from 'react-native-paper';

export default function App() {
  const [tokenSecure,setTokenSecure] = useState('')
  const fontConfig = {
    default: {
      regular: {
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'sans-serif-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'sans-serif-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'sans-serif-thin',
        fontWeight: 'normal',
      },
    }
  };
  const theme = {
    ...DefaultTheme,
    fontFamily:{...DefaultTheme.fonts.regular.fontFamily = 'sans-serif-medium'}
  }
  const setToken = (token) => {
    console.log('SETEANDO TOKEN')
    setTokenSecure(token);
  }

  return (
    <NativeRouter>
      <PaperProvider theme={theme}>
        <ScrollView>
          <View>
            <Route exact path="/" component={() => <Login setToken={setToken} /> } />
            <Route exact path="/dashboard" component={() => <Dashboard token={tokenSecure}/> } />
          </View>
   
        </ScrollView>
      </PaperProvider>
    </NativeRouter>

  );
}