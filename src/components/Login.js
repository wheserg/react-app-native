import React , {useState,useEffect} from 'react';
import { View, ScrollView, StyleSheet } from 'react-native'
import { useHistory  } from "react-router-native";

import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  List,
  HelperText,
  Button,
} from 'react-native-paper';


import { TextInput } from 'react-native-paper';
import { style } from 'styled-system';
import { useForm } from "react-hook-form";
import Api from '../api/api'
export default function Login(props) {
  
  const { register, handleSubmit, errors, setValue, formState } = useForm({ defaultValues : {email:'', password:''}});



  const patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  const [emailTouch,setEmailTouch] = useState(false)
  const [passwordTouch,setPasswordTouch] = useState(false)
  const [visible, setVisible] = React.useState(false);

  let history = useHistory();
  const [email,setEmail] = useState('')
  const [loading,setLoading] = useState(false)
  const [password,setPassword] = useState('')
  const [myState, setState] = useState({
      loading: false,
      redirect:null

  });
  const actualizaEstado = estado => {
      setState(Object.assign({}, myState, estado));
  };
  const handleSubmitLog = async values => {
      setLoading(true)
      
        const headers = {
            'app':'APP_BCK',
            'Accept':'application/json',
            'password':values.password,
            'Content-Type': 'application/json'
        }
        Api.put(`/TutenREST/rest/user/testapis%40tuten.cl?email=${values.email}`, null, {
            headers: headers
            })
            .then((res) => {
                setLoading(false)
                props.setToken(res.data.sessionTokenBck)
                history.push('dashboard')

            }).catch((res) => {
              setLoading(false)

            })
        
    }
    const isEmpty = (obj) => {
      if(obj){
        return Object.keys(obj).length === 0;
      }
  }

    useEffect(() => {
      let isMounted = true;
      if (isMounted) {
          register(
              { name: "email"}, 
              { required: { value: true, message: 'Correo requerido'}, 
              pattern: { value: patternEmail, message: 'Correo inválido'} });
          register(
              { name: "password"}, 
              { required: { value: true, message: 'Password requerido'} });
      }
  
      return () => { isMounted = false };
    }, [register]);

  return (

    <ScrollView>
        <View style={styles.drawerContent }>
          
            <Text style={styles.title}>Iniciar Sesion</Text>
            <TextInput
            style={{width:'100%'}}
            label="Email"
            onChange={(e) => {
              setEmailTouch(true)
              setValue("email", e.nativeEvent.text, true)}}
            />
             {isEmpty(errors.email) === undefined ?
              false:
              
              <HelperText type="error" style={{color:'red', fontSize:15}}visible={isEmpty(errors.email) === undefined ? false:true}>
              Email Invalido!
             </HelperText>
             }
            
            <TextInput
            style={{width:'100%'}}
            secureTextEntry={true}
            label="Password"
            onChange={(e) => {
               setPasswordTouch(true)
               setValue("password", e.nativeEvent.text, true)}}
             />

            {isEmpty(errors.password) === undefined ?
              false:
              
              <HelperText type="error" style={{color:'red', fontSize:15}}visible={isEmpty(errors.password) === undefined ? false:true}>
              Password Requerido!
             </HelperText>
             }
            

            <Button 
            style={styles.buttons}
            disabled={loading ? true:false}
            mode="contained" 
            onPress={handleSubmit(handleSubmitLog)}>
              {loading? <Text style={{color:'white'}}>Espere</Text>:<Text style={{color:'white',fontSize:15}}>Ingresar</Text>}
            </Button>
        </View>

    </ScrollView>
 

  );
}
const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      marginLeft:5,
      marginRight:5,
      marginTop:160,
      justifyContent:'center',
      alignItems:'center'
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      marginTop: 20,
      marginBottom:50,
      fontSize:25,
      fontWeight: 'bold',
    },  
    buttons:{
        marginTop:10,
        width:'100%'
    },



    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
  

