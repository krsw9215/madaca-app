<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <div class="close-bar">
      <v-btn width="200px" @click="closeDialog">閉じる</v-btn>
    </div>
    <ARjs />
    <div class="arjs-loader">
      <div class="arjs-loader-spinner"></div>
    </div>
  </v-dialog>
</template>

<script>
import ARjs from "~/components/arjs";

export default {
  props: ["visible"],
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    ARjs,
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
  },
};
</script>

<style>
.close-bar {
  position: fixed;
  height: 8%;
  width: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arjs-loader {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arjs-loader-spinner {
  z-index: 10;
  -webkit-transform: spin 1s linear infinite;
  animation: spin 1s linear infinite;
  border: 3px solid #ddd;
  border-top: 3px solid #42a5f5;
  border-radius: 50%;
  height: 75px;
  width: 75px;
}
@-webkit-keyframes spin {
  to {
    border-top-color: #42a5f5;
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spin {
  to {
    border-top-color: #42a5f5;
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
