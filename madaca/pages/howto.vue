<template>
  <div class="bg-img">
    <v-layout column justify-center align-center>
      <v-flex>
        <div class="mt-5">
          <nuxt-link to="/">
            <v-img width="300px" :src="require('@/assets/madaca_logo.png')" />
          </nuxt-link>
        </div>
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
      </v-flex>
    </v-layout>
  </div>
</template>

<style>
.bg-img {
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/background.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>
