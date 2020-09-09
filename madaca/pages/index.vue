<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="mt-5">
        <v-img width="300px" :src="require('@/assets/madaca_logo.png')"></v-img>
      </div>
      <div class="text-center mt-10">
        <p>
          <v-btn width="200px" @click="showUkkariTouch">うっかりタッチ</v-btn>
        </p>
      </div>
      <div class="text-center mt-10">
        <p>
          <v-btn width="200px" @click="routeMap">ろせんず</v-btn>
        </p>
      </div>
      <div class="text-center mt-10">
        <p>
          <v-btn width="200px" @click="story">ストーリー</v-btn>
        </p>
      </div>
      <div class="text-center mt-10">
        <p>
          <v-btn width="200px" @click="howto">つかいかた</v-btn>
        </p>
      </div>
      <div class="text-center mt-10">
        <p>
          <v-btn width="200px" @click="setting">せってい</v-btn>
        </p>
      </div>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth } from "../plugins/firebase";
import { firestore } from "../plugins/firebase";
import { functions } from "../plugins/firebase";

export default {
  name: "HomePage",
  data() {
    return {
      isLoading: false,
      isRegisterd: false,
      stationName: "",
      userName: "",
    };
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection("Users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              this.createUser(user);
            } else {
              this.nameCheck(doc.data());
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
      }
    });
  },
  methods: {
    createUser(user) {
      firestore
        .collection("Users")
        .doc(user.uid)
        .set({
          stationId: null,
          userName: null,
        })
        .then((doc) => {
          console.log("Document successfully written!");
          this.nameCheck(doc.data());
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },
    nameCheck(userDoc) {
      if (!userDoc.userName || !userDoc.stationId) {
        this.isRegisterd = false;
        this.$router.replace("/register");
      } else {
        this.userName = userDoc.userName;
        const app = this;
        firestore
          .collection("Stations")
          .doc(userDoc.stationId)
          .get()
          .then((doc) => {
            app.stationName = doc.data().stationName;
            this.isRegisterd = true;
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
    },
    showUkkariTouch() {
      location.href = "/ukkaritouch.html";
    },
    routeMap() {
      this.$router.push("/routemap");
    },
    story() {
      this.$router.push("/story");
    },
    howto() {
      this.$router.push("/howto");
    },
    setting() {
      this.$router.push("/setting");
    },
  },
};
</script>
