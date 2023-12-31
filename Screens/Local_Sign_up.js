import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import {
  colors,
  imagePickerConfig,
  images,
  screenWidth,
} from "../config/Constant";
import { auth, db } from "../config/firebase";
import { registerForPushNotificationsAsync } from "../util/Notifcations";
import Loading from "./../component/Loading";

function msg(error) {
  switch (error.code) {
    case "auth/invalid-email":
      error.code = "عنوان البريد الإلكتروني غير صحيح";
      break;

    case "auth/email-already-in-use":
      error.code = "هذا البريد الإلكتروني قدم تم استخدامه من قبل";
      break;

    case "auth/weak-password":
      error.code = "الرقم السري ضعيف الرجاء ادخال رقم سري لايقل عن 8 حروف";
      break;

    default:
      return error.code;
  }
  return error.code;
}

export default function Local_Sign_up({ navigation }) {
  const [push_token, setPushToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      //  setPushToken(token === undefined ? "" : token);
      setPushToken(token);
    });
  }, []);
  const [image, setImage] = useState(null);
  const [update, setupdate] = useState(true);
  const [filePath, setFilePath] = useState(null);

  const [NameError, setNameError] = useState("");
  const [PassError, setPassError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [PhoneError, setPhoneError] = useState("");

  const [LastNameError, setLastNameError] = useState("");
  const [MaroofError, setMaroofError] = useState("");
  const [UsernameError, setUsernameError] = useState("");
  const [Pass2Error, setPass2Error] = useState("");
  const [a1, seta1] = useState(false);

  ///////////////////////////////image
  const options = {
    title: "select image",
    type: "library",
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 1,
      mediaType: "photo",
      includeBase64: false,
    },
  };
  /* const pickImage = async () => {
         let result = await ImagePicker.launchImageLibraryAsync(options);
 
         if (!result.canceled) {
             // firebase;
             var name = Math.random();
             const storage = getStorage();
             const storageRef = ref(storage, `posters${name}`);
             const response = await fetch(result.assets);
             const file = await response.blob();
             uploadBytes(storageRef, file).then((snapshot) => {
                 console.log(snapshot);
                 getDownloadURL(snapshot.ref).then((url) => {
                     setImage(url);
                 });
                 console.log("Uploaded a blob or file!");
             });
         }
     };*/

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      ...imagePickerConfig,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setFilePath(result.assets[0].uri);
    }
  };
  const uploadImage = async (path) => {
    try {
      const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
      const response = await fetch(uri);
      const storage = getStorage();

      const fileName = uri.substring(uri.lastIndexOf("/") + 1);
      const blobFile = await response.blob();

      const reference = ref(storage, `media/${Date.now()}-${fileName}`);

      const result = await uploadBytesResumable(reference, blobFile);
      const url = await getDownloadURL(result.ref);
      // console.log("🚀 ~ url", url);

      return url;
    } catch (err) {
      return Promise.reject(err);
    }
  };
  //remove image
  const removeImage = () => setImage(null);

  const [value, setValue] = React.useState({
    email: "",
    password: "",
    username: "",
    username22: "",

    phone: "",
    firstname: "",
    lastname: "",

    maroof: "",
    city: "",
    poster: "",

    password2: "",
    error: "",
  });

  const validatName = () => {
    if (value.firstname === "") {
      setNameError("الرجاء إدخال اسمك الأول");
    } else if (!checkFirstName(value.firstname)) {
      setNameError(
        "يُسمح باستخدام الحروف الهجائية الانجليزية فقط وان تتكون من 4-20 حرف"
      );
    } else if (checkFirstName(value.firstname) && value.firstname !== "") {
      setNameError("");
    }
  };
  const validatLastName = () => {
    if (value.lastname === "") {
      setLastNameError("الرجاء إدخال اسمك الأخير");
    } else if (!checkFirstName(value.lastname)) {
      setLastNameError(
        "يُسمح باستخدام الحروف الهجائية الانجليزية فقط وان تتكون من 4-20 حرف"
      );
    } else if (checkFirstName(value.lastname) && value.lastname !== "") {
      setLastNameError("");
    }
  };

  const validatPass = () => {
    if (checkPass(value.password)) {
      setPassError("");
    } else if (value.password === "") {
      setPassError("الرجاء إدخال الرقم السري");
    } else if (!checkPass(value.password))
      setPassError("الرقم السري ضعيف الرجاء ادخال رقم سري من 8-30 حرف");
  };

  const validatEmail = () => {
    setEmailError("");
    if (value.email === "") {
      setEmailError(" الرجاء إدخال البريد الإلكتروني");
    } else if (!checkEmail(value.email)) {
      setEmailError("عنوان البريد الإلكتروني غير صحيح");
    }
  };

  const validatPhone = () => {
    if (checkPhone(value.phone)) {
      setPhoneError("");
    } else if (value.phone === "") {
      setPhoneError("الرجاء إدخال رقم الجوال");
    } else if (!checkPhone2(value.phone))
      setPhoneError("يجب ان يتكون الرقم الجوال من 8 ارقام  ");
  };

  const validatMaroof = () => {
    if (checkMaroof(value.maroof)) {
      setMaroofError("");
    } else if (value.maroof === "") {
      setMaroofError("الرجاء إدخال رقم معروف");
    } else if (!checkMaroof(value.maroof))
      setMaroofError("يجب ان يتكون رقم معروف من 5 او 6 ارقام  ");
  };

  const validatUsername = () => {
    if (value.username === "") {
      setUsernameError("الرجاء إدخال اسم المستخدم");
    } else if (!checkUserName(value.username))
      setUsernameError(
        "يُسمح باستخدام الحروف الهجائية الانجليزية فقط وان تتكون من 4-25 حرف"
      );
    else {
      setUsernameError("");
    }
  };

  const validatPass2 = () => {
    if (value.password === value.password2) {
      setPass2Error("");
    } else if (value.password2 === "") {
      setPass2Error(" الرجاء إدخال الرقم السري مرةاخرى للتأكيد");
    } else if (value.password != value.password2) {
      setPass2Error("هذا الرقم السري لايتوافق مع الرقم السري المُدخل سابقاً");
      console.log("pass false");
    }
  };

  async function signUp() {
    if (
      value.firstname === "" ||
      value.lastname === "" ||
      value.email === "" ||
      value.phone === "" ||
      value.username === "" ||
      value.password === "" ||
      value.password2 === "" ||
      value.maroof === "" ||
      checkFirstName(value.firstname) === false ||
      checkFirstName(value.lastname) === false ||
      checkPass(value.password) === false ||
      checkEmail(value.email) === false ||
      checkMaroof(value.maroof) === false ||
      checkPhone(value.phone) == false ||
      checkUserName(value.username) == false

      //  value.city === ""
      //   value.poster === ""
    ) {
      validatName();
      validatPass();
      validatEmail();
      validatPhone();
      validatLastName();
      validatMaroof();
      validatUsername();
      validatPass2();
    } else {
      CheckUnique()


    }
  }

  let checkFirstName = (value) => {
    var letters = /^[A-Za-z]+$/;
    if (value.match(letters) && value.length < 21 && value.length > 3) {
      return true;
    } else {
      return false;
    }
  };

  let checkPass = (value) => {
    //  var letters = /^[A-Za-z]+$/;
    if (value.length > 7 && value.length < 31) {
      return true;
    } else {
      return false;
    }
  };
  let checkEmail = (value) => {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

    if (regex.test(value) && value.includes("@") && value.includes(".")) {
      console.log("email true");
      return true;
    } else {
      console.log("email false");
      return false;
    }
  };
  let checkPhone = (value) => {
    var letters = /^[0-9]+$/;
    // console.log(value.length);
    if (value.match(letters) && value.length == 8) {
      return true;
    } else {
      return false;
    }
  };
  let checkPhone2 = (value) => {
    if (value.length == 8) {
      return true;
    } else {
      return false;
    }
  };
  let checkMaroof = (value) => {
    var letters = /^[0-9]+$/;
    if (value.match(letters)) {
      if (value.length == 5 || value.length == 6) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  let checkUserName = (value) => {
    var letters = /^[0-9a-zA-Z-_]+$/;
    if (value.match(letters) && value.length < 26 && value.length > 3) {
      return true;
    } else {
      return false;
    }
  };

  let CheckUnique = async () => {
    const q = query(
      collection(db, "Admin_users"),
      where("username", "==", value.username)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(snapshot.empty, "true2 check uniq");
      setUsernameError("");
      {
        try {
          setIsLoading(true);
          const { user } = await createUserWithEmailAndPassword(
            auth,
            value.email,
            value.password
          );

          const isTourHasImage = filePath ? true : false;
          let imageUrl = null;
          if (isTourHasImage) {
            imageUrl = await uploadImage(filePath);
            // console.log("🚀 ~ imageUrl", imageUrl);
          }
          const data = {
            firstname: value.firstname,
            lastname: value.lastname,

            email: value.email,
            phone: value.phone,
            password: value.password,
            username: value.username,
            username22: value.username,

            maroof: value.maroof,
            city: value.city,
            poster: imageUrl,
            pictures: [],
            uid: user.uid,
            isTourist: false,
            push_token: push_token || "",
          };
          setDoc(doc(db, "users", user.uid), data);
          setDoc(doc(db, "Admin_users", user.uid), data).then(() => {
            alert("تم إنشاء الحساب بنجاح الرجاء تسجيل الدخول");
            navigation.navigate("Log_in2");
          });
          setIsLoading(false);
        } catch (er) {
          console.log("====================================");
          console.log("er", er);
          console.log("====================================");
          er = msg(er);
          setValue({
            ...value,
            error: er,
          });
          console.log(er);
          setIsLoading(false);
        }
      }
      return true;
    }
    setUsernameError("هذا الاسم قدم تم استخدامه من قبل");
    return false;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#f8f5f2" }}
    >
      <Loading visible={isLoading} text={"جاري إنشاء الحساب..."} />
      <Icon
        name="arrow-back-outline"
        size={50}
        style={{ color: "#0a243d" }}
        onPress={() => navigation.goBack()}
      />

      <ScrollView>
        <View style={{ alignItems: "center", marginTop: 0 }}>
          <Image
            style={{ height: 200, width: 200 }}
            source={require("../assets/Daleel_Logo.png")}
          />
        </View>
        <View style={{ paddingHorizontal: 25, marginTop: 10 }}>
          <Text style={[styles.title]}> إنشاء حساب جديد</Text>

          {filePath ? (
            <TouchableOpacity
              onPress={() => {
                // remove image
                setFilePath(null);
              }}
              style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
            >
              <Image source={{ uri: filePath }} style={[styles.dummyImg]} />
              <Text
                style={{
                  alignContent: "center",
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#0a243d",
                }}
              >
                اختر الصورة الشخصية
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => pickImage()}
              style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
            >
              <Image source={images.photo} style={[styles.dummyImg]} />
              <Text
                style={{
                  alignContent: "center",
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#0a243d",
                }}
              >
                اختر الصورة الشخصية
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.lable}> الاسم الأول</Text>

          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {NameError}
            </Text>
            <TextInput
              style={styles.body}
              placeholder="*الإسم الأول"
              onChangeText={(text) => setValue({ ...value, firstname: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.lable}> الاسم الأخير</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {LastNameError}
            </Text>
            <TextInput
              style={styles.body}
              placeholder=" *الإسم الأخير"
              onChangeText={(text) => setValue({ ...value, lastname: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.lable}> اسم المستخدم</Text>

          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {UsernameError}
            </Text>
            <TextInput
              style={styles.body}
              placeholder="*اسم المستخدم"
              onChangeText={(text) => setValue({ ...value, username: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.lable}> البريد الإلكتروني</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {EmailError}
            </Text>
            <Text style={{ color: "red" }}>{value?.error}</Text>

            <TextInput
              style={styles.body}
              placeholder="*البريد الإلكتروني"
              onChangeText={(text) =>
                setValue({ ...value, email: text.trim() })
              }
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.lable}> رقم الجوال</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {PhoneError}
            </Text>
            <TextInput
              style={styles.body}
              placeholder="966-05XXXXXXXXX "
              onChangeText={(text) => setValue({ ...value, phone: text })}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.lable}> معروف</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {MaroofError}
            </Text>
            <TextInput
              style={styles.body}
              placeholder="*معروف "
              onChangeText={(text) => setValue({ ...value, maroof: text })}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.lable}> كلمة المرور</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {PassError}
            </Text>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="*الرقم السري"
              onChangeText={(text) => setValue({ ...value, password: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.lable}> تأكيد كلمة المرور</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {Pass2Error}
            </Text>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="*تأكيد الرقم السري"
              onChangeText={(text) => setValue({ ...value, password2: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.buttonCont}>
            <Button
              title="إنشاء حساب"
              color="white"
              onPress={() => signUp()} //
            ></Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 25,
    alignSelf: "flex-end",
    marginTop: 20,
    color: "#0a243d",
  },
  body: {
    borderWidth: 3,
    borderColor: "#BDBDBD",
    width: "100%",
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#f8f5f2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    textAlign: "right",
  },
  buttonCont: {
    marginTop: 20,
    alignSelf: "center",
    padding: 5,
    width: 250,
    borderRadius: 10,
    backgroundColor: colors.brown,
  },
  lable: {
    fontSize: 19,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-end",
    color: "#0a243d",
  },
  dummyImg: {
    width: screenWidth.width50,
    height: screenWidth.width50,
    resizeMode: "contain",
    // opacity: 0.7,
  },
  alignCenter: {
    alignItems: "center",
  },
});
