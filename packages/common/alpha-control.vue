<template>
    <div class="alpha">
        <div class="alpha-checkboard-wrap">
            <checkboard></checkboard>
        </div>
        <div class="alpha-gradient" :style="{ background: gradientColor }"></div>
        <div
            class="alpha-wrapper"
            ref="wrapper"
            @mousedown="handleMouseDown"
            @touchmove="handleChange"
            @touchstart="handleChange"
        >
            <div class="alpha-pointer" :style="{left: colors.a * 100 + '%'}">
                <div class="alpha-picker"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import checkboard from './check-board.vue';
import { throttleHandle, formatColor } from './utils';

const props = defineProps<{
    modelValue: ReturnType<typeof formatColor>;
}>();
const emit = defineEmits(['change']);

const colors = computed(() => props.modelValue);
const gradientColor = computed(() => {
    const rgba = colors.value.rgba;
    const rgbStr = [ rgba.r, rgba.g, rgba.b ].join(',');
    return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)';
});

const wrapper = ref<HTMLElement | null>(null);
const handleChange = (e: MouseEvent | TouchEvent, skip = false) => {
    !skip && e.preventDefault();
    if (!wrapper.value) {
        return;
    }
    const containerWidth = wrapper.value.clientWidth;

    const xOffset = wrapper.value.getBoundingClientRect().left + window.pageXOffset;
    // eslint-disable-next-line no-nested-ternary
    const pageX = e instanceof MouseEvent ? e.pageX : (e.touches ? e.touches[0].pageX : 0);
    const left = pageX - xOffset;

    let a;
    if (left < 0) {
        a = 0;
    } else if (left > containerWidth) {
        a = 1;
    } else {
        a = Math.round(left * 100 / containerWidth) / 100;
    }

    if (colors.value.a !== a) {
        throttleHandle(emit, [
            'change',
            {
                h: colors.value.hsl.h,
                s: colors.value.hsl.s,
                l: colors.value.hsl.l,
                a,
                source: 'rgba',
            },
        ]);
    }
};

const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleChange);
    window.removeEventListener('mouseup', handleMouseUp);
};

const handleMouseDown = (e: MouseEvent) => {
    handleChange(e, true);
    window.addEventListener('mousemove', handleChange);
    window.addEventListener('mouseup', handleMouseUp);
};
</script>

<style lang="less" scoped>
.alpha {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border-radius: 6px;
}
.alpha-checkboard-wrap {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    overflow: hidden;
    border-radius: 6px;
}
.alpha-gradient {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border-radius: 6px;
}
.alpha-wrapper {
    cursor: pointer;
    position: relative;
    z-index: 2;
    height: 100%;
    margin: 0 3px;
}
.alpha-pointer {
    z-index: 2;
    position: absolute;
}
.alpha-picker {
    cursor: pointer;
    background: #fff;
    transform: translateX(-2px);
    width: 12px;
    height: 12px;
    border-radius: 6px;
    transform: translate(-6px, -2px);
    background-color: rgb(248, 248, 248);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
</style>
