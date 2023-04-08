<template>
    <div class="checkerboard" :style="bgStyle"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = withDefaults(defineProps<{
    size?: number;
    white?: string;
    grey?: string;
}>(), {
    size: 8,
    white: '#fff',
    grey: 'e6e6e6',
})
const bgStyle = computed(() => ({
    'background-image': `url(${getCheckboard(props.white, props.grey, props.size)})`,
}));
/**
 * get base 64 data by canvas
 *
 * @param {String} c1 hex color
 * @param {String} c2 hex color
 * @param {Number} size
 */

function renderCheckboard(c1: string, c2: string, size: number) {
    // Dont Render On Server
    if (typeof document === 'undefined') {
        return null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size * 2;
    const ctx = canvas.getContext('2d');
    // If no context can be found, return early.
    if (!ctx) {
        return null;
    }
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = c2;
    ctx.fillRect(0, 0, size, size);
    ctx.translate(size, size);
    ctx.fillRect(0, 0, size, size);
    return canvas.toDataURL();
}

/**
 * get checkboard base data and cache
 *
 * @param {String} c1 hex color
 * @param {String} c2 hex color
 * @param {Number} size
 */
const _checkboardCache: Record<string, string> = {};
function getCheckboard(c1: string, c2: string, size: number) {
    const key = c1 + ',' + c2 + ',' + size;

    if (_checkboardCache[key]) {
        return _checkboardCache[key];
    } else {
        const checkboard = renderCheckboard(c1, c2, size);
        _checkboardCache[key] = checkboard;
        return checkboard;
    }
}

</script>

<style lang="less" scoped>
.checkerboard {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-size: contain;
}
</style>
