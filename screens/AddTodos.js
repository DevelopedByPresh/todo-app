
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { moderateScale, verticalScale } from "react-native-size-matters";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

import { OPENAI_API_KEY } from "@env";


const { width, height } = Dimensions.get("window");







const AddTodos = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(null);
  const [isListening, setIsListening] = useState(false);


  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "🚫 Error",
        text2: error,
        position: "top",
      });
      setError("");
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: message,
        position: "top",
      });
      setMessage("");
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
      setTitle('')
      setDescription('')
    } catch (err) {
      setError('Failed to save todo');
      console.log(err);
    }
  };





  /* start recording Function */
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError("Microphone permission denied");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsListening(true);
    } catch {
      setError("Could not start recording");
    }
  };

  /*  Stop Recording function */
  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecording(null);
      setIsListening(false);

      if (!uri) {
        setError("Recording failed, try again");
        return;
      }

      await transcribeAudio(uri);
    } catch {
      setError("Failed to stop recording");
    }
  };


  const transcribeAudio = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "speech.m4a",
        type: "audio/m4a",
      });
      formData.append("model", "whisper-1");

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data)

      if (!data.text || !data.text.trim()) {
        setError("No speech detected — speak clearly and try again");
        return;
      }

      await createTodosFromSpeech(data.text);
    } catch {
      setError("Speech transcription failed");
    }
  };

  /* this functions helps me to   Split and save the  task */
  const createTodosFromSpeech = async (speechText) => {
    const tasks = speechText
      .split(/and|,|\./i)
      .map((t) => t.trim())
      .filter(Boolean);

    const stored = await AsyncStorage.getItem("@todos");
    const todos = stored ? JSON.parse(stored) : [];

    tasks.forEach((task) => {
      todos.push({
        id: Date.now().toString() + Math.random(),
        title: task,
        description: "",
        completed: false,
      });
    });

    await AsyncStorage.setItem("@todos", JSON.stringify(todos));
    setMessage(`${tasks.length} task(s) added from voice`);
  };







  return (
    <View style={styles.container}>
   
    <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
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
                <MaterialIcons name="cancel" size={20} color="black" />
             
              </TouchableOpacity>}

      </View>

   
         <View style={[styles.inputWrapper, {marginTop:height * 0.04}]}>
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


              {description &&
              <TouchableOpacity style={styles.clearDesc} onPress={() => setDescription('')} >
                <MaterialIcons name="cancel" size={20} color="black" />
             
              </TouchableOpacity>}
      </View>


       

  
      <TouchableOpacity style={styles.button} onPress={HandleSubmit}>
        <Text style={styles.buttonText}>Add Todo</Text>
      </TouchableOpacity>

   
      <TouchableOpacity
        style={[styles.mic, isListening && { backgroundColor: "red" }]}
        onPress={isListening ? stopRecording : startRecording}
      >
        <FontAwesome name="microphone" size={24} color="#fff" />
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

export default AddTodos;













const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  title: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    marginLeft: 20,
  },

  inputWrapper: {
    paddingHorizontal: width * 0.05,
    marginTop: 15,
    position: "relative",
  },

  subtitle: {
    fontSize: moderateScale(14),
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    paddingRight: 40,
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    height: 120,
  },

  cancleIcon: {
    position: "absolute",
    right: 25,
    top: verticalScale(27),
  },


  
  clearDesc: {
    position: "absolute",
    right: 25,
    bottom: verticalScale(5),
  },




  button: {
    marginTop: 20,
    marginHorizontal: width * 0.05,
    padding: 15,
    backgroundColor: "black",
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  mic: {
    position: "absolute",
    bottom: height * 0.04,
    right: width * 0.05,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
