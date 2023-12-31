import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, images, screenWidth } from "../../../config/Constant";
import text from "../../../style/text";
import AppImage from "../../AppImage";

export default function TouristRejectCard({ onpress, source, title, local }) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View
          style={[styles.flexDirection, { justifyContent: "space-between" }]}
        >
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            {source.uri ? (
              <AppImage sourceURI={source.uri} style={[styles.img]} />
            ) : (
              <Image source={images.photo} style={[styles.img]} />
            )}
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={[text.text18,text.HeadingC, { textAlign: "right", fontWeight: "bold" }]}
            >
              {title}
            </Text>
            <Text
              style={[text.text14,text.TextC, { textAlign: "right", }]}
            >
              المُرشد: {local}
            </Text>
            <View style={{ alignSelf: "center", marginTop: 15 }}>
              <Text
                style={[
                  text.text18,
                  {
                    textAlign: "right",
                    fontWeight: "bold",
                    marginRight: 20,
                    color: colors.brown,
                  },
                ]}
              >
                طلبك مرفوض
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width90,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    paddingVertical: 10,
    marginVertical: 10,

    // Show shadow on Android and iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width35,
    height: screenWidth.width35,
    borderRadius: 10,
  },
});
