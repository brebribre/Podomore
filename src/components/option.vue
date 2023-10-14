<script setup lang="ts">
const props = defineProps({
    desc: String,
    active: Boolean
})

</script>

<template>
  <main>
    <button class="option-button"
    :class="props.active ? 'active-button' : ''">{{desc}}</button>
  </main>
</template>

<style scoped>
.option-button{
    padding:0.5rem 0.7rem;
    font-weight: 500;
    background:none;
    color:white;
    border: 2px solid white;
    margin-right: 5px;
    border-radius: 1.375rem;
    transition-duration: 200ms;
  
}

.active-button{
  background-color: white;
  color:black
}

.option-button:hover{
    background-color: white;
    color:rgb(41, 41, 41);
}

</style>
