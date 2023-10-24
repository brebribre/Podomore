<script setup lang="ts">
import {defineProps, onMounted, ref, reactive} from "vue";
import { type TodoElement, type Todo } from '@/types'
import TodoList from "./todoElement.vue";

const emit = defineEmits(["minimizeTodos"]);

const input = ref("");
const todo:Todo = reactive({
  list:[]
})

const addToLocalStorage =  (todo:Todo) => {
    localStorage.setItem('todo', JSON.stringify(todo));
}

const deleteTodo = (pos:number) => {
  todo.list.splice(pos,1)
  addToLocalStorage(todo)
}

const closeHandler = () => {
  emit("minimizeTodos");
}

const updateInput = (evt:any) => {
  input.value = evt.target.value.trim();
}

const saveInput = () => {
  if(input.value.trim().length > 0){
      const newTodo:TodoElement = {
      desc: input.value,
      completed: false,
      }
      todo.list.push(newTodo);
      addToLocalStorage(todo);
      console.log("Saved!")

      input.value = "";

  }
  

}

onMounted(() => {
  let value = localStorage.getItem("todo") || "err";
  
  if(value !== "err"){
    todo.list = JSON.parse(value).list;
    console.log(todo.list)
  }else{
    todo.list = []
  }

})

</script>

<template>
  <div id="todos">
    <button class="menu-button" @click="closeHandler">&lt;</button>
    <p class="desc">What are your plans for today?</p>

    <div class="input-block">
      <input :value="input" type="text" @change="updateInput" maxlength="20" class="input"/>
      <button @click="saveInput">+</button>
    </div>
   

    <TodoList v-for="(item,index) in todo.list" :element="item" @deleteSelf="deleteTodo" :key="index" :pos="index"/>

  </div>
</template>

<style scoped>

.input{
  width:100%;
  padding-top:10px;
  padding-bottom: 10px;
  padding-left: 10px;
  border-radius: 0.5rem;
  border:0;
  font-size: 1.5rem;
}


.input-block{
  background-color: white;
  border-radius: 0.5rem;
  border:0;
  margin:1rem 8rem;
  display: flex;
  justify-content: space-between;

  >button{
    border-radius: 0.5rem;
    padding:12px;
    background-color: whitesmoke;
    border:0;

  }
}
#todos{
    position:absolute;
    top:20px;
    left:15px;
    bottom:10px;
    width: 40%;
    height: 95%;
    z-index:200;
    border-radius: 1rem;
    background-color: rgb(228, 124, 27);
    text-align: center;
}




.desc{
    padding-top: 4rem;
    color:white;
    font-weight: 600;
    font-size: 1.8rem;
}
.menu-button{
    background:0;
    border:0;
    font-size: 1.8rem;
    color:white;
    font-weight: bold;
    position: absolute;
    top:1rem;
    right:1.5rem;
    cursor:pointer;
}

</style>
