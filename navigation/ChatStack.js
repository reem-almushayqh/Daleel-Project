import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import ChatConvesation from "../Screens/chat/ChatConv";
import ChatsList from "../Screens/chat/ChatsMenu";
const Stack = createNativeStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatsList" component={ChatsList} />
      <Stack.Screen
        options={({ route }) => {
          const { receiverName } = route.params;
          return {
            title: receiverName,
            headerShown: true,
          };
        }}
        name="ChatConv"
        component={ChatConvesation}
      />
    </Stack.Navigator>
  );
}

export default ChatStack;
