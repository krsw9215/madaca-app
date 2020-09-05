<template>
  <v-layout column justify-center align-center>
    <v-flex>
      <div class="mt-5">
        <v-img width="300px" :src="require('@/assets/madaca_logo.png')"></v-img>
      </div>
      <div class="text-center mt-1">
        <H2>登録</H2>
      </div>
      <v-card width="300" class="mt-3">
        <v-card-title>あなたのえきをつくる</v-card-title>
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
          <v-btn text v-on:click="registerName">登録する</v-btn>
        </v-card-actions>
      </v-card>

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
  name: "register",
  data() {
    return {
      isLoading: false,
      stationName: "",
      stationYomi: "",
      userName: "",
      aboutStation: "",
      errorMessage: "",
      required: (value) => !!value || "必ず入力してください",
      limit_name_length: (value) =>
        value.length <= 10 || "10文字以内で入力してください",
      limit_about_length: (value) =>
        value.length <= 100 || "100文字以内で入力してください",
    };
  },
  mounted() {
    this.isLoading = false;
  },
  methods: {
    registerName() {
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
              if (snapshot.empty) {
                // 新しい駅を作成
                firestore
                  .collection("Stations")
                  .add({
                    stationName: app.stationName,
                    stationYomi: kana,
                    userName: app.userName,
                    aboutStation: app.aboutStation,
                    stationLevel: 1,
                  })
                  .then((station) => {
                    // ユーザーを設定
                    firestore
                      .collection("Users")
                      .doc(user.uid)
                      .set({
                        stationId: station.id,
                        userName: app.userName,
                      })
                      .then(() => {
                        app.isLoading = false;
                        alert(
                          "えきができました！\nうっかりタッチでえきをあつめよう！"
                        );
                        app.$router.replace("/");
                      })
                      .catch((error) => {
                        app.isLoading = false;
                        console.error("Error getting document:", error);
                        alert(
                          "なにかのエラーです！\nもういっかいためしてみてください。"
                        );
                      });
                  })
                  .catch((error) => {
                    app.isLoading = false;
                    console.error("Error getting document:", error);
                    alert(
                      "なにかのエラーです！\nもういっかいためしてみてください。"
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
              alert("なにかのエラーです！\nもういっかいためしてみてください。");
            });
        }
      }
    },
  },
};
</script>
