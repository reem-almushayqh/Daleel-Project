import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createOpenLink } from "react-native-open-maps";
import { colors, highlights } from "../../config/Constant";
import Chip from "../Chip";

const MapListItem = ({ item, withMap }) => {
  // const { id, title, full_name, address, coordinates, category } = item;
  const WrapperComponent = withMap ? TouchableHighlight : View;

  const openMaps = createOpenLink({
    latitude: item?.coordinates?.latitude,
    longitude: item?.coordinates?.longitude,
    zoom: 15,
    query: `${item?.address}`,
    // end: `${item?.address}`,
  });

  return (
    <WrapperComponent
      activeOpacity={0.6}
      underlayColor={withMap ? "rgba(109, 126, 105, 0.5)" : "rgba(0,0,0,0.0)"}
      style={{
        borderRadius: 15,
        overflow: "hidden",
        padding: 5,
        ...highlights.brdr02,
        width: "100%",
        flex: 1,
      }}
      onPress={openMaps}
    >
      <View style={styles.container}>
        <View style={styles.col}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.price}>{item?.full_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.address}>{item?.address}</Text>
        </View>
        <View
          style={{
            ...styles.row,
            justifyContent: "flex-start",
            marginTop: 10,
          }}
        >
          {item?.category.length > 0 &&
            item?.category.map((cat, index) => {
              return <Chip key={index} text={cat} />;
            })}
        </View>
      </View>
    </WrapperComponent>
  );
};

export default MapListItem;

const styles = StyleSheet.create({
  container: {
    ...highlights.brdr01,
    backgroundColor: colors.white,
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    // shadow
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  row: {
    ...highlights.brdr02,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  col: {
    ...highlights.brdr06,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    ...highlights.brdr03,

    fontSize: 15,
    fontWeight: "bold",
    color: colors.black,
  },
  price: {
    ...highlights.brdr04,

    fontSize: 12,
    color: colors.primary,
  },
  address: {
    ...highlights.brdr05,
    fontSize: 10,
    color: colors.black,
  },
});
