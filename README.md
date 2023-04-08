# ColorPicker

> 使用vue3写的一个通用颜色选择器

目前实现了一个类chrome颜色选择器，下一步将写一个类figma颜色选择器。大致效果图👇：  

<img src="https://static.yximgs.com/udata/pkg/fe/color-picker.png" width="300" />

## 怎么使用?
1. 安装
```shell
npm install @wh-chen/color-picker
```
or
```shell
yarn add @wh-chen/color-picker
```

2. 全局使用
```js
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);

import colorPicker from '@wh-chen/color-picker';
app.use(colorPicker);

app.mount('#app');
```

3. 按需使用
```html
<script setup>
import { ref } from 'vue';
import { ChromeColorPicker } from '@wh-chen/color-picker';

const color = ref('#ffffff');
</script>
<template>
    <div>
        <ChromeColorPicker v-model="color"/>
    </div>
</template>
```