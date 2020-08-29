<template>
  <v-layout column justify-center align-center>
    <v-flex>
      <div class="text-center">
        <p></p>
        <H2>MADACA 登録</H2>
        <p></p>
      </div>

      <v-card>
        <v-card-title>自分の駅を作ろう！</v-card-title>
        <v-card-text>
          <v-form ref="name_form">
            <v-text-field
              v-model="stationName"
              label="駅名を入力"
              :rules="[required, limit_length]"
              counter="10"
            ></v-text-field>
            <v-text-field
              v-model="userName"
              label="お名前(駅長)"
              :rules="[required, limit_length]"
              counter="10"
            ></v-text-field>
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

export default {
  name: "register",
  data() {
    return {
      isLoading: false,
      stationName: "",
      userName: "",
      errorMessage: "",
      required: (value) => !!value || "必ず入力してください",
      limit_length: (value) =>
        value.length <= 10 || `10文字以内で入力してください`,
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
          firestore
            .collection("Stations")
            .where("stationName", "==", app.stationName)
            .get()
            .then((snapshot) => {
              if (snapshot.empty) {
                // 新しい駅を作成
                firestore
                  .collection("Stations")
                  .add({
                    stationName: app.stationName,
                    userName: app.userName,
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
                          "駅が作成されました！\nうっかりタッチで駅を集めよう！"
                        );
                        app.$router.replace("/");
                      })
                      .catch((error) => {
                        app.isLoading = false;
                        console.error("Error getting document:", error);
                        alert(
                          "何かのエラーです！\nもう一度試してみてください。"
                        );
                      });
                  })
                  .catch((error) => {
                    app.isLoading = false;
                    console.error("Error getting document:", error);
                    alert("何かのエラーです！\nもう一度試してみてください。");
                  });
              } else {
                app.isLoading = false;
                alert(
                  "同名の駅がもうありました。。\n別の名前をつけてください。"
                );
                app.stationName = "";
              }
            })
            .catch((error) => {
              app.isLoading = false;
              console.error("Error getting document:", error);
              alert("何かのエラーです！\nもう一度試してみてください。");
            });
        }
      }
    },
  },
};
</script>
