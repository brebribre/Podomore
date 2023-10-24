<script setup lang="ts">
import {defineProps} from "vue";
import { type TodoElement } from '@/types'

const emit = defineEmits(["deleteSelf"]);

const props = defineProps<{
  element: TodoElement,
  pos: number
}>()

const deleteSelf = () => {
  emit("deleteSelf", props.pos)
}

</script>

<template>
  <div class="todo-list">
    <div class="desc">{{ props.element.desc }}</div>
    <button class="right" @click="deleteSelf">X</button>
  </div>
</template>

<style scoped>
.todo-list{
  background-color: orange;
  border-radius: 0.5rem;
  border:0;
  margin:1.4rem 8rem;
  padding:10px;
  display: flex;
  justify-content: space-between;
}

.desc{
  color:rgb(233, 223, 223);
  font-size: 1.5rem;
}

</style>
