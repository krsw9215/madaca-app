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
    return {
      container: null,
      scene: null,
      camera: null,
      renderer: null,
      arToolkitSource: null,
      arToolkitContext: null,
    };
  },
  methods: {
    init() {
      // set container
      this.container = this.$refs.sceneContainer;

      var clock = new THREE.Clock();

      var mixers = [];

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(new THREE.Color("lightgrey"), 0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.top = "0px";
      this.renderer.domElement.style.left = "0px";
      this.container.appendChild(this.renderer.domElement);

      // init scene and camera
      this.scene = new THREE.Scene();

      //////////////////////////////////////////////////////////////////////////////////
      //		Initialize a basic camera
      //////////////////////////////////////////////////////////////////////////////////

      // Create a camera
      this.camera = new THREE.Camera();
      this.scene.add(this.camera);

      var light = new THREE.AmbientLight(0xffffff);
      this.scene.add(light);

      ////////////////////////////////////////////////////////////////////////////////
      //          handle arToolkitSource
      ////////////////////////////////////////////////////////////////////////////////

      this.arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: "webcam",
        sourceWidth: 480,
        sourceHeight: 640,
      });

      this.arToolkitSource.init(this.onReady);

      // handle resize
      window.addEventListener("resize", this.onResize);

      // listener for end loading of NFT marker
      window.addEventListener("arjs-nft-loaded", function (ev) {
        console.log(ev);
      });

      ////////////////////////////////////////////////////////////////////////////////
      //          initialize arToolkitContext
      ////////////////////////////////////////////////////////////////////////////////

      // create atToolkitContext
      this.arToolkitContext = new THREEx.ArToolkitContext(
        {
          detectionMode: "mono",
          canvasWidth: 480,
          canvasHeight: 640,
        },
        {
          sourceWidth: 480,
          sourceHeight: 640,
        }
      );

      // initialize it
      this.arToolkitContext.init(this.onCompleted);

      ////////////////////////////////////////////////////////////////////////////////
      //          Create a ArMarkerControls
      ////////////////////////////////////////////////////////////////////////////////

      // init controls for camera
      var markerControls = new THREEx.ArMarkerControls(
        this.arToolkitContext,
        this.camera,
        {
          type: "nft",
          descriptorsUrl: "ukkaritouch",
          changeMatrixMode: "cameraTransformMatrix",
        }
      );

      this.scene.visible = false;

      var root = new THREE.Object3D();
      this.scene.add(root);

      //////////////////////////////////////////////////////////////////////////////////
      //		add an object in the scene
      //////////////////////////////////////////////////////////////////////////////////

      var threeGLTFLoader = new GLTFLoader();
      var model;

      threeGLTFLoader.load("RobotExpressive.glb", function (gltf) {
        model = gltf.scene.children[0];
        model.name = "RobotExpressive";

        var animation = gltf.animations[0];
        var mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);
        var action = mixer.clipAction(animation);
        action.play();

        root.matrixAutoUpdate = false;
        root.add(model);

        model.position.z = -200;
        model.position.x = 100;
        model.position.y = 100;

        //////////////////////////////////////////////////////////////////////////////////
        //		render the whole thing on the page
        //////////////////////////////////////////////////////////////////////////////////

        var animate = function () {
          requestAnimationFrame(animate);

          if (mixers.length > 0) {
            for (var i = 0; i < mixers.length; i++) {
              mixers[i].update(clock.getDelta());
            }
          }

          if (!this.arToolkitSource.ready) {
            return;
          }

          this.arToolkitContext.update(this.arToolkitSource.domElement);

          // update scene.visible if the marker is seen
          this.scene.visible = this.camera.visible;

          this.renderer.render(this.scene, this.camera);
        };

        requestAnimationFrame(animate);
      });
    },
    onReady() {
      // use a resize to fullscreen mobile devices
      setTimeout(this.onResize, 1000);
    },
    onCompleted() {
      // copy projection matrix to camera
      this.camera.projectionMatrix.copy(
        this.arToolkitContext.getProjectionMatrix()
      );
    },
    onResize() {
      this.arToolkitSource.onResizeElement();
      this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
      if (this.arToolkitContext.arController !== null) {
        this.arToolkitSource.copyElementSizeTo(
          this.arToolkitContext.arController.canvas
        );
      }
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#scene-container {
  height: 100%;
}
</style>