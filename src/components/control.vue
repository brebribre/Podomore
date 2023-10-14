<script setup lang="ts">
import {defineProps} from "vue";

const props = defineProps({
    filename: String,
})

function getImageUrl() {
  // This path must be correct for your file
  return new URL(`../assets/icons/icon/${props.filename}`, import.meta.url).toString()
}

</script>

<template>
  <main>
    <img :src="getImageUrl()" >
  </main>
</template>

<style scoped>
img{
    width:2rem;
    transition-duration: 200ms;
}
img:hover{
    transform: scale(1.1);
    transition-duration: 200ms;
}


</style>
