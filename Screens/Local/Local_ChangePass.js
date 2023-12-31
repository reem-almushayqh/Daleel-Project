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
import { db } from "../../config/firebase";
import Modal from "react-native-modal";
import { images, screenWidth, REQUEST_TABLE, colors } from "../../config/Constant";
import Button from "../../component/button/Button";

export default function Local_ChangePass({ navigation }) {
  const [current, setCurrentPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  const [infoList, setinfoList] = useState([]);
  const [error, setError] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const toggleModal = () => {
    console.log(isModalVisible)
    setModalVisible(prev => !prev);
    console.log(isModalVisible, "22")
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const colRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(colRef);
    let userdata = snapshot.data();
    setCurrentPass(userdata.password);
    console.log(userdata.password, "here 4")
  };
  let savePass2 = () => {
    updatePassword(user, newPass)
      .then(async () => {
        await updateDoc(doc(db, "users", user.uid), { password: newPass });
        await updateDoc(doc(db, "Admin_users", user.uid), {
          password: newPass,
        });
        navigation.goBack();

        alert("تم تغيير الرقم السري بنجاح ");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  let savePass = async () => {
    console.log(newPass, "new pass")
    console.log(current, "current pass")
    console.log(oldPass, "old pass")
    console.log(newPass.length, "new pass")

    if (oldPass.length == 0) {
      setError("الرجاء إدخال الرقم السري الحالي");
    }

    else if (newPass == "") {
      setError("الرجاء إدخال الرقم السري الجديد");
    }

    else if (newPass.length < 7 || newPass.length > 30) {
      setError("الرقم السري ضعيف الرجاء ادخال رقم سري من 8-30 حرف");
    }
    else if (newPass.length > 7 && newPass.length < 31) {
      if (oldPass === current) {
        setError("");

        setModalVisible(prev => !prev);

      } else {
        setError(" الرقم السري الحالي غير صحيح");
      }
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
          style={{ color: "white", marginTop: 40, marginLeft: -5 }}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            width: "100%",
            marginLeft: 5,
          }}
        >
          <Text
            style={{
              marginLeft: 80,
              marginTop: -65,
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
          marginTop: -5,
          paddingTop: 10,
          //   marginTop: 15,
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
              style={{ fontWeight: "bold", fontSize: 20, textAlign: "right" }}
            >
              *الرقم السري الحالي
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
              style={{ fontWeight: "bold", fontSize: 20, textAlign: "right" }}
            >
              {"\n"}*الرقم السري الجديد
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
              onPress={() => {
                savePass();
                // console.log("onPress");
              }}
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
        <Modal isVisible={isModalVisible}>
          <View style={[styles.modalView]}>
            <View style={[styles.main]}>
              <View style={{ marginVertical: 20 }}>
                <Text
                  style={{ textAlign: "center", fontSize: 18 }}
                >
                  هل أنت متأكد من تغيير الرقم السري
                </Text>

              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{}}>
                  <Button title="الغاء" onpress={toggleModal}
                    style={{ backgroundColor: colors.lightBrown }} />

                </View>
                <View style={{}}>
                  <Button title="نعم" onpress={() => savePass2()}

                    style={{ backgroundColor: colors.Blue }} />
                </View>

              </View>
            </View>
          </View>
        </Modal>
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
    marginTop: 10,
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    backgroundColor: "#fff",
    width: screenWidth.width80,
    padding: 20,
    borderRadius: 20,
  },
});

