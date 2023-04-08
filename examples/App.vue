<script setup>
import { ref } from 'vue';
import { ChromeColorPicker } from '../packages/index'
const color = ref('633633');
</script>

<template>
  <div>
    <ChromeColorPicker v-model="color" />
  </div>
</template>
