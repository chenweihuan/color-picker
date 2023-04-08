<template>
    <div class="recently-used" v-if="limitColors.length">
        <div
            class="color-item"
            v-for="color in limitColors"
            :key="color"
            :title="color"
            @click="() => $emit('change', color)"
        >
            <checkboard v-if="isAlpha(color)"></checkboard>
            <span class="forecolor" :style="{ background: color }"></span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { isAlpha } from './utils';
import checkboard from './check-board.vue';

const MAX = 16;
const KEY = 'JIMU_COLOR_PICKER';
function init() {
    let colorsCache = [];
    try {
        const cache = JSON.parse(localStorage.getItem(KEY) || '');
        if (Array.isArray(cache) && cache.every(c => typeof c === 'string')) {
            colorsCache = cache;
        }
    } catch {}
    return colorsCache;
}

const emit = defineEmits(['change']);

const colors = ref<string[]>(init());
const limitColors = computed(() => colors.value.slice(0, MAX));
watch(limitColors, newVal => localStorage.setItem(KEY, JSON.stringify(newVal)));

const unshiftColor = (color: string) => {
    colors.value = [ ...new Set([ color, ...colors.value ]) ];
};
</script>
<style lang="less" scoped>
.recently-used {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    flex-wrap: wrap;
    margin-left: -3px;
    .color-item {
        border-radius: 3px;
        overflow: hidden;
        position: relative;
        display: inline-block;
        margin: 0 0 8px 8px;
        cursor: pointer;
        width: 16px;
        height: 16px;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
    }
    .checkerboard {
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
        border-radius: 3px;
    }
    .forecolor {
        transform: translate(1px, 1px);
        display: inline-block;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
    }
}
</style>
