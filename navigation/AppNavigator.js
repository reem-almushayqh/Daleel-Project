import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { LogBox } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import bottomTabs from "./LocalBottomTabs";
import TouristBottomTabs from "./TouristBottomTabs";
import Tourist_Sign_up from "../Screens/Tourist_Sign_up";
import Local_Sign_up from "../Screens/Local_Sign_up";
import Log_in2 from "../Screens/Log_in2";
import Sign_up from "../Screens/Sign_up";
import Local_Account from "../Screens/Local/Local_Account";
import Local_ChangePass from "../Screens/Local/Local_ChangePass";
import Local_Manage_Account from "../Screens/Local/Local_Manage_Account";
import Local_profile from "../Screens/Local/Local_profile";
import Chat from "../Screens/chatScreen/Chat";


import Tourist_Account from "../Screens/Tourist/Tourist_Account";
import Tourist_ChangePass from "../Screens/Tourist/Tourist_ChangePass"
import Tourist_Manage_Account from "../Screens/Tourist/Tourist_Manage_Account"

const Stack = createNativeStackNavigator();

function App() {
  React.useEffect(() => {
    LogBox.ignoreLogs([
      "Warning: Async Storage has been extracted from react-native core",
    ]);
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Log_in2" component={Log_in2} />
      <Stack.Screen name="TouristBottomTabs" component={TouristBottomTabs} />
      <Stack.Screen name="bottomTabs" component={bottomTabs} />
      <Stack.Screen name="Sign_up" component={Sign_up} />
      <Stack.Screen name="Chat" component={Chat} />

      <Stack.Screen name="Tourist_Sign_up" component={Tourist_Sign_up} />
      <Stack.Screen name="Local_Sign_up" component={Local_Sign_up} />

      <Stack.Screen name="Local_Manage_Account" component={Local_Manage_Account} />
      <Stack.Screen name="Local_Account" component={Local_Account} />
      <Stack.Screen name="Local_ChangePass" component={Local_ChangePass} />
      <Stack.Screen name="Local_profile" component={Local_profile} />

      <Stack.Screen name="Tourist_Manage_Account" component={Tourist_Manage_Account} />
      <Stack.Screen name="Tourist_Account" component={Tourist_Account} />
      <Stack.Screen name="Tourist_ChangePass" component={Tourist_ChangePass} />


    </Stack.Navigator>
  );
}

export default App;
