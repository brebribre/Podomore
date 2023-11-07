<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import OptionButton from './components/option.vue'
import ControlButton from './components/control.vue'
import Setting from './components/setting.vue'
import {type TimerValues} from '@/types'
import Player from '@/components/player.vue'
import finishAudio from '@/assets/audios/finish.mp3'
import video from '@/assets/videos/background-1.mp4';
import Todo from '@/components/todo.vue'

const timer_values: TimerValues = reactive({
  PODOMORO_MINUTES: 25,
  SHORT_BREAK_MINUTES: 5,
  LONG_BREAK_MINUTES: 10,
  targetHour: 0,
  targetMinute: 0
})
const addToLocalStorage = (timeValues: TimerValues) => {
  localStorage.setItem('timer_values', JSON.stringify(timeValues));
}

/*OPTIONS*/
const mode = ref("podomoro");
const setTimerMode = (param: string) => {
  mode.value = param;
  if (mode.value === "podomoro") {
    displayed_minutes.value = timer_values.PODOMORO_MINUTES;
    displayed_seconds.value = 0;
  } else if (mode.value === "short") {
    displayed_minutes.value = timer_values.SHORT_BREAK_MINUTES;
    displayed_seconds.value = 0;
  } else if (mode.value === "long") {
    displayed_minutes.value = timer_values.LONG_BREAK_MINUTES;
    displayed_seconds.value = 0;
  }
  clearInterval(interval.value);
}

const setPodomoroTime = (podomoro: number, short: number, long: number) => {
  timer_values.PODOMORO_MINUTES = podomoro;
  timer_values.SHORT_BREAK_MINUTES = short;
  timer_values.LONG_BREAK_MINUTES = long;

  displayed_minutes.value = podomoro;
  displayed_seconds.value = 0;

  addToLocalStorage(timer_values);
}

/*Target*/
const targetDesc = ref("Set a target!")
const setTargetTime = (hours: number, minutes: number) => {
  timer_values.targetHour = hours;
  timer_values.targetMinute = minutes;
  targetDesc.value = timer_values.targetHour + " hours and " + timer_values.targetMinute + " minutes"
  addToLocalStorage(timer_values);
}

const toggleTargetSetting = () => {
  settingDisplayed.value = !settingDisplayed.value;
  sectionDisplayed.value = 'target'
}

const endTarget = () => {
  setTargetTime(0, 0);
  targetDesc.value = "Target reached!"
}

/*Settings*/
const settingDisplayed = ref(false);
const sectionDisplayed = ref('target');

/*Todos*/
const todosDisplayed = ref(false);
const toggleTodos = () => {
  todosDisplayed.value = !todosDisplayed.value;
  console.log(todosDisplayed.value)
}

/*TIMER*/
const displayed_minutes = ref(timer_values.PODOMORO_MINUTES);
const displayed_seconds = ref(0);
const activeLogo = ref("play.svg");
const timerActive = ref(false);

const interval = ref(0)
const audio = new Audio(finishAudio)


onMounted(() => {
  let value = localStorage.getItem("timer_values") || "err";
  timer_values.PODOMORO_MINUTES = Number(JSON.parse(value).PODOMORO_MINUTES); // Update the Pomodoro minutes to 30
  timer_values.SHORT_BREAK_MINUTES = Number(JSON.parse(value).SHORT_BREAK_MINUTES); // Update the short break minutes to 7
  timer_values.LONG_BREAK_MINUTES = Number(JSON.parse(value).LONG_BREAK_MINUTES); // Update the long break minutes to 15
  timer_values.targetHour = Number(JSON.parse(value).targetHour); // Update the target hour to 12
  timer_values.targetMinute = Number(JSON.parse(value).targetMinute); // Update the target minute to 30

  //Set starting display and target value
  displayed_minutes.value = timer_values.PODOMORO_MINUTES;
  if (timer_values.targetHour || timer_values.targetMinute) {
    setTargetTime(timer_values.targetHour, timer_values.targetMinute)
  }
})

const setSection = (section: string) => {
  sectionDisplayed.value = section;
}

/*
  Helper Functions
*/
const stopTimer = () => {
  clearInterval(interval.value);
  activeLogo.value = "play.svg";
  timerActive.value = false;
}


const countdown = () => {
  if (activeLogo.value === "play.svg") {
    activeLogo.value = "pause.svg";
    timerActive.value = true;

    //Start interval
    interval.value = setInterval(() => {
      displayed_seconds.value--;
      if (displayed_seconds.value < 0) {
        if (displayed_minutes.value == 0) {
          displayed_seconds.value = 0;
          activeLogo.value = "play.svg";
          audio.play()
          clearInterval(interval.value)
        } else { // if not, move on to the next minute
          displayed_seconds.value = 59;
          displayed_minutes.value--;

          //Upgrade target time
          if (targetDesc.value === "Target reached!") {
            endTarget()
          } else if (targetDesc.value != "Set a target!") {
            timer_values.targetMinute--;
            if (timer_values.targetMinute < 0) {
              timer_values.targetHour--;
              timer_values.targetMinute = 59;
            }
            setTargetTime(timer_values.targetHour, timer_values.targetMinute)

            if (timer_values.targetHour < 0) {
              targetDesc.value = "Target achieved!"
              endTarget();
            }
          }
        }
      }
    }, 1000)
  } else {
    stopTimer();
  }
}


const resetTimer = () => {
  stopTimer();
  if (mode.value === "podomoro") {
    displayed_minutes.value = timer_values.PODOMORO_MINUTES;
    displayed_seconds.value = 0;
  } else if (mode.value === "short") {
    displayed_minutes.value = timer_values.SHORT_BREAK_MINUTES;
    displayed_seconds.value = 0;
  } else if (mode.value === "long") {
    displayed_minutes.value = timer_values.LONG_BREAK_MINUTES;
    displayed_seconds.value = 0;
  }
}


/*
  Helper Functions
*/
const oneDigit = (num: Number) => {
  return num.toString().length === 1
}
</script>

<template>
  <div class="background-video">
    <video autoplay loop muted>
      <source :src="video" type="video/mp4"/>
    </video>
  </div>

  <div>
    <Player/>
  </div>


  <main>
    <Todo v-if="todosDisplayed" @minimizeTodos="toggleTodos"/>
    <button class="todo-toggle" @click="toggleTodos">Todo</button>
    <div class="flex-box">
      <button id="target" @click="toggleTargetSetting">
        <img id="target-icon" alt="target-icon" src="./assets/icons/icon/target.svg">
        <span id="target-desc">{{ targetDesc }}</span>
      </button>

      <Setting
          v-if="settingDisplayed"
          :section="sectionDisplayed"
          :timer="timer_values"
          @changeSection="setSection"
          @closeSetting="toggleTargetSetting"
          @savePodomoroChanges="setPodomoroTime"
          @saveTargetChanges="setTargetTime"
      />

    </div>
    <div id="logo">
      <h1>podomore</h1>
    </div>

    <div class="wrapper">

      <div class="flex-box">
        <OptionButton :active="mode==='podomoro'" class="option" desc="podomoro" @click="setTimerMode('podomoro')"/>
        <OptionButton :active="mode==='short'" class="option" desc="short break" @click="setTimerMode('short')"/>
        <OptionButton :active="mode==='long'" class="option" desc="long break" @click="setTimerMode('long')"/>
      </div>

      <h1 class="time-display">
        {{
          oneDigit(displayed_minutes) ? "0" + displayed_minutes : displayed_minutes
        }}:{{ oneDigit(displayed_seconds) ? "0" + displayed_seconds : displayed_seconds }}
      </h1>


      <div class="flex-box control-bar">
        <ControlButton :filename="activeLogo" class="control-button" @click="countdown"/>
        <ControlButton class="control-button" filename="reset.svg" @click="resetTimer"/>
      </div>
    </div>
  </main>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap');

#logo {
  display: none;

  > h1 {
    font-size: 1.5rem;
    padding: 0;
  }
}

.wrapper {
  font-family: 'Rubik', sans-serif;
  text-align: center;
  position: absolute;
  top: 35%;
  width: 100%;

  > h1 {
    font-size: 6.2rem;
    color: whitesmoke;
    margin: 0.5rem;
  }
}

.background-video {
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

.time-display {
  padding: 0.1rem 0;
}

.flex-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}


#target {
  z-index: 100;
  background: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border: 3px solid white;
  border-radius: 2rem;
  margin-top: 20px;
  transition-duration: 150ms;
  cursor: pointer
}

#target:hover {
  border: 3px solid black;
  color: black;
  background-color: black;
  transition-duration: 150ms;
  cursor: pointer
}

#target-icon {
  width: 1.9rem;
}

#target-desc {
  font-weight: 500;
  font-size: 1.2rem;
  padding: 5px;
  color: white
}

.control-bar {
  margin: auto;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid white;
  border-radius: 2rem;
  width: 18rem;
}

.control-button {
  margin-right: 2rem;
  margin-left: 2rem;
}

.todo-toggle {
  position: absolute;
  left: 1.5rem;
  top: 1.5rem;
  background: white;
  border: 4px solid white;
  padding: 5px 15px;
  border-radius: 2rem;
  font-size: 1.7rem;
  font-weight: bold;
  color: black;
  transition-duration: 200ms;
}

.todo-toggle:hover {
  background-color: black;
  border: 4px solid black;
  color: white;
  transition-duration: 200ms;
}

@media only screen and (min-width: 480px) {
  .wrapper {
    font-family: 'Rubik', sans-serif;
    text-align: center;
    position: absolute;
    top: 35%;
    width: 100%;

    > h1 {
      font-size: 7rem;
      color: whitesmoke;
      margin: 0.5rem;
    }
  }
}

@media only screen and (min-width: 700px) {
  #logo {
    font-family: 'Rubik', sans-serif;
    color: white;
    position: absolute;
    top: 0;
    left: 2rem;
    text-align: left;

    > h1 {
      font-size: 2rem;
      padding: 0;
    }
  }
}

@media (max-width: 1100px) {
  .todo-toggle {
    display: none;
  }
}

</style>
