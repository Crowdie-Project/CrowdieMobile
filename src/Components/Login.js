import React, { useRef, useState } from "react";
import {View, Text,TextInput, Button, StyleSheet, ScrollView, Alert, Modal, Pressable} from 'react-native';
import {supabase} from './Supabase.js';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState('')
  
    const handleLogin = async (type: string, email: string, password: string) => {
      setLoading(type)
      const { error, user } =
        type === 'LOGIN'
          ? await supabase.auth.signIn({ email, password })
          : await supabase.auth.signUp({ email, password })
      if (!error && !user) Alert.alert('Check your email for the login link!')
      if (error) Alert.alert(error.message)
      setLoading('')
    }

    const handleOAuthLogin = async (provider) => {
        // You need to enable the third party auth you want in Authentication > Settings
        // Read more on: https://supabase.io/docs/guides/auth#third-party-logins
        let { error } = await supabase.auth.signIn({ provider });
        if (error) console.log("Error: ", error.message);
    };

    const forgotPassword = async (e) => {
        // Read more on https://supabase.io/docs/client/reset-password-email#notes
        e.preventDefault();
        const email = prompt("Please enter your email:");

        if (email === null || email === "") {
            setHelperText({ error: true, text: "You must enter your email." });
        } else {
            let { error } = await supabase.auth.api.resetPasswordForEmail(
                email
            );
            if (error) {
                console.error("Error: ", error.message);
            } else {
                setHelperText({
                    error: false,
                    text: "Password recovery email has been sent.",
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Login
            </Text>
          <View>
          <Text style={styles.textStyle}>*Email:</Text>
          <TextInput
           onChangeText={text => setEmail(text)}
          style={styles.input}/>
          </View>
           <View>
           <Text style={styles.textStyle}>*Password:</Text>
            <TextInput
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
             style={styles.input}
                />
           </View>
         
            <View>
                    <Pressable
                    style={styles.button}
                    title="Sign up"
                    disabled={!!loading.length}
                    loading={loading === 'SIGNUP'}
                    onPress={() => handleLogin('SIGNUP', email, password)}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                    </Pressable>
                
                    <Pressable
                    style={styles.button}
                      title="Sign in"
                      disabled={!!loading.length}
                      loading={loading === 'LOGIN'}
                      onPress={() => handleLogin('LOGIN', email, password)}
                    >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
             
            </View>
            {/* <View>
             <Text>Or continue with</Text>
          

                <View>
                    
                            <Pressable
                             style={styles.button}
                             onPress={() => handleOAuthLogin("github")}
                                type="button">
                             <Text>GitHub</Text>   
                            </Pressable>
                 
                
                            <Pressable
                             style={styles.button}
                             onPress={() => handleOAuthLogin("google")}
                                type="button" >
                                <Text>Google</Text>
                            </Pressable>
                     
                </View>
            </View> */}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D1D1D1',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: "center"
      },
    input: {
      marginBottom: 20,
      fontSize: 16,
      height: 30,
      paddingHorizontal: 5,
      backgroundColor: '#EDEDED'
    },
  
    button: {
      padding: 5,
      elevation: 2,
      backgroundColor: "#008000",
      textAlign: 'center',
      marginVertical: 10,
      width: 100
    },
   
    textStyle: {
      color: "#000",
      fontWeight: "bold",
      fontSize: 16
    },
    buttonText: {
        color: "#fff",
        fontSize: 16
    }
  
    });

export default Login;