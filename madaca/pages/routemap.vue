<template>
  <v-container fluid fill-height>
    <v-layout column>
      <div class="mt-5">ろせんず</div>
      <div class="routeMap" :value="isLoaded">
        <hooper :settings="hooperSettings">
          <slide
            v-for="(item, index) in userStationIds"
            :key="item.id"
          >{{ (index + 1) + stationData(item)["name"] }}</slide>
        </hooper>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { auth } from "../plugins/firebase";
import { firestore } from "../plugins/firebase";
import { functions } from "../plugins/firebase";
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";

export default {
  name: "routeMap",
  data() {
    return {
      isLoading: false,
      isLoaded: false,
      index: 0,
      station: {
        name: "",
        yomi: "",
        userName: "",
        comment: "",
      },
      stationDatas: {},
      userStationIds: [],
      hooperSettings: {
        itemsToShow: 3,
        centerMode: false,
        pagination: false,
        infiniteScroll: true,
        vertical: true,
      },
    };
  },
  components: {
    Hooper,
    Slide,
  },
  mounted() {
    const _this = this;
    auth.onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection("Users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              _this.loadStations(doc.data());
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
      }
    });
  },
  methods: {
    stationData(stationId) {
      var station = this.stationDatas[stationId];
      return station
        ? station
        : {
            index: 0,
            name: "",
            yomi: "",
            userName: "",
            comment: "",
          };
    },
    loadStations(userDoc) {
      this.userStationIds = [userDoc.stationId];
      this.userStationIds = this.userStationIds.concat(userDoc.stations);
      this.userStationIds = this.userStationIds.reverse();

      // 重複チェック
      var stationIds = this.userStationIds.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
      this.isLoading = true;
      this.stationDatas = {};
      this.isLoaded = false;
      const _this = this;
      console.log("Start load stations.");
      firestore
        .collection("Stations")
        .where("__name__", "in", stationIds)
        .get()
        .then((snapshot) => {
          _this.isLoading = false;
          snapshot.forEach((doc) => {
            let data = doc.data();
            let station = {
              name: data.stationName,
              yomi: data.stationYomi,
              userName: data.userName,
              comment: data.aboutStation,
            };
            _this.stationDatas[doc.id] = station;
          });
          _this.isLoaded = true;
          console.log("Stations loaded.");
        })
        .catch((error) => {
          _this.isLoading = false;
          console.error("Error writing document: ", error);
        });
    },
  },
};
</script>

<style>
.hooper {
  height: 100vh;
  outline: 0 !important;
}
</style>
