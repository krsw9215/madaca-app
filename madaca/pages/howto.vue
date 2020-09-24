<template>
  <div>
    <v-layout column justify-center align-center>
      <v-flex>
        <div class="mt-10 pl-5 pr-5">
          <h2>つかいかた</h2>
          <ol type="1" class="mt-1">
            <li class="py-3">
              うっかりタッチステッカーをどこかに貼ろう！
              <br />迷惑にならないとこに！
              <br />
            </li>
            <li class="py-3">
              他の人が貼ったステッカーをみつけよう！
              <br />
            </li>
            <li class="py-3">
              スキャンして駅を集めよう！
              <br />
            </li>
          </ol>
        </div>
        <div class="mt-10" style="position: relative; padding-bottom: 56.25%">
          <iframe
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            "
            src="https://www.youtube.com/embed/lw4hmB_63qY"
            frameborder="0"
            allow="autoplay; 
    encrypted-media"
            allowfullscreen
          >
          </iframe>
        </div>
      </v-flex>
    </v-layout>
    <v-footer color="transparent">
      <v-layout class="mt-10 mb-3" justify-center align-center>
        <v-img max-width="100" :src="require('@/assets/vrlogo.png')"></v-img>
      </v-layout>
    </v-footer>
  </div>
</template>
