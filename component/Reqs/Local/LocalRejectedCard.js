import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  colors,
  highlights,
  images,
  screenWidth,
} from "../../../config/Constant";
import text from "../../../style/text";
import AppImage from "../../AppImage";

export default function LocalRejectedCard({
  onpressAccepted,
  onpressRejected,
  source,
  title,
  booked,
  item,
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View
          style={[
            styles.flexDirection,
            {
              justifyContent: "space-between",
            },
          ]}
        >
          {/* Image */}
          <View style={{ marginHorizontal: 10 }}>
            {source.uri ? (
              <AppImage
                sourceURI={source.uri}
                style={[styles.img, highlights.brdr01]}
              />
            ) : (
              <Image
                source={images.photo}
                style={[styles.img, highlights.brdr01]}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              ...highlights.brdr01,
              width: screenWidth.width50,
            }}
          >
            {/* Title & TOurist */}
            <View style={{ ...highlights.brdr01, marginHorizontal: 10 }}>
              <Text
                style={[
                  {
                    ...highlights.brdr02,
                  },
                  text.themeDefault,
                  text.text18,
                  { textAlign: "right", fontWeight: "bold", marginRight: 20 },
                ]}
              >
                {title}
              </Text>

              {item.localName && (
                <View style={[styles.flexDirection, { alignSelf: "flex-end" ,paddingTop:5,}]}>
                  <Text
                    style={[
                      text.TextC,
                       text.text14,   
                      ]}
                  >
                    {booked}
                  </Text>
                  <Text
                    style={[
                    text.TextC,
                     text.text14, 
                    ]}
                  >
                    السائح:{" "}
                  </Text>
                </View>
              )}
            </View>

            {/* State */}
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <Text
                style={[
                  text.text18,
                  {
                    textAlign: "right",
                    fontWeight: "bold",
                    marginRight: 20,
                    color: colors.redTheme,
                  },
                ]}
              >
                تم رفض الطلب
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
