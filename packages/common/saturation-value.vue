<template>
    <div
        class="saturation"
        :style="{ background: bgColor }"
        ref="wrapper"
        @mousedown="handleMouseDown"
        @touchmove="handleChange"
        @touchstart="handleChange"
    >
        <div class="white"></div>
        <div class="black"></div>
        <div
            class="pointer"
            :style="{ top: pointerTop, left: pointerLeft }"
        >
            <div class="circle"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { clamp } from 'lodash-es';
import { formatColor, throttleHandle } from './utils';

const props = defineProps<{
    modelValue: ReturnType<typeof formatColor>;
}>();
const emit = defineEmits(['update:modelValue']);

const colors = computed(() => props.modelValue);
const bgColor = computed(() => `hsl(${colors.value.hsv.h}, 100%, 50%)`);
const pointerTop = computed(
    () => `${-(colors.value.hsv.v * 100) + 1 + 100}%`,
);
const pointerLeft = computed(() => `${colors.value.hsv.s * 100}%`);

const wrapper = ref<HTMLElement | null>(null);
const handleChange = (e: MouseEvent | TouchEvent, skip = false) => {
    !skip && e.preventDefault();
    if (!wrapper.value) {
        return;
    }
    const containerWidth = wrapper.value.clientWidth;
    const containerHeight = wrapper.value.clientHeight;

    const xOffset =
        wrapper.value.getBoundingClientRect().left + window.pageXOffset;
    const yOffset =
        wrapper.value.getBoundingClientRect().top + window.pageYOffset;
    const pageX =
        // eslint-disable-next-line no-nested-ternary
        e instanceof MouseEvent
            ? e.pageX
            : e.touches
                ? e.touches[0].pageX
                : 0;
    const pageY =
        // eslint-disable-next-line no-nested-ternary
        e instanceof MouseEvent
            ? e.pageY
            : e.touches
                ? e.touches[0].pageY
                : 0;
    const left = clamp(pageX - xOffset, 0, containerWidth);
    const top = clamp(pageY - yOffset, 0, containerHeight);
    const saturation = left / containerWidth;
    const bright = clamp(-(top / containerHeight) + 1, 0, 1);

    throttleHandle(emit, [
        'update:modelValue',
        {
            h: colors.value.hsv.h,
            s: saturation,
            v: bright,
            a: colors.value.hsv.a,
            source: 'hsva',
        },
    ]);
};

const unbindEventListeners = () => {
    window.removeEventListener('mousemove', handleChange);
    window.removeEventListener('mouseup', handleChange);
    window.removeEventListener('mouseup', unbindEventListeners);
};
const handleMouseDown = () => {
    window.addEventListener('mousemove', handleChange);
    window.addEventListener('mouseup', handleChange);
    window.addEventListener('mouseup', unbindEventListeners);
};
</script>

<style lang="less" scoped>
.saturation,
.white,
.black {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.saturation {
    .white {
        background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
    }
    .black {
        background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    }
    .pointer {
        cursor: pointer;
        position: absolute;
    }
    .circle {
        width: 12px;
        height: 12px;
        box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3),
            0 0 1px 2px rgba(0, 0, 0, 0.4);
        border-radius: 50%;
        transform: translate(-2px, -2px);
    }
}
</style>
