<template>
    <div :class="['hue', directionClass]">
        <div
            class="hue-container"
            ref="wrapper"
            @mousedown="handleMouseDown"
            @touchmove="handleChange"
            @touchstart="handleChange"
        >
            <div
                class="hue-pointer"
                :style="{ top: pointerTop, left: pointerLeft }"
                role="presentation"
            >
                <div class="hue-picker"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
const enum Direction {
    /** 水平 */
    HORIZONTAL = 'horizontal',
    /** 垂直 */
    VERTICAL = 'vertical',
}
// 用户拖动方向
const enum PULL_DIRECTION {
    LEFT = 'left',
    RIGHT = 'right',
}
</script>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { formatColor, throttleHandle } from './utils';


const props = withDefaults(defineProps<{
    modelValue: ReturnType<typeof formatColor>;
    direction?: Direction;
}>(), {
    direction: Direction.HORIZONTAL,
});
const emit = defineEmits(['change']);

const pullDirection = ref('');
const colors = computed(() => props.modelValue);
watch(
    () => colors.value.hsl.h,
    (h, oldHue) => {
        if (h !== 0 && h - oldHue > 0) {
            pullDirection.value = PULL_DIRECTION.RIGHT;
        }
        if (h !== 0 && h - oldHue < 0) {
            pullDirection.value = PULL_DIRECTION.LEFT;
        }
    },
);

const directionClass = computed(() => ({
    'hue--horizontal': props.direction === Direction.HORIZONTAL,
    'hue--vertical': props.direction === Direction.VERTICAL,
}));

const pointerTop = computed(() => {
    if (props.direction === Direction.VERTICAL) {
        if (
            colors.value.hsl.h === 0 &&
            pullDirection.value === PULL_DIRECTION.RIGHT
        ) {
            return 0;
        }
        return -((colors.value.hsl.h * 100) / 360) + 100 + '%';
    } else {
        return 0;
    }
});

const pointerLeft = computed(() => {
    if (props.direction === Direction.VERTICAL) {
        return 0;
    } else {
        if (
            colors.value.hsl.h === 0 &&
            pullDirection.value === PULL_DIRECTION.RIGHT
        ) {
            return '100%';
        }
        return (colors.value.hsl.h * 100) / 360 + '%';
    }
});

const handleEmit = (h: number) => {
    throttleHandle(emit, [
        'change',
        {
            h,
            s: colors.value.hsl.s,
            l: colors.value.hsl.l,
            a: colors.value.hsl.a,
            source: 'hsl',
        },
    ]);
};

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
    const left = pageX - xOffset;
    const top = pageY - yOffset;

    let h;
    let percent;

    if (props.direction === Direction.VERTICAL) {
        if (top < 0) {
            h = 360;
        } else if (top > containerHeight) {
            h = 0;
        } else {
            percent = -((top * 100) / containerHeight) + 100;
            h = (360 * percent) / 100;
        }

        if (colors.value.hsl.h !== h) {
            handleEmit(h);
        }
    } else {
        if (left < 0) {
            h = 0;
        } else if (left > containerWidth) {
            h = 360;
        } else {
            percent = (left * 100) / containerWidth;
            h = (360 * percent) / 100;
        }

        if (colors.value.hsl.h !== h) {
            handleEmit(h);
        }
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
.hue {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border-radius: 6px;
}
.hue--horizontal {
    background: linear-gradient(
        to right,
        #f00 0%,
        #ff0 17%,
        #0f0 33%,
        #0ff 50%,
        #00f 67%,
        #f0f 83%,
        #f00 100%
    );
}
.hue--vertical {
    background: linear-gradient(
        to top,
        #f00 0%,
        #ff0 17%,
        #0f0 33%,
        #0ff 50%,
        #00f 67%,
        #f0f 83%,
        #f00 100%
    );
}
.hue-container {
    cursor: pointer;
    margin: 0 2px;
    position: relative;
    height: 100%;
}
.hue-pointer {
    z-index: 2;
    position: absolute;
}
.hue-picker {
    cursor: pointer;
    margin-top: 1px;
    background: #fff;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    transform: translate(-6px, -2px);
    background-color: rgb(248, 248, 248);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
</style>
