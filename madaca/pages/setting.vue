<template>
  <v-layout column justify-center align-center>
    <v-flex>
      <v-card width="300" class="mt-3">
        <v-card-title>えきを編集</v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <v-form ref="name_form">
            <v-text-field
              class="mt-2"
              v-model="stationName"
              label="えきのなまえ"
              :rules="[required, limit_name_length]"
              counter="10"
            ></v-text-field>駅
            <v-text-field
              class="mt-1"
              v-model="stationYomi"
              label="えきのふりがな"
              :rules="[required, limit_name_length]"
              counter="10"
            ></v-text-field>えき
            <v-text-field
              v-model="userName"
              class="mt-1"
              label="えきちょう"
              :rules="[required, limit_name_length]"
              counter="10"
            ></v-text-field>
            <v-textarea
              class="mt-1"
              v-model="aboutStation"
              label="えきについて"
              :rules="[required, limit_about_length]"
              placeholder="えきのとくちょうなど"
              counter="100"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text v-on:click="updateName">更新する</v-btn>
        </v-card-actions>
      </v-card>
      <v-btn class="mt-8" @click="logout">ログアウト</v-btn>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth } from "../plugins/firebase";
import { firestore } from "../plugins/firebase";

function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096]/g, function (match) {
    var chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

export default {
  name: "setting",
  data() {
    return {
      isLoading: false,
      stationName: "",
      stationYomi: "",
      userName: "",
      userNameOrg: "",
      aboutStation: "",
      errorMessage: "",
      userId: "",
      stationId: "",
      required: (value) => !!value || "必ず入力してください",
      limit_name_length: (value) =>
        value.length <= 10 || "10文字以内で入力してください",
      limit_about_length: (value) =>
        value.length <= 100 || "100文字以内で入力してください",
    };
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        firestore
          .collection("Users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
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
    nameCheck(userDoc) {
      this.userName = userDoc.userName;
      this.userNameOrg = this.userName;
      this.stationId = userDoc.stationId;

      const app = this;
      firestore
        .collection("Stations")
        .doc(userDoc.stationId)
        .get()
        .then((doc) => {
          app.stationName = doc.data().stationName;
          app.stationYomi = doc.data().stationYomi;
          app.aboutStation = doc.data().aboutStation;
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },
    updateName() {
      if (this.$refs.name_form.validate()) {
        const user = auth.currentUser;
        if (user) {
          this.isLoading = true;
          const app = this;
          const kana = hiraToKana(app.stationYomi);
          firestore
            .collection("Stations")
            .where("stationYomi", "==", kana)
            .get()
            .then((snapshot) => {
              if (snapshot.empty || snapshot.docs[0].id === this.stationId) {
                // 駅を更新
                firestore
                  .collection("Stations")
                  .doc(this.stationId)
                  .update({
                    stationName: app.stationName,
                    stationYomi: kana,
                    userName: app.userName,
                    aboutStation: app.aboutStation,
                  })
                  .then(() => {
                    // ユーザーを設定
                    if (app.userNameOrg !== app.userName) {
                      firestore
                        .collection("Users")
                        .doc(user.uid)
                        .update({
                          userName: app.userName,
                        })
                        .then(() => {
                          app.isLoading = false;
                          alert("保存しました！");
                          app.$router.replace("/");
                        })
                        .catch((error) => {
                          app.isLoading = false;
                          console.error("Error getting document:", error);
                          alert(
                            "エラーです！\nもういっかいためしてみてください。\n\n" +
                              error
                          );
                        });
                    } else {
                      app.isLoading = false;
                      alert("保存しました！");
                      app.$router.replace("/");
                    }
                  })
                  .catch((error) => {
                    app.isLoading = false;
                    console.error("Error getting document:", error);
                    alert(
                      "エラーです！\nもういっかいためしてみてください。\n\n" +
                        error
                    );
                  });
              } else {
                app.isLoading = false;
                alert(
                  "おなじなまえのえきがもうありました。。\nちがうなまえをつけてください。"
                );
                app.stationName = "";
              }
            })
            .catch((error) => {
              app.isLoading = false;
              console.error("Error getting document:", error);
              alert(
                "エラーです！\nもういっかいためしてみてください。\n\n" + error
              );
            });
        }
      }
    },
    logout() {
      auth.signOut();
    },
  },
};
</script>
