<template>
  <v-container fluid v-scroll-lock="true">
    <v-row class="pl-5 station-header">
      <v-col>
        <v-row class="pa-1">
          <v-col cols="3" class="pa-0">
            <v-card
              class="pa-1"
              tile
              outlined
              height="50"
              width="50"
              style="background-color: #fbe345"
            >
              <v-layout
                style="background-color: white; font-size:1.5em; font-weight: bold;"
                justify-center
                align-center
                fill-height
              >{{currentIndex+1}}</v-layout>
            </v-card>
          </v-col>
          <v-col cols="8" class="pa-0">
            <v-row class="pa-0">
              <v-col cols="12" class="pa-0">
                <v-layout style="color: white; font-size:0.7em;">{{station.yomi}}</v-layout>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-layout style="color: white; font-size:1.8em;">{{station.name}}駅</v-layout>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="pa-1">
          <v-col cols="12" class="pa-0">
            <v-layout style="color: white; font-size:0.9em;">エキチョウ: {{station.userName}}</v-layout>
          </v-col>
        </v-row>
        <v-row class="pa-1">
          <v-col cols="12" class="pa-0">
            <v-layout style="color: white; font-size:0.9em;">コメント: {{station.comment}}</v-layout>
            <!-- <v-layout style="color: gray; font-size:0.9em;">{{debugSlideIndex}}, {{debugIndex}}</v-layout> -->
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="hopper-back">
      <v-col>
        <div class="routeMap" :value="isLoaded">
          <hooper
            class="pt-0 pb-0"
            :settings="hooperSettings"
            @slide="onSlide"
            ref="hoopercontainer"
          >
            <slide v-for="(item, idx) in userStationIds" :key="item.id">
              <v-row
                class="pa-1"
                v-bind:style="{ 'margin-left': marginIdx(idx), 'margin-right': marginRight(idx) }"
              >
                <v-col cols="3" class="pa-2">
                  <v-card
                    class="pa-1"
                    tile
                    outlined
                    height="40"
                    width="40"
                    style="background-color: #fbe345"
                  >
                    <v-layout
                      style="background-color: white; font-weight: bold;"
                      justify-center
                      align-center
                      fill-height
                    >{{idx+1}}</v-layout>
                  </v-card>
                </v-col>
                <v-col
                  cols="9"
                  class="pa-0"
                  style="color: black;"
                  v-bind:style="{ 'font-size': fontSize(idx), 'font-weight': fontWeight(idx) }"
                >
                  <v-card class="pa-3">{{stationData(item)["name"] }}駅</v-card>
                </v-col>
              </v-row>
            </slide>
          </hooper>
        </div>
      </v-col>
    </v-row>
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
      currentIndex: 0,
      debugIndex: 0,
      debugSlideIndex: 0,
      station: {
        name: "",
        yomi: "",
        userName: "",
        comment: "",
        level: 1,
      },
      stationDatas: {},
      userStationIds: [],
      hooperSettings: {
        itemsToShow: 3,
        centerMode: true,
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
    onSlide(slider) {
      this.debugSlideIndex = slider.currentSlide;
      const idx = this.normarizeIndex(slider.currentSlide);
      this.debugIndex = idx;
      this.updateStation(idx);
    },
    normarizeIndex(slideIndex) {
      var idx = slideIndex;
      if (this.userStationIds.length > 0) {
        if (idx < 0) {
          idx = this.userStationIds.length + idx;
        }
        while (idx >= this.userStationIds.length) {
          idx = idx - this.userStationIds.length;
        }
      }
      return idx;
    },
    fontSize(idx) {
      const slideIndex = this.normarizeIndex(
        this.$refs.hoopercontainer.currentSlide
      );
      if (idx == slideIndex) {
        return "2.0em";
      } else {
        return "1.0em";
      }
    },
    fontWeight(idx) {
      const slideIndex = this.normarizeIndex(
        this.$refs.hoopercontainer.currentSlide
      );
      if (idx == slideIndex) {
        return "bold";
      } else {
        return "normal";
      }
    },
    marginIdx(idx) {
      const slideIndex = this.normarizeIndex(
        this.$refs.hoopercontainer.currentSlide
      );
      if (idx == slideIndex) {
        return "20px";
      } else {
        return "0px";
      }
    },
    marginRight(idx) {
      const slideIndex = this.normarizeIndex(
        this.$refs.hoopercontainer.currentSlide
      );
      if (idx == slideIndex) {
        return "10px";
      } else {
        return "40px";
      }
    },
    updateStation(idx) {
      console.log("index = " + idx);
      if (idx < this.userStationIds.length) {
        const stationId = this.userStationIds[idx];
        const stationData = this.stationDatas[stationId];
        if (stationData) {
          this.currentIndex = idx;
          this.station.name = stationData.name;
          this.station.yomi = stationData.yomi;
          this.station.userName = stationData.userName;
          this.station.comment = stationData.comment;
          this.station.level = stationData.level;
        }
      }
    },
    stationData(stationId) {
      const station = this.stationDatas[stationId];
      return station
        ? station
        : {
            name: "",
            yomi: "",
            userName: "",
            comment: "",
            level: 1,
          };
    },
    async loadStations(userDoc) {
      this.userStationIds = [userDoc.stationId];
      this.userStationIds = this.userStationIds.concat(userDoc.stations);

      // 重複チェック
      var stationIds = this.userStationIds.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
      this.isLoading = true;
      this.stationDatas = {};
      this.isLoaded = false;
      const _this = this;
      console.log("Start load stations.");

      var stationIndex = 0;
      var stationCount = stationIds.length;

      while (stationIndex < stationCount) {
        var tmpStaionIds = [];
        for (let i = 0; i < 10; i++) {
          if (stationIndex < stationCount) {
            tmpStaionIds.push(stationIds[stationIndex]);
            stationIndex = stationIndex + 1;
          } else {
            break;
          }
        }

        await firestore
          .collection("Stations")
          .where("__name__", "in", tmpStaionIds)
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
                level: data.stationLevel,
              };
              _this.stationDatas[doc.id] = station;
            });
          })
          .catch((error) => {
            _this.isLoading = false;
            console.error("Error writing document: ", error);
          });
      }
      this.isLoaded = true;
      this.updateStation(0);
      console.log("Stations loaded.");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 100vw !important;
  padding: 0px !important;
}
.hopper-back {
  background-image: url("~@/assets/routeback.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.hooper {
  height: 80vh;
  outline: 0 !important;
}
.station-header {
  background-color: #4a4a42;
}
</style>
