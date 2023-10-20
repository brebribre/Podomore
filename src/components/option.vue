<script setup lang="ts">

const props = defineProps({
    desc: String,
    active: Boolean
})

</script>

<template>
  <main>
    <button class="option-button" :class="{active: props.active}" >
      {{desc}}
    </button>
  </main>
</template>

<style scoped>
.option-button{
    padding:0.6rem 1rem;
    font-weight: 500;
    font-size: 0.8rem;
    background:none;
    color:white;
    border: 2px solid white;
    margin-right: 5px;
    border-radius: 2rem;
    transition-duration: 200ms;
}

@media only screen and (min-width: 480px) {
  .option-button{
    padding:0.6rem 1rem;
    font-weight: 500;
    font-size: 1.1rem;
    background:none;
    color:white;
    border: 3px solid white;
    margin-right: 5px;
    border-radius: 2rem;
    transition-duration: 200ms;
  }

}

.option-button:hover{
    background-color: white;
    color:rgb(41, 41, 41);
}

.active{
  background-color: white;
  color:black
}

</style>
