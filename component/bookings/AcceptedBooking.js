import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { images, screenWidth } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
import { getDateTime } from "../../util/DateHelper";
import ButtonComponent from "../button/Button";
import { getConversationId } from "../../util/CustomHelper";

export default function AcceptedBooking({
  onpressAccepted,
  source,
  title = "",
  booked,
  date,
  time,
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{ marginHorizontal: 20 }}>
            <Image source={source} style={[styles.img]} />
          </View>
          <View>
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    text.themeDefault,
                    text.text18,
                    { textAlign: "center", fontWeight: "bold" },
                  ]}
                >
                  {title}
                </Text>
              </View>
            
            </View>

            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text style={[text.themeDefault, text.text14]}>{date}</Text>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Text style={[text.themeDefault, text.text14]}>{time}</Text>
            </View>
            <View style={{ marginVertical: 10, alignSelf: "center" }}>
              <ButtonComponent
                buttonSelection={true}
                buttonDefault={false}
                title={"ذهاب لدردشة "}
                onpress={onpressAccepted}
                style={{ backgroundColor: "#9cd644" }}
              />
            </View>
            <View style={{ alignSelf: "center" }}>
              <ButtonComponent
                buttonSelection={true}
                buttonDefault={false}
                title={"مدفوعة"}
           
                style={{ backgroundColor: "#9cd644" }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  card: {
    width: screenWidth.width90,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "#ececec",
    alignSelf: "center",
    marginVertical:15

  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width40,
  },
});
