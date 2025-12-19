import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";


const { width, height } = Dimensions.get("window");

const OnBoardingScreen = () => {
  const navigation = useNavigation();


  useEffect(() => {
    // i am using a  timeout here to simulate a splash / onboarding delay
    const timer = setTimeout(() => {
      navigation.navigate("TodoListScreen");
    }, 2000);

    // here, i am cleaning up to prevent memory leaks if component unmounts early
    return () => clearTimeout(timer);
  }, [navigation]); // i just included navigation  as a dependency








  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* this is my  Logo  */}
        <View style={styles.center}>
          <Image
            source={require("../assets/todoLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.footer}>Your Daily Buddy.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.06,
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    marginTop: height * 0.2,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.18,
    marginBottom: height * 0.02,
    borderRadius: 10,
  },

  footer: {
    color: "#585858ff",
    fontSize: 16,
    marginTop: 20,
  },
});

export default OnBoardingScreen;
