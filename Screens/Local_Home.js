import { StatusBar } from "expo-status-bar";
import React, { useReducer, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import LocalBooingDetailCard from "../component/card/DetailCard";
import { images, screenWidth } from "../config/Constant";
import {
  acceptRequest,
  getUserId,
  updateRequest,
  updateTour,
} from "../network/ApiService";
import text from "../style/text";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import AcceptedBookings from "../component/bookings/AcceptedBooking";
import RejectedBookings from "../component/bookings/RejectedBookings";
import Button from "../component/button/Button";
import { db } from "../config/firebase";

export default function Local_Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    all: [],
    accepted: [],
    rejected: [],
  });
  const [ui, setuid] = useState(null);

  // force update use reducer
  const [update, forceUpdate] = useReducer((s) => s + 1, 0);

  const [requestId, setRequestId] = useState(null);
  const [tourId, setTourId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [isModalVisibleAccepted, setModalVisibleAccepted] = useState(false);
  const [isModalVisibleRejected, setModalVisibleRejected] = useState(false);
  const menuTab = [
    { title: "الكل", selected: false },
    { title: "مقبولة", selected: false },
    { title: "مرفوضة ", selected: false },
  ];
  const [selectedMenu, setSelectedMenu] = useState(0);

  // get user id
  // useEffect(() => {
  //   (async () => {
  //     const uid = await getUserId();
  //     console.log("🚀 ~ Local> uid", uid);

  //     setCurrentUserId(uid);
  //   })();
  // }, []);

  const Asyced = () => {
    getUserId().then((currentUserIdLoc) => {
      const q = query(
        collection(db, "requests"),
        where("localId", "==", currentUserIdLoc)
      );

      const unsub = onSnapshot(q, (querySnapshot) => {
        let newRequest = [];
        querySnapshot.forEach((doc) => {
          newRequest.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const unique = newRequest.filter((thing, index, self) => {
          return (
            index ===
            self.findIndex((t) => {
              return t.id === thing.id;
            })
          );
        });

        const all = unique.filter((item) => item.status == 0);
        const accepted = unique.filter((item) => item.status === 1);
        const rejected = unique.filter((item) => item.status === 2);

        setData({ all, accepted, rejected });
      });
    });
  };

  React.useEffect(() => {
    Asyced();
  }, []);

  // get all requests
  // useEffect(() => {
  //   console.log("fetchRequests");

  //   const bag = [];
  //   const q = query(
  //     collection(db, REQUESTS),
  //     where("localId", "==", currentUserId)
  //   );

  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.docs.forEach((doc) => {
  //       bag.push({ ...doc.data(), id: doc.id });
  //     });

  //     const unique = bag.filter((thing, index, self) => {
  //       return (
  //         index ===
  //         self.findIndex((t) => {
  //           return t.id === thing.id;
  //         })
  //       );
  //     });

  //     const all = unique.filter((item) => item.status == 0);
  //     const accepted = unique.filter((item) => item.status === 1);
  //     const rejected = unique.filter((item) => item.status === 2);

  //     setData({ all, accepted, rejected });
  //   });

  //   return unsubscribe;
  // }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     getLocalGuideRequests();
  //   }, [])
  // );

  // const getAllRequests = async () => {
  //   getLocalGuideRequests();
  // };

  // const getLocalGuideRequests = async () => {
  //   let user = await getDataFromStorage("loggedInUser");
  //   let uid = user?.uid;
  //   const data = [];
  //   const requests = query(
  //     collection(db, REQUESTS),
  //     where("localId", "==", uid)
  //   );
  //   const unsubscribe = onSnapshot(requests, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       data.push(doc.data());
  //       setRequestId(doc.id);
  //     });
  //     setData(data);
  //     // console.log("data", data);
  //     setuid(uid);
  //   });
  // };

  const onAcceptionReq = async () => {
    console.log("Accept> reqId: ");
    setModalVisibleAccepted(!isModalVisibleAccepted);

    await acceptRequest(requestId, tourId);
    forceUpdate();
  };

  const rejectRequest = async () => {
    console.log("Reject> reqId: ");

    setModalVisibleRejected(!isModalVisibleRejected);
    const DataToUpdate = {
      status: 2,
      acceptedAt: new Date(),
    };
    console.log("🚀 ~ DataToUpdate", DataToUpdate);

    // TODO: update request status
    const updatedReq = await updateRequest(requestId, DataToUpdate);

    // TODO: update tour status
    const updatedTour = await updateTour(tourId, DataToUpdate);

    forceUpdate();
  };

  const onPressChat = (request) => {
    navigation.navigate("Chat", { params: request });
  };

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };

  const toggleModalAccepted = (req) => {
    setRequestId(req.id);
    setTourId(req.tourId);

    setModalVisibleAccepted(!isModalVisibleAccepted);
  };

  const toggleModalRejected = (req) => {
    setRequestId(req.id);
    setTourId(req.tourId);

    setModalVisibleRejected(!isModalVisibleRejected);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        {/* Header */}
        <View style={[styles.alignCenter, { marginVertical: 10 }]}>
          <Text style={[text.white, text.text30]}>طلباتي</Text>
        </View>

        {/* Top Tabs */}
        <View>
          <View style={[styles.flexDirection, styles.tabColor]}>
            {menuTab.map((menu, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => onPressTab(index)}
                    style={[
                      styles.headerTab,
                      {
                        backgroundColor:
                          selectedMenu == index ? "#d9d9d9" : "#f1f1f1",
                      },
                    ]}
                  >
                    <Text style={[text.themeDefault, text.text20]}>
                      {menu?.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Body */}

        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* All */}
          {selectedMenu == 0 ? (
            <View
              style={{
                flex: 1,
              }}
            >
              {data.all.map((item, index) => {
                return (
                  <View key={index} style={[styles.cardDiv]}>
                    <LocalBooingDetailCard
                      source={{ uri: item?.imageUrl }}
                      title={item?.title}
                      bookedBy={item?.touristName}
                      onpressAccepted={() => toggleModalAccepted(item)}
                      onpressRejected={() => toggleModalRejected(item)}
                    />
                  </View>
                );
              })}
            </View>
          ) : null}

          {/* Accepted */}
          {selectedMenu == 1
            ? data.accepted.map((item, index) => {
                const date = new Date(item?.dateCreated);
                const setDate = date.toDateString();
                const setTime = date.toTimeString();
                return (
                  <AcceptedBookings
                    key={index}
                    source={{ uri: item?.imageUrl }}
                    booked={item?.touristName}
                    title={item?.title}
                    date={setDate}
                    time={setTime}
                    onpressAccepted={() => onPressChat(item)}
                  />
                );
              })
            : null}

          {/* Rejected */}
          {selectedMenu == 2
            ? data.rejected.map((request, index) => {
                return (
                  <RejectedBookings
                    key={index}
                    source={{ uri: request?.imageUrl }}
                    booked={request?.touristName}
                    title={request?.title}
                  />
                );
              })
            : null}

          <View style={{ marginBottom: screenWidth.width20 }}></View>
        </ScrollView>

        {/* Modal Accepted */}
        <Modal isVisible={isModalVisibleAccepted}>
          <View style={[styles.modalView]}>
            <View style={[styles.main]}>
              <View style={{ marginVertical: 20 }}>
                <Text
                  style={[
                    text.themeDefault,
                    text.text22,
                    { textAlign: "center" },
                  ]}
                >
                  هل أنت متأكد أنك تريد قبول هذه الجولة؟
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{}}>
                  <Button
                    title="قبول"
                    onpress={() => onAcceptionReq()}
                    style={{ backgroundColor: "#80cc28" }}
                  />
                </View>
                <View style={{}}>
                  <Button
                    title="الغاء"
                    onpress={toggleModalAccepted}
                    style={{ backgroundColor: "#a5d5db" }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Rejected */}
        <Modal isVisible={isModalVisibleRejected}>
          <View style={[styles.modalView]}>
            <View style={[styles.main]}>
              <View style={{ marginVertical: 20 }}>
                <Text
                  style={[
                    text.themeDefault,
                    text.text22,
                    { textAlign: "center" },
                  ]}
                >
                  هل أنت متأكد أنك تريد رفض هذه الجولة؟
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{}}>
                  <Button
                    title="رفض"
                    onpress={() => rejectRequest(2)}
                    style={{ backgroundColor: "#c6302c" }}
                  />
                </View>
                <View style={{}}>
                  <Button
                    title="الغاء"
                    onpress={toggleModalRejected}
                    style={{ backgroundColor: "#a5d5db" }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: screenWidth.width10,
    backgroundColor: "#fff",
  },
  alignCenter: {
    alignItems: "center",
  },
  cardDiv: {
    marginTop: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    // backgroundColorwith opacity
    backgroundColor: "rgba(255,255,255,1)",
    width: screenWidth.width80,
    padding: 20,
    borderRadius: 20,
  },
  headerTab: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingVertical: 10,
    width: screenWidth.width30,
    alignItems: "center",
  },
  tabColor: {
    backgroundColor: "#f1f1f1",
    width: screenWidth.width90,
    alignSelf: "center",
    borderRadius: 20,
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
});
