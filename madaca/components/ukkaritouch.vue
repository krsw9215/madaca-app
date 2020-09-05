<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <div class="arjs-loader">
      <div>読み込み中...</div>
    </div>
    <div class="close-bar">
      <v-btn width="200px" @click="closeDialog">閉じる</v-btn>
    </div>
    <a-scene
      vr-mode-ui="enabled: false;"
      renderer="logarithmicDepthBuffer: true;"
      embedded
      arjs="trackingMethod: best; sourceType: webcam;debugUIEnabled: false;"
    >
      <a-nft
        type="nft"
        markerhandler
        url="ukkaritouch"
        smooth="true"
        smoothCount="10"
        smoothTolerance=".01"
        smoothThreshold="5"
      >
        <a-entity
          gltf-model="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
          scale="5 5 5"
          position="50 150 0"
        ></a-entity>
      </a-nft>
      <a-entity camera></a-entity>
    </a-scene>
  </v-dialog>
</template>

<script>
import { auth } from "../plugins/firebase";
import { firestore } from "../plugins/firebase";
import { functions } from "../plugins/firebase";

export default {
  props: ["visible"],
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    closeDialog() {
      this.show = false;
      location.reload(true);
    },
    addStation() {
      this.isLoading = true;
      const app = this;
      const func = functions.httpsCallable("addStation");
      func()
        .then((res) => {
          let station_id = res.data.station_id;
          if (station_id) {
            firestore
              .collection("Stations")
              .doc(station_id)
              .get()
              .then((doc) => {
                app.isLoading = false;
                let newStationName = doc.data().stationName;
                alert("駅を獲得しました！:" + newStationName + "駅");
                app.closeDialog();
              })
              .catch((error) => {
                app.isLoading = false;
                console.error("Error writing document: ", error);
              });
          } else {
            app.isLoading = false;
            console.log(res.data);
          }
        })
        .catch((e) => {
          app.isLoading = false;
          console.log(e);
        });
    },
  },
  /*
  mounted() {
    AFRAME.registerComponent("markerhandler", {
      init: function () {
        this.el.sceneEl.addEventListener("markerFound", () => {
          this.addStation();
        });
      },
    });
  },
  */
};
</script>

<style>
.arjs-loader {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arjs-loader div {
  text-align: center;
  font-size: 1.25em;
  color: white;
}
#arjs-video {
  top: 80px !important;
  z-index: 999 !important;
}
.close-bar {
  position: fixed;
  height: 80px;
  width: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

body >>> .ar {
  overflow: hidden;
  margin: 0px;
}
.scene {
  z-index: 100 !important;
}
a-scene {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>