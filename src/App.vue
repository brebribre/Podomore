<script setup lang="ts">

import { onMounted, reactive, ref } from 'vue'
import OptionButton from './components/option.vue'
import ControlButton from './components/control.vue'
import Setting from './components/setting.vue'
import { type TimerValues } from '@/types'

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
const targetHour = ref(0);
const targetMinute = ref(0);

/*SETTING*/
const settingDisplayed = ref(false);

/*TIMER*/
const minutes = ref(timer_values.PODOMORO_MINUTES);
const seconds = ref(0);
const playOrPause = ref("play.svg");
const isActive = ref(false);

/*INTERVAL*/
const interval = ref(0)

/*LIFECYCLE HOOKS*/
onMounted(() => {
  //LOAD FROM LOCAL STORAGE
  let value = localStorage.getItem("timer_values") || "err";

  console.log(JSON.parse(value))

  timer_values.PODOMORO_MINUTES = Number(JSON.parse(value).PODOMORO_MINUTES); // Update the Pomodoro minutes to 30
  timer_values.SHORT_BREAK_MINUTES = Number(JSON.parse(value).SHORT_BREAK_MINUTES); // Update the short break minutes to 7
  timer_values.LONG_BREAK_MINUTES = Number(JSON.parse(value).LONG_BREAK_MINUTES); // Update the long break minutes to 15
  timer_values.targetHour = Number(JSON.parse(value).targetHour); // Update the target hour to 12
  timer_values.targetMinute = Number(JSON.parse(value).targetMinute); // Update the target minute to 30

  if(timer_values.targetHour || timer_values.targetMinute){
    setTargetTime(timer_values.targetHour, timer_values.targetMinute)
  }
})

const addToLocalStorage =  (timeValues:TimerValues) => {
    localStorage.setItem('timer_values', JSON.stringify(timeValues));
}

const setTargetTime = (hours:number,minutes:number) => {
  timer_values.targetHour = hours;
  timer_values.targetMinute = minutes;
  targetDesc.value = timer_values.targetHour + " hours and " + timer_values.targetMinute + " minutes"
  
  addToLocalStorage(timer_values)
}

const oneDigit = (num:Number) => {
    return num.toString().length === 1
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
          return clearInterval(interval.value);
        }else{ // if not, move on to the next minute
          seconds.value = 59;
          minutes.value--;  

          //Upgrade target time
          if(targetDesc.value === "Target reached!"){
            console.log("X")
            endTarget()
          }else if(targetDesc.value != "Set a target!"){
            console.log("Y")
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
    playOrPause.value = "play.svg";
    isActive.value = false;
    clearInterval(interval.value)
  }
}

function reset(){
  playOrPause.value = "play.svg";
  isActive.value = false;
  clearInterval(interval.value);

  if(mode.value === "podomoro"){
    minutes.value = 25;
    seconds.value = 0;
  }else if(mode.value === "short"){
    minutes.value = 5;
    seconds.value = 0;
  } else if(mode.value === "long"){
    minutes.value = 10;
    seconds.value = 0;
  }
}

const toggleSetting = () => {
  settingDisplayed.value = !settingDisplayed.value;
  console.log("Clicked!")
}

const endTarget = () => {
  setTargetTime(0,0);
  targetDesc.value = "Target reached!"
}

</script>

<template>
  
  <header>
    <div class="flex-box">
      <button id="target" @click="toggleSetting">
        <img id="target-icon" src="./assets/icons/icon/target.svg" >
        <span id="target-desc">{{targetDesc}}</span>
      </button>

      <Setting @closeSetting="toggleSetting" @saveChanges="setTargetTime" v-if="settingDisplayed"/>
    </div>
    
  </header>


  <main>
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
  background:none;
  display: flex;
  flex-wrap: wrap;
  justify-content:flex-start;
  gap:0.5rem;
  align-items: center;
  padding:0.8rem;
  border:3px solid white;
  border-radius:2rem;
  margin-top: 10px;
  transition-duration: 150ms;
  cursor:pointer
}

#target:hover{
  border:3px solid rgb(220, 78, 2);
  color:black;
  background-color: rgb(220, 78, 2);
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
