<template>
    <div v-if="show" class="pen" @click="openEyeDropper">
        <svg
            t="1676539105327"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4319"
            width="200"
            height="200"
        >
            <path
                :d="PATH_1"
                fill="#7D7D7D"
                p-id="4320"
            />
            <path
                :d="PATH_2"
                fill="#CBCBCB"
                p-id="4321"
            />
            <path
                :d="PATH_3"
                fill="#7D7D7D"
                p-id="4322"
            />
        </svg>
    </div>
</template>
<script lang="ts" setup>
// eslint-disable-next-line max-len
const PATH_1 = 'M205.4 955.6c-39.1 0-73.7-13.4-99.2-38.8C44.6 855.2 58 741.5 136 663.5l465.4-465.4 32.5 32.5L168.7 696c-59.1 59.1-72.8 145.3-29.8 188.2 20.2 20.2 50.3 28.8 84.9 24.1 36.9-5 73.6-24.1 103.3-53.9L794 387.5l32.5 32.5-466.9 467c-36.9 36.9-82.9 60.7-129.7 67-8.3 1.1-16.5 1.6-24.5 1.6z';
// eslint-disable-next-line max-len
const PATH_2 = 'M904.2 596.2c-16.4 16.4-36.9 25.8-56.7 27.5-19.9 1.9-39-3.9-52.6-17.6l-378-377.8c-27.3-27.3-22.9-76.6 9.9-109.4 16.4-16.4 36.9-25.8 56.7-27.5 19.9-1.9 39 3.9 52.6 17.6l119.3 119.3 86.5-86.5c45.9-45.9 114.9-52.2 153.1-13.9 19.1 19.1 27.1 46 24.7 73.7-2.6 27.7-15.6 56.5-38.6 79.4l-86.5 86.5 119.3 119.3c27.6 27.4 23.1 76.6-9.7 109.4z';
// eslint-disable-next-line max-len
const PATH_3 = 'M840 647.1c-23.8 0-45.4-8.6-61.5-24.7L400.6 244.5c-36.4-36.4-31.9-100.1 9.9-141.9 19.7-19.7 44.9-31.9 71-34.2 27.5-2.6 52.7 6 70.9 24.2l103.1 103.1 70.2-70.2c55-55 138.3-61.3 185.7-13.9 23.4 23.4 34.5 56.1 31.3 92-3.2 34.5-19.3 67.7-45.2 93.7l-70.2 70.2 103.1 103.1c18.1 18.1 26.8 43.4 24.2 71-2.4 26.1-14.5 51.3-34.2 70.9-19.7 19.7-44.9 31.9-71 34.2-3.1 0.2-6.3 0.4-9.4 0.4zM490.9 114c-1.7 0-3.4 0.1-5.1 0.2-15.4 1.4-30.5 8.8-42.6 20.9-23.5 23.5-28.1 58.7-9.9 76.9l377.9 377.9c8.3 8.3 20.5 12.2 34.2 10.9 15.4-1.4 30.5-8.8 42.6-20.9 12.1-12.1 19.5-27.2 20.9-42.6 1.3-13.8-2.6-26-10.9-34.3L762.3 367.5l102.8-102.8c18.4-18.4 29.7-41.6 31.9-65.3 2-22-4.4-41.7-18-55.3-28.9-28.9-84.1-22.5-120.6 13.9L655.6 260.8 520 125.2c-7.3-7.3-17.5-11.2-29.1-11.2z';
const emit = defineEmits(['change']);

const show = 'EyeDropper' in window;
// @ts-ignore
const eyeDropper = show ? new EyeDropper() : null;
const openEyeDropper = async () => {
    if (!eyeDropper) {
        return;
    }
    try {
        const result = await eyeDropper.open();
        emit('change', {
            hex: result.sRGBHex,
            source: 'hex',
        });
    } catch (err) {
        // The user escaped the eyedropper mode.
    }
};
</script>
<style lang="less" scoped>
.pen {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    cursor: pointer;
    svg {
        width: 100%;
        height: 100%;
    }
}
</style>
