import React, { useState, useEffect } from "react";

import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import FontAwesome from '@expo/vector-icons/FontAwesome';


const { width, height } = Dimensions.get("window");

const AddTodos = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const navigation = useNavigation();

  const GoBack = () => {
    navigation.navigate("TaskListScreen");
  };




  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "🚫  Failed",
        text2: error,
        position: "top",
        visibilityTime: 4000,
        topOffset: 40,
      });
      setError('')
    }
  }, [error]);


  useEffect(() => {
    if (message) {
      Toast.show({
        type: "success",
        text1: "✅ Successful",
        text2: message,
        position: "top",
        visibilityTime: 3000,
        topOffset: 40,
      });
  
      setTitle('')
      setDescription('')
      setMessage('')
    }
  }, [message]);



// this function handles the creation of new todos and
// saving them in Async storage as well

  const HandleSubmit = async () => {
    if (!title.trim()) {
      setError('Todo Title is Required');
      return;
    }

    try {
      const newTodo = {
        id: Date.now().toString(), 
        title,
        description,
        completed: false,
      };

      // here, i am trying to get existing todos 
      // and i had to parse it because Async storage only stores strings, just to convert it into an array
      const storedTodos = await AsyncStorage.getItem('@todos');
      const todos = storedTodos ? JSON.parse(storedTodos) : [];

      // with the array method Push(), i just add the new todo to the array.
      todos.push(newTodo);

      // here, i am saving updated todos
      await AsyncStorage.setItem('@todos', JSON.stringify(todos));

      setMessage('Todo Added Successfully!');
    } catch (err) {
      setError('Failed to save todo');
      console.log(err);
    }
  };









  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={GoBack}>
          <AntDesign
            name="arrow-left"
            size={30}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>

        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.title}>Add Todo</Text>
        </View>
      </View>


      <View style={[styles.inputWrapper,{marginTop:height * 0.04}]}>

        <Text style={styles.subtitle}>Todo Title</Text>

        <TextInput
          placeholder="eg. email back Mrs James"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

          {title &&
              <TouchableOpacity style={styles.cancleIcon} onPress={() => setTitle('')} >
                <MaterialIcons name="cancel" size={24} color="black" />
             
              </TouchableOpacity>}

      </View>






      <View style={styles.inputWrapper}>
     <Text style={styles.subtitle}>Todo Description (optional)</Text>

        <TextInput
          placeholder="eg. email back Mrs. james for the new intern we have...."
          placeholderTextColor="#aaa"
          style={styles.textarea}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>


          <View style={styles.btnContainer}>
                 <TouchableOpacity activeOpacity={0.6}  style={styles.button} onPress={HandleSubmit} >
                 <Text style={styles.buttonText}>Add Todo</Text>
            
          </TouchableOpacity>

          </View>
     




      <Toast />



           <TouchableOpacity
        style={styles.mic}
      >
        <FontAwesome name="microphone" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputWrapper: {
    paddingHorizontal: width * 0.05,
    paddingVertical:height * 0.01,
    position: "relative",
  },
  input: {
    width: "100%",
    height: moderateScale(45),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: moderateScale(12),
    backgroundColor: "#fff",
     paddingRight: 40,
  },

  subtitle:{
    paddingVertical: height *0.01,
    paddingHorizontal:width * 0.005,
    fontSize:moderateScale(14),
    fontWeight:500

  },

  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#000",
    height: 130,
  
  },

  title: {
    fontSize: moderateScale(20),
    fontWeight: 600,
    textAlign: "center",
  },
  icon: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },

cancleIcon: {
  position: "absolute",
  right: moderateScale(23),     
  top: verticalScale(45),      
  zIndex: 10,                   
},



  button: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor:'black',
    
  },

    buttonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },

  btnContainer:{
        paddingHorizontal: width * 0.05,
        marginTop:height * 0.02
  },


    mic: {
    position: "absolute",
    bottom: height * 0.04,
    right: width * 0.05,
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },


});

export default AddTodos;




























