import { getAuth, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { images, colors } from "../../config/Constant";
import { db } from "../../config/firebase";

export default function Tourist_ChangePass({ navigation }) {
  const [current, setCurrentPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [infoList, setinfoList] = useState([]);
  const [error, setError] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const colRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(colRef);
    let userdata = snapshot.data();
    setCurrentPass(userdata.password);
  };

  let savePass = async () => {
    if (oldPass.length == 0) {
      setError("الرجاء إدخال الرقم السري الحالي");
    }
    else if (newPass.length > 7 && newPass.length < 31) {
      if (oldPass === current) {
        updatePassword(user, newPass)
          .then(async () => {
            await updateDoc(doc(db, "users", user.uid), { password: newPass });
            await updateDoc(doc(db, "Tourist_users", user.uid), {
              password: newPass,
            });
            setError("");
            alert("تم تغيير الرقم السري بنجاح ");
            navigation.goBack();
          })
          .catch((error) => {
            setError(error.message);
          });
      } else {
        setError(" الرقم السري الحالي غير صحيح");
      }
    }

    else if (newPass == "") {
      setError("الرجاء إدخال الرقم السري الجديد");
    }
    else {
      setError("الرقم السري ضعيف الرجاء ادخال رقم سري من 8-30 حرف");
    }
  };
  return (
    <ImageBackground
      style={{ flex: 1, marginTop: -20 }}
      source={images.backgroundImg}
      resizeMode="cover"
    >
      <View
        style={{
          height: "13%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
          marginBottom: 15,
          marginTop: 35,
        }}
      >
        <Icon
          name="arrow-back-outline"
          size={45}
          style={{ color: "white", marginTop: 40, marginLeft: 5 }}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 0,
            width: "100%",
            marginLeft: 11,
          }}
        >
          <Text
            style={{
              marginLeft: 80,
              marginTop: -40,
              fontSize: 25,
              color: "#FFF",
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            تغيير الرقم السري{" "}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#FFF",
          height: "70%",
          borderRadius: 50,
          paddingHorizontal: 20,
          marginBottom: 15,
          marginTop: 10,
          paddingTop: 10,
          borderColor: "#BDBDBD",
          borderWidth: 1
        }}
      >
        <Text
          style={{
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {error}
        </Text>
        <View style={{ marginTop: 40, marginLeft: -10 }}>
          <View>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, textAlign: "right", padding: 10, }}
            >
              الرقم السري الحالي*
            </Text>
            <TextInput
              style={styles.body}
              //  placeholder={"*****"}
              //  placeholderTextColor="black"
              // onChangeText={(text) => setValue({ ...value, firstname: text })}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setOldPass(text)}
            />
          </View>
          <View>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, textAlign: "right", padding: 10, }}
            >
              {"\n"}الرقم السري الجديد*
            </Text>
            <TextInput
              style={styles.body}
              //   placeholder={lastname}
              //   placeholderTextColor="black" //     onChangeText={(text) => setValue({ ...value, lastname: text })}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setNewPass(text)}
            />
          </View>

          <View>
            <TouchableOpacity
              onPress={savePass}
              style={{
                backgroundColor: colors.Blue,
                padding: 20,
                borderRadius: 10,
                marginBottom: 30,
                marginTop: 15,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 18,
                  color: "white",
                }}
              >
                حفظ التغيرات
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  title: {
    alignItems: "left",
    justifyContent: "left",
    fontWeight: "bold",
    fontSize: 35,
    marginTop: 20,
    paddingLeft: 10,
    marginBottom: 20,
  },
  body: {
    borderWidth: 3,
    borderColor: "#BDBDBD",
    width: "100%",
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#ffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    textAlign: "right",
  },
  buttonCont: {
    width: 180,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#5398a0",
    marginTop: 30,
    paddingLeft: 10,
    alignSelf: "center",
  },
  savechanges: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    marginRight: 18,
  },
});
