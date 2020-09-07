<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <div class="close-bar">
      <v-btn width="200px" @click="closeDialog">閉じる</v-btn>
    </div>
    <ARjs />
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
    ARjs
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
