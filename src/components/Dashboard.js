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
  Divider,
  Button,
  DataTable
} from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { style } from 'styled-system';
import { useForm } from "react-hook-form";
import Api from '../api/api'
import moment from 'moment'
import DropDown from "react-native-paper-dropdown";

export default function Dashboard(props) {
  

  let history = useHistory();
  const [data,setData] = useState([])
  const [dataAux,setDataAux] = useState([])
  const [loading,setLoading] = useState(false)
  const [password,setPassword] = useState('')

  const [showDropDown, setShowDropDown] = useState(false);
  const [showDropDownFilter, setShowDropDownFilter] = useState(false);

  const [campo,setCampo] = useState('')
  const [campoBusqueda,setCampoBusqueda] = useState('')

  const [filtro,setFiltro] = useState('')
  const [filtroBusqueda,setFiltroBusqueda] = useState('')

  const [busqueda,setBusqueda] = useState(null)

  const campoList = [
    {label:'Seleccionar campo', value:''},
    {label:'BookingId' ,value:'1_Bookingid_1'},
    {label:'BookingPrice' ,value:'1_BookingPrice_2'},
  ]
  const filtroList = [
    {label:'Seleccionar filtro', value:''},
    {label:'Igual' ,value:'2_1'},
    {label:'Mayor o igual' ,value:'2_2'},
    {label:'Menor o igual' ,value:'2_3'},
  ]


  const actualizaEstado = estado => {
      setState(Object.assign({}, myState, estado));
  };

  const resetFilter = (fase) => {
        setCampo('')
        setCampoBusqueda('')
        setBusqueda('')
        setFiltro('')
        setFiltroBusqueda('')
  }

  useEffect(() => {
      fetchBookingData()
  },[])
  const fetchBookingData = async () => {
      setLoading(true);
      const headers = {
          'adminemail': 'testapis@tuten.cl',
          'app':'APP_BCK',
          'token':props.token,
          'Accept': 'application/json',
      }
      Api.get(`/TutenREST/rest/user/contacto%40tuten.cl/bookings?current=true&email=contacto@tuten.cl`, {
          headers: headers
          })
          .then((response) => {
            let userData = []
            
              response.data.map((val,ind) => {
                userData.push({
                  bookingId:val.bookingId,
                  firstName:val.tutenUserClient.firstName,
                  lastName:val.tutenUserClient.lastName,
                  bookingTime:val.bookingTime,
                  streetAddress:val.locationId.streetAddress,
                  bookingPrice:val.bookingPrice
                })
              })
              setData({userData});
              setDataAux({userData});
              setLoading(false);
          }).catch((error) => {
              setLoading(false);
          });
  }

  const handleBusqueda = () => {
    //limpiar campos
      let campoFiltrar = campo.split('_')[1];
      let campoNombre = campo.split('_')[2];
      let userData = []
      let filtroSeleccionado = filtro.split('_')[1]
      if(filtroSeleccionado == '1'){//igual
        data.userData.map((value,index) => {
          if(campoFiltrar == 'BookingPrice'){
    
            if(parseInt(busqueda) == parseInt(value.bookingPrice)){

              userData.push(value);
            }
          }else if(campoFiltrar == 'BookingId'){
            if(parseInt(busqueda) == parseInt(value.bookingId)){
              userData.push(value);
            }
          }
        })
      
         setDataAux({userData});

        
      }else if(filtroSeleccionado == '2'){//mayor o igual
        data.userData.map((value,index) => {
          if(campoFiltrar == 'BookingPrice'){
            if(busqueda <= value.bookingPrice){
              userData.push(value);
            }
          }else if(campoFiltrar == 'BookingId'){
            if(parseInt(busqueda) <= parseInt(value.bookingId)){
              userData.push(value);
            }
          }
        })
        setDataAux({userData});

      }else if(filtroSeleccionado == '3'){//menor o igual
        data.userData.map((value,index) => {
          if(campoFiltrar == 'BookingPrice'){
            if(parseInt(busqueda) >= parseInt(value.bookingPrice)){
              userData.push(value);
            }
          }else if(campoFiltrar == 'BookingId'){
            if(parseInt(busqueda) >= parseInt(value.bookingId)){
              userData.push(value);
            }
          }
        })
         setDataAux({userData});

      }
  }

  return (

    <ScrollView>

        <View style={styles.drawerContent }>
            <Text style={styles.title}>Bienvenido... </Text>

            <DropDown
              label={"Seleccionar campo"}
  
              mode={"outlined"}
              style={{flex:1,width:'100%'}}
              list={campoList}
              value={campo}
              setValue={setCampo}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              inputProps={{
                right: <TextInput.Icon name={"menu-down"} />,
              }}
            />
            <DropDown
              label={"Seleccionar Filtro"}
              placeholder={"Seleccionar filtro"}
              mode={"outlined"}
              disabled={campo === '' ? true:false}
              style={{flex:1,width:'100%'}}
              list={filtroList}
              value={filtro}
              setValue={setFiltro}
              visible={showDropDownFilter}
              showDropDown={() => {
                if(campo !== ''){
                  setShowDropDownFilter(true)

                }else{
                  console.log('mostrar toast')
                }
              
              }}
              onDismiss={() => setShowDropDownFilter(false)}
              inputProps={{
                right: <TextInput.Icon name={"menu-down"} />,
              }}
            />
            <TextInput
            style={{width:'100%',marginTop:15}}
            label="Busqueda"
            mode={"outlined"}

            value={busqueda}
            disabled={campo === '' || filtro === ''? true:false}
            onChangeText={text => setBusqueda(text)}
            />
             
            <Button 
              style={styles.buttons}
              color={'#2C3E50'}
              disabled={campo === '' || filtro === '' || busqueda === '' ? true : false}
              mode="contained" 
              onPress={ () => handleBusqueda()}>
                  {loading? <Text style={{color:'white'}}>Espere</Text>:<Text style={{color:'white',fontSize:15}}>Buscar</Text>}
            </Button>
            <Button 
              style={styles.buttonsClear}
              color={'#9B59B6'}
              mode="contained" 
              onPress={ () => resetFilter()}>
                  {loading? <Text style={{color:'white'}}>Espere</Text>:<Text style={{color:'white',fontSize:15}}>Limpiar</Text>}
            </Button>
            <Divider />
            <DataTable style={{marginTop:10}}>
                <DataTable.Header>
                  <DataTable.Title numeric>BookingId</DataTable.Title>
                  <DataTable.Title >Cliente</DataTable.Title>
                  <DataTable.Title >Fecha de Creación</DataTable.Title>
                  <DataTable.Title >Dirección</DataTable.Title>
                  <DataTable.Title numeric>Precio</DataTable.Title>
                </DataTable.Header>
                {data.userData && dataAux.userData && data.userData.length > 0 ?
                  data.userData.length === dataAux.userData.length ?
                  data.userData.map((val,index) => {
                    let timestamp = val.bookingTime
                    let date = new Date(timestamp);
          
                    return(
                    <DataTable.Row  key={`key_${index}`}>
                        <DataTable.Cell numeric>{val.bookingId}</DataTable.Cell>
                        <DataTable.Cell >{`${val.lastName}, ${val.firstName}`}</DataTable.Cell>
                        <DataTable.Cell >{moment(date).format('DD-MM-YYYY HH:MM:SS')}</DataTable.Cell>
                        <DataTable.Cell >{val.streetAddress}</DataTable.Cell>
                        <DataTable.Cell numeric>{val.bookingPrice}</DataTable.Cell>
                    </DataTable.Row>


                    )
                  })
                  
                :

                  dataAux.userData && dataAux.userData.map((val,index) => {
                    let timestamp = val.bookingTime
                    let date = new Date(timestamp);

                    return(
                    <DataTable.Row key={`key_${index}`}>
                        <DataTable.Cell numeric>{val.bookingId}</DataTable.Cell>
                        <DataTable.Cell >{`${val.lastName}, ${val.firstName}`}</DataTable.Cell>
                        <DataTable.Cell >{moment(date).format('DD-MM-YYYY HH:MM:SS')}</DataTable.Cell>
                        <DataTable.Cell >{val.streetAddress}</DataTable.Cell>
                        <DataTable.Cell numeric>{val.bookingPrice}</DataTable.Cell>
                    </DataTable.Row>


                    )
                  })
                  
                  
                :null
                }

            </DataTable>

        </View>
  
    </ScrollView>
 

  );
}
const styles = StyleSheet.create({
    drawerContent: {
      marginLeft:5,
      marginRight:5,
      marginTop:30,

    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      marginTop:30,
      marginBottom:30,
      fontSize:25,
      fontWeight: 'bold',
    },  
    buttons:{
        marginTop:30,
        width:'100%'
    },
    buttonsClear:{
      marginTop:10,
      width:'100%',
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
  

