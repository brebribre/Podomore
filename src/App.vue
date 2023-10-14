<script setup lang="ts">
import { watchEffect, ref, defineComponent } from 'vue'
import OptionButton from './components/option.vue'
import ControlButton from './components/control.vue'

const mode = ref("podomoro");
const podomoroActive = ref(true);
const shortActive = ref(false);
const longActive = ref(false);

const minutes = ref(25);
const seconds = ref(0);
const playOrPause = ref("play.svg");
const isActive = ref(false);
const interval = ref(0)

const oneDigit = (num:Number) => {
    return num.toString().length === 1
}

const changeMode = (param:string) => {
  mode.value = param;

  if(mode.value === "podomoro"){
    minutes.value = 25;
    seconds.value = 0;
    podomoroActive.value = true;
    shortActive.value = false;
    longActive.value = false;
  }else if(mode.value === "short"){
    minutes.value = 5;
    seconds.value = 0;
    podomoroActive.value = false;
    shortActive.value = true;
    longActive.value = false;
  } else if(mode.value === "long"){
    minutes.value = 10;
    seconds.value = 0;
    podomoroActive.value = false;
    shortActive.value = false;
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


</script>

<template>
  <header>
    <div class="wrapper">
      <div class="flex-box">
        <OptionButton class="option" :active="podomoroActive" @click="changeMode('podomoro')" desc="podomoro" />
        <OptionButton class="option" :active="shortActive" @click="changeMode('short')" desc="short break" />
        <OptionButton class="option" :active="longActive" @click="changeMode('long')" desc="long break" />
      </div>
      
      <h1 class = "center">
        {{ oneDigit(minutes)?"0"+ minutes:minutes  }} : {{ oneDigit(seconds)?"0"+ seconds:seconds }}
      </h1>

      <div class="flex-box control-bar">
        <ControlButton class="control-button" @click="countdown" :filename="playOrPause" />
        <ControlButton class="control-button" @click="reset" filename="reset.svg" />
      </div>
    </div>
  </header>

  <main>
    
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

.flex-box{
  display: flex;
  flex-wrap:wrap;
  justify-content: center;
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
