import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Timestamp } from '@google-cloud/firestore';
import * as moment from "moment-timezone";

admin.initializeApp();
moment.locale("ja");
moment.tz.setDefault("Asia/Tokyo");

const runtimeOpts = { timeoutSeconds: 300 };
functions.runWith(runtimeOpts);

const geo = require('geofirex').init(admin);

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
  return admin
    .firestore()
    .collection("Users")
    .doc(uid)
    .get()
    .then((doc) => {
      var docData = doc.data();
      if (docData) {
        return lotteryStation()
          .then((station_id) => {
            var stations: string[] = [];
            if (docData && docData.stations) {
              stations = docData.stations;
            }
            stations.push(station_id);
            return admin
              .firestore()
              .collection("Users")
              .doc(uid)
              .update({
                stations: stations,
                update_date: Timestamp.now(),
                geography: geo.point(latitude, longitude),
              })
              .then(() => {
                return { station_id: station_id };
              })
              .catch((error) => {
                throw new functions.https.HttpsError(
                  "invalid-argument",
                  "uid is undefined." + error
                );
              });
          })
          .catch((error) => {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "no stations." + error
            );
          });
      } else {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "uid is undefined."
        );
      }
    })
    .catch((error) => {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "uid is undefined." + error
      );
    });
});

async function lotteryStation() {
  const rate = [100, 45, 30, 10, 1];
  const random = Math.floor(Math.random() * 100);
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
