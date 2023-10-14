<script setup lang="ts">
import {defineProps, ref} from "vue";

const props = defineProps({
    filename: String,
   
})

const emit= defineEmits(["closeSetting"])

function clickHandler(){
    emit("closeSetting", false);
}

</script>

<template>
  <main>
    <div class="popup" >
        <p class="desc">How long do you want to study today?</p>

        <div class="time-container">
            <input class = "time-input" type="number" placeholder="hours"/>
            <input class = "time-input" type="number" placeholder="minutes"/>
            <button class="submit">
            Submit
        </button>
        </div>

        <p id="close-button" @click="clickHandler">X</p>
    </div>
  </main>
</template>

<style scoped>
.popup{
    background-color:rgb(32, 31, 31);
    border-radius : 1.2rem;
    position: absolute; 
    top: 25%;
    left: 0; 
    right: 0; 
    z-index:5;
    margin-left: auto; 
    margin-right: auto; 
    width: 25rem; /* Need a specific value to work */
    height: 18rem;
}


.desc{
    color:white;
    font-size: 1rem;
    font-weight: 600;
    text-align:center;
    margin-top: 4rem;
    margin-bottom: 1rem;
}

.time-container{
    position:absolute;
    left:0;
    right:0;
    margin-left: auto;
    margin-right: auto;
    width:100px;
    color:white;
    font-weight: 800;
}

.time-input{
    border: none;
    border-radius:0.5rem;
    background-color:white;
    padding:0.5rem;
    width:5rem;
    margin-top:10px;
}

.submit{
    width:6rem;
    margin-top: 15px;
    padding:0.4rem;
    border-radius: 0.375rem;
    border:0;
    background:orange;
    color:white;
    
}

#close-button{
    color:white;
    position:absolute;
    top:5px;
    right:20px;
}

</style>
