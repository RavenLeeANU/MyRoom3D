<template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Room } from "./components/room.ts";
import "@babylonjs/inspector";

export default defineComponent({
  name: "App",
  setup() {
    window.demo = new Room()
  },
});

</script>

<style>
#app {
  display: none;
}
</style>
