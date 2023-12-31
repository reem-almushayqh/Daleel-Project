import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { screenWidth } from "../../config/Constant";
import text from "../../style/text";
export default function Button({
  title,
  onpress,
  disabled = false,
  buttonSelection = false,
  buttonDefault = true,
  style,
}) {
  return (
    <View>
      {buttonDefault && (
        <Pressable
          disabled={disabled}
          onPress={onpress}
          style={[
            styles.btn,

            {
              width: screenWidth.width30,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: disabled ? "rgba(83, 152, 160, 0.5)" : "#5398a0",
              ...style,
            },
          ]}
        >
          <Text
            style={[
              text.white,
              text.text20,
              text.center,
              {
                width: "100%",
              },
            ]}
          >
            {title}
          </Text>
        </Pressable>
      )}
      {buttonSelection && (
        <Pressable
          onPress={onpress}
          style={[
            styles.btnSecondary,
            {
              width: screenWidth.width30,

              backgroundColor: "#80cc28",
              ...style,
            },
          ]}
        >
          <Text
            style={[
              text.white,
              text.text18,
              text.center,

              {
                width: "100%",
              },
            ]}
          >
            {title}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: screenWidth.width30,
    paddingVertical: 7,
    backgroundColor: "#5398a0",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    width: screenWidth.width35,
    paddingVertical: 5,
    backgroundColor: "#80cc28",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
