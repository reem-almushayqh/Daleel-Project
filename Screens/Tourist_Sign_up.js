import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  date,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
//import { registerForPushNotificationsAsync } from "../../util/Notifcations";

function msg(error) {
  switch (error.code) {
    case "auth/invalid-email":
      error.code = "Wrong email address";
      break;

    case "auth/email-already-in-use":
      error.code =
        "The email is already registered try to login or use forgot password";
      break;

    case "auth/weak-password":
      error.code = "week password";
      break;

    default:
      return error.code;
  }
  return error.code;
}


export default function UserSignUp({ navigation }) {
  const [push_token, setPushToken] = useState("");
  /* useEffect(() => {
     registerForPushNotificationsAsync().then((token) => {
       setPushToken(token === undefined ? "" : token);
     });
   }, []);*/
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    //username: "",
    phone: "",
    firstname: "",
    // lastname: "",

    error: "",
  });
  const auth = getAuth();
  const db = getFirestore();

  async function signUp() {
    if (
      value.firstname === "" ||
      value.email === "" ||
      value.phone === "" ||
      value.password === ""
    ) {
      setValue({
        ...value,
        error: " الإسم والبريد الإلكتروني ورقم الجوال ورقم السري مطلوبين ",
      });
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );
      console.log("user", user.uid);

      const data = {
        email: value.email,
        phone: value.phone,
        firstname: value.firstname,
        // lastname: value.lastname,
        password: value.password,
        uid: user.uid,
        isTourist: false,
        push_token: push_token || "",
      };

      setDoc(doc(db, "users", user.uid), data).then(() => {
        alert("User Created please Login");
        console.log("here2", user.uid);
        navigation.navigate("Log_in2");

      })
    } catch (er) {
      console.log('====================================');
      console.log("er", er);
      console.log('====================================');
      er = msg(er);
      setValue({
        ...value,
        error: er,
      });
      console.log(er);
    }
  }
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#ffff" }}
    >
      <ScrollView>
        <View
          style={{
            width: "100%",
            height: 40,
            paddingHorizontal: 20,
          }}
        >
          <Icon
            name="arrow-back-outline"
            size={40}
            style={{ color: "black" }}
            onPress={() => navigation.goBack()}
          />
        </View>

        <Text style={[styles.title]}>{"  "} تسجيل حساب جديد كمرشد سياحي   </Text>
        <Text style={{ color: "red" }}>{value?.error}</Text>

        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="الإسم"
            onChangeText={(text) => setValue({ ...value, firstname: text })}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="البريد الإلكتروني"
            onChangeText={(text) => setValue({ ...value, email: text })}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="رقم الجوال"
            onChangeText={(text) => setValue({ ...value, phone: text })}
            underlineColorAndroid="transparent"
          />
        </View>


        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            secureTextEntry={true}
            placeholder="الرقم السري"
            onChangeText={(text) => setValue({ ...value, password: text })}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.buttonCont}>
          <Button
            title="إنشاء حساب"
            color="#ffff"
            onPress={() => signUp()} //
          ></Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: "flex-end",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    paddingLeft: 10,
    marginBottom: 20,
  },
  body: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 12,
    width: 350,
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonCont: {
    margin: 50,
    padding: 5,
    width: 250,
    borderRadius: 10,
    backgroundColor: "lightblue",
  },
});
