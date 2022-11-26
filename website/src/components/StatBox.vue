<script setup lang="ts"></script>

<script>
export default {
  props: {
    hue: String,
    text: String
  }
}
</script>

<template>
  <div id="box">
    <span v-if="text == ''">Lade Daten...</span>
    <span v-else>{{ text }}</span>
  </div>
</template>

<style scoped>
#box {
  background-color: hsl(v-bind(hue), 100%, 50%);
  display: grid;
  place-items: center;
  width: 350px;
  min-width: 350px;
  height: 32vh;
  max-height: 220px;
  border-radius: 10px;
  border: solid hsl(v-bind(hue), 100%, 38%) 8px;
  white-space: pre-wrap;
  text-align: center;
}

* {
  color: white;
  font-size: x-large;
  font-weight: bold;
}
</style>