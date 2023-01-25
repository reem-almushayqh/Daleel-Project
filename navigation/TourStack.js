import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import EditTourV3 from "../Screens/Local/EditTourV3";
import TourDetail from "../Screens/Local/TourDetail";
import TourDetailedInformation from "../Screens/Local/TourDetailedInformation";
const Stack = createNativeStackNavigator();

function TourStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TourDetail" component={TourDetail} />

      <Stack.Screen
        name="TourDetailedInformation"
        component={TourDetailedInformation}
      />
      <Stack.Screen name="EditTour" component={EditTourV3} />
    </Stack.Navigator>
  );
}

export default TourStack;
