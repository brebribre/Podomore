<script setup lang="ts">
import {defineProps, ref} from "vue";

const props = defineProps({
    filename: String,
})

const emit = defineEmits(["closeSetting", "saveChanges"]);

const targetMinutes = ref(0);
const targetHours = ref(0);

function clickHandler(){
    emit("closeSetting", false);
}

function changeHandler(){
    emit("saveChanges", targetHours.value, targetMinutes.value);
    clickHandler();
}

function updateHour(evt:any){
    targetHours.value = evt.target.value.trim();
}

function updateMinute(evt:any){
    targetMinutes.value = evt.target.value.trim();
}

</script>

<template>
  <main>
    <div class="popup" >
        <p class="desc">How long do you want to study today?</p>

        <div class="time-container">
            <p class="small-text">hours</p>
            <input class = "time-input" type="number" placeholder="hours" :value="targetHours" @change="updateHour"/>
            
            <p class="small-text hide">Invalid number. Choose a number between 0 and 120.</p>
            <p class="small-text">minutes</p>
            
            <input class = "time-input" type="number" placeholder="minutes" :value="targetMinutes" @change="updateMinute"/>
            
            <p>
                <button class="submit" @click="changeHandler">
                    Save
                </button>
            </p>
            
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
    height: 25rem;
    text-align:center;
}

.show{
    display:block;
}

.hide{
    display:none;
}

.small-text{
    font-size: 0.75rem;
    font-weight: 400;
    color:gray;
}

.desc{
    color:white;
    font-size: 01rem;
    font-weight: 500;
    text-align:center;
    margin-top: 4rem;
}

.time-container{
    color:white;
    font-weight: 800;
}

.time-input{
    border: none;
    border-radius:0.2rem;
    background-color:white;
    padding:0.5rem;
    width:5rem;
    
}

.submit{
    width:6rem;
    padding:0.5rem 0.4rem;
    margin-top: 0.8rem;
    border-radius: 0.2rem;
    border:0;
    background:orange;
    color:white;
    cursor:pointer;
    transition-duration: 200ms;
}

.submit:hover{
    background-color:black;
    color:white;
    transition-duration: 200ms;
}

#close-button{
    color:white;
    position:absolute;
    top:5px;
    right:20px;
    cursor:pointer
}

</style>
