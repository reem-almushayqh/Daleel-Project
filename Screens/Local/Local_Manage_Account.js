import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../config/firebase";
import { removeDataFromStorage } from "../../util/Storage";

export default function Local_Manage_Account({ navigation }) {
  const [infoList, setinfoList] = useState([]);
  const [fname, setFname] = useState("");
  const [lastname, setLname] = useState("");

  const user = auth.currentUser;

  const showAlert = () =>
    Alert.alert(
      "تسجيل خروج ",
      "هل أنت متأكد من الخروج",
      [
        {
          text: "لا",
          //  onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "نعم",
          style: "cancel",
          onPress: async () => {
            try {
              removeDataFromStorage("loggedInUser");
              await signOut(auth);
              navigation.navigate("Log_in2");
            } catch (error) {
              console.log(
                "🚀 ~ file: Tourist_Manage_Account.js ~ line 48 ~ showAlert ~ error",
                error
              );
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const colRef = query(
        collection(db, "users"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(colRef);
      var myData = [];
      //store the data in an array myData
      snapshot.forEach((doc) => {
        let userinfo2 = doc.data();
        // console.log("🚀 ~ userinfo2", userinfo2);

        setFname(userinfo2.firstname);
        setLname(userinfo2.lastname);

        userinfo2.id = doc.id;

        myData.push(userinfo2);
      });
      setinfoList(myData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View style={{ padding: 10, width: "100%", height: 150 }}>
        <View
          style={{
            shadowColor: "black",
            shadowOffset: { height: 5, width: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 0.5,
          }}
        >
          <Image
            source={require("../../assets/a1.jpg")}
            style={{
              resizeMode: "cover",
              opacity: 0.7,
              width: 420,
              height: 260,
              marginTop: -13,
              marginLeft: -10,
            }}
          ></Image>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/tabIcons/account.png")}
            style={{
              width: 140,
              height: 140,
              borderRadius: 90,
              marginTop: -200,
            }}
          ></Image>

          <Text
            style={{
              fontSize: 35,
              fontWeight: "bold",
              padding: 35,
              marginTop: -30,
            }}
          >
            {fname}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 120 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Local_Account")}>
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: "#fff",
              width: "90%",
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 0.3,
              elevation: 15,
              marginTop: 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginTop: 7,
                marginRight: 8,
                flex: 1,
              }}
            >
              المعلومات الشخصية
            </Text>
            <Icon name="person-outline" size={33} style={{ marginRight: 10, textAlign: "right" }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Local_profile")}
          style={{
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            backgroundColor: "#fff",
            width: "90%",
            padding: 20,
            paddingBottom: 22,
            borderRadius: 10,
            shadowOpacity: 0.3,
            elevation: 15,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, marginTop: 7, marginRight: 8, flex: 1, textAlign: "right" }}>
            الملف الشخصي
          </Text>
          <Icon
            name="person-circle-outline"
            size={35}
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Local_ChangePass")}
        >
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: "#fff",
              width: "90%",
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 0.3,
              elevation: 15,
              marginTop: 17,
            }}
          >
            <Text
              style={{ fontSize: 18, marginTop: 7, marginRight: 8, flex: 1, textAlign: "right" }}
            >
              تغيير الرقم السري
            </Text>
            <Icon
              name="lock-closed-outline"
              size={33}
              style={{ marginRight: 10 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showAlert}
          style={{
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            backgroundColor: "#fff",
            width: "90%",
            padding: 20,
            paddingBottom: 22,
            borderRadius: 10,
            shadowOpacity: 0.3,
            elevation: 15,
            marginTop: 20,
            marginBottom: 19,
          }}
        >
          <Text style={{ fontSize: 18, marginTop: 7, marginRight: 8, flex: 1, textAlign: "right" }}>
            تسجيل الخروج
          </Text>
          <Icon name="log-out-outline" size={33} style={{ marginRight: 5 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
