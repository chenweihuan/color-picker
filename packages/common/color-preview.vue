<template>
    <div class="color-preview" @mouseenter="mouseenter">
        <div
            class="active-color"
            :style="{ background: activeColor }"
            @click="copyColorText"
        >
            <div class="active-color-copy">
                <svg
                    v-if="success"
                    t="1678812056517"
                    class="success-icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4486"
                    width="200"
                    height="200"
                >
                    <path
                        :d="SUCCESS_PATH"
                        fill="#ffffff"
                        p-id="4487"
                    />
                </svg>
                <svg
                    v-else
                    t="1676605838036"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5362"
                    width="200"
                    height="200"
                >
                    <path
                        :d="COPY_PATH"
                        fill="#ffffff"
                        p-id="5363"
                    />
                </svg>
            </div>
        </div>
        <checkboard></checkboard>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { copy, formatColor } from './utils';
import checkboard from './check-board.vue';
// eslint-disable-next-line max-len
const SUCCESS_PATH = 'M823.3 303.6c-12.5-12.4-32.9-12.4-45.3 0L429.1 652.5 246 459.3c-12.5-12.4-32.9-12.4-45.3 0-12.4 12.5-12.4 32.9 0 45.3l205.8 215.8c6.2 6.2 14.4 9.3 22.6 9.3 8.2 0 16.4-3.1 22.7-9.3l371.5-371.5c12.4-12.5 12.4-32.8 0-45.3z';
// eslint-disable-next-line max-len
const COPY_PATH = 'M394.666667 106.666667h448a74.666667 74.666667 0 0 1 74.666666 74.666666v448a74.666667 74.666667 0 0 1-74.666666 74.666667H394.666667a74.666667 74.666667 0 0 1-74.666667-74.666667V181.333333a74.666667 74.666667 0 0 1 74.666667-74.666666z m0 64a10.666667 10.666667 0 0 0-10.666667 10.666666v448a10.666667 10.666667 0 0 0 10.666667 10.666667h448a10.666667 10.666667 0 0 0 10.666666-10.666667V181.333333a10.666667 10.666667 0 0 0-10.666666-10.666666H394.666667z m245.333333 597.333333a32 32 0 0 1 64 0v74.666667a74.666667 74.666667 0 0 1-74.666667 74.666666H181.333333a74.666667 74.666667 0 0 1-74.666666-74.666666V394.666667a74.666667 74.666667 0 0 1 74.666666-74.666667h74.666667a32 32 0 0 1 0 64h-74.666667a10.666667 10.666667 0 0 0-10.666666 10.666667v448a10.666667 10.666667 0 0 0 10.666666 10.666666h448a10.666667 10.666667 0 0 0 10.666667-10.666666v-74.666667z';
const props = defineProps<{
    colors: ReturnType<typeof formatColor>;
}>();
const activeColor = computed(() => props.colors.hex8);

const success = ref(false);
const mouseenter = () => {
    success.value = false;
};
const copyColorText = async () => {
    try {
        const text =
            props.colors.a !== undefined && props.colors.a < 1
                ? props.colors.hex8
                : props.colors.hex6;
        await copy(text);
        success.value = true;
    } catch (e) {
        console.warn('color copy fail', e);
    }
};
</script>
<style lang="less" scoped>
.color-preview {
    position: relative;
    width: 42px;
    .checkerboard {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-size: auto;
    }
    .active-color {
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        overflow: hidden;
        z-index: 1;
        border: 1px solid #d1d1d1;
    }
    .active-color-copy {
        display: none;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        align-items: center;
        justify-content: center;
        cursor: pointer;
        svg {
            width: 50%;
            height: 50%;
            pointer-events: none;
        }
        .success-icon {
            position: relative;
            top: 1px;
        }
    }
    .active-color:hover .active-color-copy {
        display: flex;
    }
}
</style>
