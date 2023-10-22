<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";
import { type TimerValues } from '@/types'


const props = defineProps<{
  section: string
  timer: TimerValues
}>()

const emit = defineEmits(["closeSetting", "saveTargetChanges","savePodomoroChanges", "changeSection"]);

//TODO GET DEFAULT TIME FROM LOCAL STORAGE
const targetMinutes = ref(props.timer.targetMinute);
const targetHours = ref(props.timer.targetHour);
const showError = ref(false);
const displayedSection = ref(props.section)

const podomoroMinute = ref(props.timer.PODOMORO_MINUTES);
const shortMinute = ref(props.timer.SHORT_BREAK_MINUTES);
const longMinute = ref(props.timer.LONG_BREAK_MINUTES);

function clickHandler(){
    toggleError(false);
    emit("closeSetting", false);
}

function saveTargetTimeSetting(){
    if(targetHours.value < 0 || targetMinutes.value < 0){
        toggleError(true);
    }else{
        toggleError(false);
        emit("saveTargetChanges", targetHours.value, targetMinutes.value);
        clickHandler();
    } 
}

function saveStudyTimeSetting(){
    if(podomoroMinute.value < 0 || shortMinute.value < 0 || longMinute.value < 0){
        toggleError(true);
    }else{
        toggleError(false);
        emit("savePodomoroChanges", podomoroMinute.value, shortMinute.value, longMinute.value);
        clickHandler();
    } 
}

const toggleError = (isDisplayed:boolean) => {
    showError.value = isDisplayed;
}

function updateTargetHour(evt:any){
    targetHours.value = evt.target.value.trim();
}

function updateTargetMinute(evt:any){
    targetMinutes.value = evt.target.value.trim();
}

function updatePodomoroTime(evt:any){
    console.log(evt.target.value.trim())
    podomoroMinute.value = evt.target.value.trim();
}

function updateShortTime(evt:any){
    shortMinute.value = evt.target.value.trim();
}

function updateLongTime(evt:any){
    longMinute.value = evt.target.value.trim();
}

function changeSection(section:string){
    displayedSection.value = section;
    emit("changeSection", displayedSection)
}

</script>

<template>
  <main>
    <div class="popup" >
        <div class="section">
            <span @click="changeSection('target')" :class="displayedSection==='target'?'selected':''">target</span> <span>|</span>
            <span @click="changeSection('timer')" :class="displayedSection==='timer'?'selected':''">podomoro</span>
        </div>

        <div id="target" v-if="displayedSection === 'target'">
            <p class="desc">How long do you want to study today?</p>
            <div class="time-container">
                <p class="small-text">hours</p>
                <input class = "time-input" type="number" placeholder="hours" :value="targetHours" @change="updateTargetHour"/>
                <p class="small-text">minutes</p>
                <input class = "time-input" type="number" placeholder="minutes" :value="targetMinutes" @change="updateTargetMinute"/>
                <p class="small-text text-red" v-if="showError">Invalid number. Put a number above 0.</p>
                <p>
                    <button class="submit" @click="saveTargetTimeSetting">
                        Save
                    </button>
                </p>
            </div>
        </div>

        <div id="time" v-if="displayedSection === 'timer'">
            <div class="time-container">

                <p class="small-text">podomoro</p>
                <input class = "time-input" type="number" placeholder="hours" :value="podomoroMinute" @change="updatePodomoroTime"/>
                <p class="small-text">short break</p>
                <input class = "time-input" type="number" placeholder="minutes" :value="shortMinute" @change="updateShortTime"/>
                <p class="small-text">long break</p>
                <input class = "time-input" type="number" placeholder="minutes" :value="longMinute" @change="updateLongTime"/>

                <p class="small-text text-red" v-if="showError">Invalid number. Put a number above 0.</p>
                <p>
                    <button class="submit" @click="saveStudyTimeSetting">
                        Save
                    </button>
                </p>
            </div>
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

#time{
    padding-top: 1rem;
}
.small-text{
    font-size: 0.75rem;
    font-weight: 400;
    color:gray;
}

.text-red{
    color:rgb(233, 59, 59);
}

.section{
    padding-top: 2rem;
    > span{
        margin-right: 0.5rem;
        margin-left: 0.5rem;
        color:gray;
    }
}

.selected{
    text-decoration: underline;
    font-weight: 800;
}


.desc{
    color:white;
    font-size: 01rem;
    font-weight: 500;
    text-align:center;
    margin-top: 2rem;
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

/*SUBMIT*/
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
