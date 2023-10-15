<script setup lang="ts">

import { watchEffect, ref, defineComponent } from 'vue'
import OptionButton from './components/option.vue'
import ControlButton from './components/control.vue'
import Setting from './components/setting.vue'

const mode = ref("podomoro");
const podomoroActive = ref(true);
const shortActive = ref(false);
const longActive = ref(false);

const PODOMORO_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 10;

const targetDesc = ref("Set a target!")
const targetHour = ref(0);
const targetMinute = ref(0);

const minutes = ref(PODOMORO_MINUTES);
const seconds = ref(0);
const playOrPause = ref("play.svg");
const isActive = ref(false);
const interval = ref(0)

const settingDisplayed = ref(false);

const oneDigit = (num:Number) => {
    return num.toString().length === 1
}

const changeMode = (param:string) => {
  mode.value = param;

  if(mode.value === "podomoro"){
    minutes.value = PODOMORO_MINUTES;
    seconds.value = 0;
    setActiveMode("podomoro");
  }else if(mode.value === "short"){
    minutes.value = SHORT_BREAK_MINUTES;
    seconds.value = 0;
    setActiveMode("short");
  } else if(mode.value === "long"){
    minutes.value = LONG_BREAK_MINUTES;
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
    playOrPause.value = "pause.svg";
    isActive.value = true;

    interval.value = setInterval(() => {
      seconds.value--;
      if(seconds.value < 0){
        
        if(minutes.value == 0){
          //timer finishes
          seconds.value = 0;
          playOrPause.value = "play.svg";
          return clearInterval(interval.value);
        }

        seconds.value = 59;
        minutes.value--;  
        
        //UPDATE TARGET TIME
        if(targetDesc.value === "Target achieved!"){
            endTarget();
        }else if(targetDesc.value != "Set a target!"){
            targetMinute.value--;
            if(targetMinute.value < 0){
                targetHour.value--;
                targetMinute.value = 59;
            }
            setTargetTime(targetHour.value, targetMinute.value)

            if(targetHour.value < 0){
              targetDesc.value = "Target achieved!"
              endTarget();
            } 
        }   
        //END TARGET TIME
        
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

const setTargetTime = (hours:number,minutes:number) => {
  console.log("received");
  targetHour.value = hours;
  targetMinute.value = minutes;
  console.log(targetHour.value)
  targetDesc.value = targetHour.value + " hours and " + targetMinute.value + " minutes"
}

const endTarget = () => {
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
      <Setting @closeSetting="toggleSetting" @saveChanges="setTargetTime" :class="settingDisplayed?'show':'hide'"/>
    </div>
    
  </header>
  <main>
    <div class="wrapper">
      <div class="flex-box">
        <OptionButton class="option" :active="podomoroActive" @click="changeMode('podomoro')" desc="podomoro" />
        <OptionButton class="option" :active="shortActive" @click="changeMode('short')" desc="short break" />
        <OptionButton class="option" :active="longActive" @click="changeMode('long')" desc="long break" />
      </div>

      <h1>
        {{ oneDigit(minutes)?"0"+ minutes:minutes  }} : {{ oneDigit(seconds)?"0"+ seconds:seconds }}
      </h1>

      <div class="flex-box control-bar">
        <ControlButton class="control-button" @click="countdown" :filename="playOrPause" />
        <ControlButton class="control-button" @click="reset" filename="reset.svg" />
      </div>
    </div>
  </main>

</template>

<style scoped>
.wrapper{
  text-align: center;
  position:absolute;
  top:35%;
  width:100%;

  > h1{
    font-size: 5rem;
    color:whitesmoke;
    margin:0.5rem;
  }

}

.show{
    display:block;
}

.hide{
    display:none;
}


#target{
  background:none;
  display: flex;
  flex-wrap: wrap;
  justify-content:flex-start;
  gap:0.5rem;
  align-items: center;
  padding:0.8rem;
  border:3px solid black;
  border-radius:2rem;
  margin-top: 10px;
  transition-duration: 150ms;
  cursor:pointer
}

#target:hover{
  border:3px solid white;
  background-color: white;
  transition-duration: 150ms;
  cursor:pointer
}

#target-icon{
  width:1.9rem;
}

#target-desc{
  font-weight:700;
  font-size: 1.2rem;
}

.flex-box{
  display: flex;
  flex-wrap:wrap;
  justify-content: center;
  align-items: center;
}

.control-bar{
  margin:auto;
  padding:0.5rem;
  background-color:white;
  border: 1px solid white; 
  border-radius: 2rem;
  width:15.6rem;
}

.control-button{
  margin-right: 2rem;
  margin-left: 2rem;
}

</style>
