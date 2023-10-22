<script setup lang="ts">

import Vue from 'vue'
import { onMounted, reactive, ref } from 'vue'
import OptionButton from './components/option.vue'
import ControlButton from './components/control.vue'
import Setting from './components/targetSetting.vue'
import { type TimerValues } from '@/types'
import Player from '@/components/player.vue'
import finishAudio from '@/assets/audios/finish.mp3'
import video from '@/assets/videos/background-1.mp4';


const timer_values:TimerValues = reactive({
  PODOMORO_MINUTES : 25,
  SHORT_BREAK_MINUTES : 5,
  LONG_BREAK_MINUTES : 10,
  targetHour : 0,
  targetMinute : 0
})

/*OPTIONS*/
const mode = ref("podomoro");
const podomoroActive = ref(true);
const shortActive = ref(false);
const longActive = ref(false);

/*TARGET*/
const targetDesc = ref("Set a target!")

/*SETTING*/
const settingDisplayed = ref(false);
const sectionDisplayed = ref('target');

/*TIMER*/
const minutes = ref(timer_values.PODOMORO_MINUTES);
const seconds = ref(0);
const playOrPause = ref("play.svg");
const isActive = ref(false);

/*INTERVAL*/
const interval = ref(0)

var audio = new Audio(finishAudio)

/*LIFECYCLE HOOKS*/
onMounted(() => {

  //LOAD FROM LOCAL STORAGE
  let value = localStorage.getItem("timer_values") || "err";
  timer_values.PODOMORO_MINUTES = Number(JSON.parse(value).PODOMORO_MINUTES); // Update the Pomodoro minutes to 30
  timer_values.SHORT_BREAK_MINUTES = Number(JSON.parse(value).SHORT_BREAK_MINUTES); // Update the short break minutes to 7
  timer_values.LONG_BREAK_MINUTES = Number(JSON.parse(value).LONG_BREAK_MINUTES); // Update the long break minutes to 15
  timer_values.targetHour = Number(JSON.parse(value).targetHour); // Update the target hour to 12
  timer_values.targetMinute = Number(JSON.parse(value).targetMinute); // Update the target minute to 30

  //SET STARTING DISPLAY
  minutes.value = timer_values.PODOMORO_MINUTES || 25;
  if(timer_values.targetHour || timer_values.targetMinute){
    setTargetTime(timer_values.targetHour, timer_values.targetMinute)
  }

})

const addToLocalStorage =  (timeValues:TimerValues) => {
    localStorage.setItem('timer_values', JSON.stringify(timeValues));
}

const setSection = (section:string) => {
  sectionDisplayed.value = section;
}

const setTargetTime = (hours:number,minutes:number) => {
  timer_values.targetHour = hours;
  timer_values.targetMinute = minutes;
  targetDesc.value = timer_values.targetHour + " hours and " + timer_values.targetMinute + " minutes"
  
  addToLocalStorage(timer_values);
}

const setPodomoroTime = (podomoro:number, short:number, long:number) => {
  timer_values.PODOMORO_MINUTES = podomoro;
  timer_values.SHORT_BREAK_MINUTES = short;
  timer_values.LONG_BREAK_MINUTES = long;

  minutes.value = podomoro;
  seconds.value = 0;
  
  addToLocalStorage(timer_values);
}

const changeMode = (param:string) => {
  mode.value = param;

  if(mode.value === "podomoro"){
    minutes.value = timer_values.PODOMORO_MINUTES;
    seconds.value = 0;
    setActiveMode("podomoro");
  }else if(mode.value === "short"){
    minutes.value = timer_values.SHORT_BREAK_MINUTES;
    seconds.value = 0;
    setActiveMode("short");
  } else if(mode.value === "long"){
    minutes.value = timer_values.LONG_BREAK_MINUTES;
    seconds.value = 0;
    setActiveMode("long");
  }

  clearInterval(interval.value);
}

function setActiveMode(mode:string){
  podomoroActive.value = false;
  shortActive.value = false;
  longActive.value = false;

  if(mode === "podomoro"){
    podomoroActive.value = true;
  }else if(mode === "short"){
    shortActive.value = true;
  }else if(mode === "long"){
    longActive.value = true;
  }
  
}


/*HELPER FUNCTIONS*/
const stopTimer = () => {
  clearInterval(interval.value);
  playOrPause.value = "play.svg";
  isActive.value = false;
}

const oneDigit = (num:Number) => {
    return num.toString().length === 1
}

function countdown(){ 
  
  if(playOrPause.value === "play.svg"){
    //change play symbol to pause and set timer as active
    playOrPause.value = "pause.svg";
    isActive.value = true;

    //timer plays
    interval.value = setInterval(() => {
      seconds.value--;
      if(seconds.value < 0){
        
        if(minutes.value == 0){ // check if timer should end
          seconds.value = 0;
          playOrPause.value = "play.svg";

          //END TIMER
          audio.play()
          return clearInterval(interval.value);
        }else{ // if not, move on to the next minute
          seconds.value = 59;
          minutes.value--;  

          //Upgrade target time
          if(targetDesc.value === "Target reached!"){
              endTarget()
          }else if(targetDesc.value != "Set a target!"){
              timer_values.targetMinute--;
              if(timer_values.targetMinute < 0){
                  timer_values.targetHour--;
                  timer_values.targetMinute = 59;
              }
              setTargetTime(timer_values.targetHour, timer_values.targetMinute)

              if(timer_values.targetHour < 0){
                targetDesc.value = "Target achieved!"
                endTarget();
              } 


          }  
          
        }
        
      } 
    }, 1000)

  }else{
    stopTimer();
  }
}

function reset(){
  stopTimer();

  if(mode.value === "podomoro"){
    minutes.value = timer_values.PODOMORO_MINUTES;
    seconds.value = 0;
  }else if(mode.value === "short"){
    minutes.value = timer_values.SHORT_BREAK_MINUTES;
    seconds.value = 0;
  } else if(mode.value === "long"){
    minutes.value = timer_values.LONG_BREAK_MINUTES;
    seconds.value = 0;
  }
}

const toggleTargetSetting = () => {
  settingDisplayed.value = !settingDisplayed.value;
  sectionDisplayed.value = 'target'
}

const endTarget = () => {
  setTargetTime(0,0);
  targetDesc.value = "Target reached!"
}

</script>

<template>
  <div class="background-video">
    <video autoplay loop muted>
      <source :src="video" type="video/mp4" />
    </video>
  </div>

  <div>
    <Player />
  </div>


  <main>
    <div class="flex-box">
      <button id="target" @click="toggleTargetSetting">
        <img id="target-icon" src="./assets/icons/icon/target.svg" >
        <span id="target-desc">{{targetDesc}}</span>
      </button>

      <Setting 
        @closeSetting="toggleTargetSetting" 
        @saveTargetChanges="setTargetTime" 
        @savePodomoroChanges="setPodomoroTime"
        @changeSection="setSection"
        v-if="settingDisplayed" 
        :section="sectionDisplayed"
        :timer="timer_values"
      />

    </div>
    <div id="logo">
      <h1>podomore</h1>
    </div>
    
    <div class="wrapper">
      
      <div class="flex-box">
        <OptionButton class="option" :active="podomoroActive" @click="changeMode('podomoro')" desc="podomoro" />
        <OptionButton class="option" :active="shortActive" @click="changeMode('short')" desc="short break" />
        <OptionButton class="option" :active="longActive" @click="changeMode('long')" desc="long break" />
      </div>

      <h1 class="time-display">
        {{ oneDigit(minutes)?"0"+ minutes:minutes  }}:{{ oneDigit(seconds)?"0"+ seconds:seconds }}
      </h1>
     

      <div class="flex-box control-bar">
        <ControlButton class="control-button" @click="countdown" :filename="playOrPause" />
        <ControlButton class="control-button" @click="reset" filename="reset.svg" />
      </div>
    </div>
  </main>

</template>

<style scoped>
 @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap');



#logo{
  font-family: 'Rubik', sans-serif;
  color: white;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  bottom:0;

  > h1{
    font-size: 1.5rem;
    padding:0;
  }
}

 .wrapper{
  font-family: 'Rubik', sans-serif;
  text-align: center;
  position:absolute;
  top:35%;
  width:100%;

  > h1{
    font-size: 6.2rem;
    color:whitesmoke;
    margin:0.5rem;
  }

}

@media only screen and (min-width: 480px) {
.wrapper{
  font-family: 'Rubik', sans-serif;
  text-align: center;
  position:absolute;
  top:35%;
  width:100%;

  > h1{
    font-size: 7rem;
    color:whitesmoke;
    margin:0.5rem;
  }

} 
}




@media only screen and (min-width: 700px) {
  #logo{
    font-family: 'Rubik', sans-serif;
    color: white;
    position: absolute;
    top:0;
    left:2rem;
    text-align: left;

    > h1{
      font-size: 2rem;
      padding:0;
    }
  }
}

.background-video{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.time-display{
  padding: 0.1rem 0;
}

.flex-box{
  display: flex;
  flex-wrap:wrap;
  justify-content: center;
  align-items: center;
}


#target{
  z-index: 100;
  background:none;
  display: flex;
  flex-wrap: wrap;
  justify-content:flex-start;
  gap:0.5rem;
  align-items: center;
  padding:0.5rem;
  border:3px solid white;
  border-radius:2rem;
  margin-top: 20px;
  transition-duration: 150ms;
  cursor:pointer
}

#target:hover{
  border:3px solid black;
  color:black;
  background-color: black;
  transition-duration: 150ms;
  cursor:pointer
}

#target-icon{
  width:1.9rem;
}

#target-desc{
  font-weight:500;
  font-size: 1.2rem;
  padding:5px;
  color:white
}

.control-bar{
  margin:auto;
  padding:0.5rem;
  background-color:white;
  border: 1px solid white; 
  border-radius: 2rem;
  width:18rem;
}

.control-button{
  margin-right: 2rem;
  margin-left: 2rem;
}

</style>
