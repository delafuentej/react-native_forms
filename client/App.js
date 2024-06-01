import { StatusBar } from 'expo-status-bar';
import useFormal from '@kevinwolf/formal-native';
import React from 'react';
import { StyleSheet, View, Alert, SafeAreaView} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import * as yup from 'yup';


const schema= yup.object().shape({

    Username:yup
      .string() // check if it a string
      .required(),  //mandatory field
  
    Email: yup
      .string()
      .email('Invalid Email Address') //check if  it is a valid mail
      .required(),
    
    Password: yup
      .string()
      .min(8) //min lenght caract.
      .max(32) //max. lenght 32 carac
      .required(),
    
    'Confirm Password': yup
      .string()
      .oneOf([yup.ref('Password'), null], 'Password do not match') // check if it matches with 'Password' or is null
      .required(),
      
  })


const initialValues = {
  Username: '',
  Email:'',
  Password:'',
  'Confirm Password': '',
};


const Field=({placeholder, error,...props})=>(

      <>
      <Text style={styles.space}>{placeholder}</Text>
      <Input {...props}/>
      {error && (
          <Text style={[styles.space, error && styles.error]}>{error}</Text>
      )}
  
      </>
  
    );

  const URI= process.env.URI;

export default function App() {
  //useFormal hook wich takes in initialValues and a config object(wich contains the initial schema, wich makes sure the data that we have conforms with the schema)
  // to send a POST request from de client side => server-side validation
  const formal = useFormal(
    initialValues,
    {schema,
    onSubmit: (values) => {
      const username= values['Username']
      const email= values['Email']
      const password= values['Password']
      const confirmPassword= values['Confirm Password']
      fetch(URI, {
        method: 'POST',
        headers:{
          Accept:'application/json',
          'Content Type':'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword}),
      })
      .then(res => res.json())
      //validation succesfully=> it alerts the data
      .then( data =>{
        Alert.alert(JSON.stringify(data));
      })
      //validation unsuccesfull<=> it alerts the error
      .catch( error =>{
        Alert.alert(JSON.stringify(error));
      })
    },
});



  return (
    //SafeAreaView => makes sure our content renders within the safe area boundaries of a device
    <SafeAreaView style={styles.container}>
      <View style={styles.space}>
        <Text h1>Formal</Text>


          <Field {...formal.getFieldProps('Username')} placeholder='Username' />
          <Field {...formal.getFieldProps('Email')} placeholder='Email' />
          <Field 
            {...formal.getFieldProps('Password')}
            placeholder='Password'
            secureTextEntry
          />

          <Field 
            {...formal.getFieldProps('Confirm Password')}
            placeholder='Confirm Password'
            secureTextEntry
          />

        <Button
          title='Submit'
          style={styles.space}
          // {...formal. getSubmitButtonProps()} =>this submet all the values stored in formal to the onSubmit method in useFormal hook config
          //Only after pressing this button are the error messages show an the schema validated
          {...formal.getSubmitButtonProps()}
          disabled={false}
        />


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  space: {
      margin:10,
  },
  error:{
    color:'red',
  },
});
