<template>
  <div id="scene-container" ref="sceneContainer"></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";
import Stats from "stats.js";

export default {
  name: "arjs",
  data() {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: "mediump",
    });

    const camera = new THREE.Camera();
    const light = new THREE.AmbientLight(0xffffff);
    const mixers = [];
    const clock = new THREE.Clock();

    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: "webcam",
      sourceWidth: 480,
      sourceHeight: 640,
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
      debug: true,
      detectionMode: "mono",
      cameraParametersUrl: "camera_para.dat",
      imageSmoothingEnabled: true,
      maxDetectionRate: 60,
    });

    const root = new THREE.Object3D();

    return {
      container: null,
      scene: scene,
      renderer: renderer,
      camera: camera,
      light: light,
      mixers: mixers,
      clock: clock,
      root: root,
      arToolkitSource: arToolkitSource,
      arToolkitContext: arToolkitContext,
    };
  },
  mounted() {
    this.container = this.$refs.sceneContainer;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(new THREE.Color("lightgrey"), 0);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.renderer.domElement.style.left = "0px";
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(this.camera);
    this.scene.add(this.light);
    this.scene.add(this.root);

    const _this = this;
    this.arToolkitSource.init(function onReady() {
      // use a resize to fullscreen mobile devices
      setTimeout(function () {
        _this.resize();
      }, 1000);
    });

    this.arToolkitContext.init(function onCompleted() {
      // copy projection matrix to camera
      _this.camera.projectionMatrix.copy(
        _this.arToolkitContext.getProjectionMatrix()
      );
    });

    // init controls for camera
    var markerControls = new THREEx.ArMarkerControls(
      this.arToolkitContext,
      this.camera,
      {
        type: "nft",
        descriptorsUrl: "pinball",
        changeMatrixMode: "cameraTransformMatrix",
      }
    );

    markerControls.addEventListener("getMarker", function (event) {
      console.log(event);
    });

    // handle resize
    window.addEventListener("resize", function () {
      _this.resize();
    });

    // listener for end loading of NFT marker
    window.addEventListener("arjs-nft-loaded", function (ev) {
      console.log(ev);
    });

    this.scene.visible = true;

    var threeGLTFLoader = new GLTFLoader();
    threeGLTFLoader.load("Flamingo.glb", function (gltf) {
      var model = gltf.scene.children[0];
      model.name = "Flamingo";

      var animation = gltf.animations[0];
      var mixer = new THREE.AnimationMixer(model);
      _this.mixers.push(mixer);
      var action = mixer.clipAction(animation);
      action.play();

      _this.root.matrixAutoUpdate = false;
      _this.root.add(model);

      model.position.z = -200;
      model.position.x = 0;
      model.position.y = 0;

      requestAnimationFrame(_this.animate);
    });
  },
  methods: {
    resize() {
      this.arToolkitSource.onResizeElement();
      this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
      if (this.arToolkitContext.arController !== null) {
        this.arToolkitSource.copyElementSizeTo(
          this.arToolkitContext.arController.canvas
        );
      }
    },
    animate() {
      requestAnimationFrame(this.animate);

      if (this.mixers.length > 0) {
        for (var i = 0; i < this.mixers.length; i++) {
          this.mixers[i].update(this.clock.getDelta());
        }
      }

      if (!this.arToolkitSource.ready) {
        return;
      }

      this.arToolkitContext.update(this.arToolkitSource.domElement);

      // update scene.visible if the marker is seen
      //this.scene.visible = this.camera.visible;

      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

