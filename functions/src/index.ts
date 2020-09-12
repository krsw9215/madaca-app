import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Timestamp } from "@google-cloud/firestore";
import * as moment from "moment-timezone";

admin.initializeApp();
moment.locale("ja");
moment.tz.setDefault("Asia/Tokyo");

const runtimeOpts = { timeoutSeconds: 300 };
functions.runWith(runtimeOpts);

const geo = require("geofirex").init(admin);

export const addStation = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }

  const latitude = data.latitude;
  const longitude = data.longitude;

  if (!latitude || !longitude) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "latitude and longitude required."
    );
  }

  const uid: string = context.auth.uid;
  const geopoint = geo.point(latitude, longitude);
  var docData: FirebaseFirestore.DocumentData | undefined;
  var stationId: string;

  return admin
    .firestore()
    .collection("Users")
    .doc(uid)
    .get()
    .then((doc) => {
      docData = doc.data();
      if (docData) {
        let prevTime = docData.update_date;
        let prevGeo = docData.geography;
        if (prevTime && prevGeo) {
          let nowDate = Timestamp.now().toDate();
          let prevDate = prevTime.toDate();
          let ms = nowDate.getTime() - prevDate.getTime();
          let hours = Math.floor(ms / (1000 * 60 * 60));
          if (hours < 24) {
            let distance = geo.distance(prevGeo, geopoint);
            if (distance < 0.01) {
              let errorMes = "同じ場所で駅をゲットできるのは24時間に1回です。";
              throw new functions.https.HttpsError("out-of-range", errorMes, {
                distance: distance,
                hours: hours,
              });
            }
          }
        }
        return lotteryStation();
      } else {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "ユーザーが不明です。"
        );
      }
    })
    .then((station_id) => {
      stationId = station_id;
      return admin.firestore().collection("Users").doc(uid).collection("stations").add({
        user_id: uid,
        station_id: stationId,
        date: Timestamp.now(),
        geography: geopoint,
      });
    })
    .then(() => {
      var stations: string[] = [];
      if (docData && docData.stations) {
        stations = docData.stations;
      }
      stations.push(stationId);
      return admin.firestore().collection("Users").doc(uid).update({
        stations: stations,
        update_date: Timestamp.now(),
        geography: geopoint,
      });
    })
    .then(() => {
      return { station_id: stationId };
    })
    .catch((error) => {
      throw new functions.https.HttpsError(
        "invalid-argument",
        error
      );
    });
});

async function lotteryStation() {
  const rate = [1000, 500, 100, 10, 2];
  const random = Math.floor(Math.random() * 1000);
  for (let i = 5; i > 0; i--) {
    if (random < rate[i - 1] || i == 1) {
      const querySnapshot = await admin
        .firestore()
        .collection("Stations")
        .where("stationLevel", "==", i)
        .get()
        .catch((err) => {
          return Promise.reject(err);
        });

      if (querySnapshot.size > 0) {
        const stnum = Math.floor(Math.random() * querySnapshot.size);
        const stationRef = querySnapshot.docs[stnum];
        return Promise.resolve(stationRef.id);
      }
    }
  }
  return Promise.reject("no station");
}
