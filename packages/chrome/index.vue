<template>
    <div class="color-picker">
        <div class="color-picker-saturation-wrap">
            <SaturationValue v-model="colors"></SaturationValue>
        </div>
        <div class="color-picker-body">
            <div class="color-picker-controls">
                <PickPen @change="childChange"></PickPen>
                <ColorPreview :colors="colors"></ColorPreview>
                <div class="color-picker-sliders">
                    <div class="color-picker-hue-wrap">
                        <HueControl :modelValue="colors" @change="childChange"></HueControl>
                    </div>
                    <div class="color-picker-alpha-wrap">
                        <AlphaControl :modelValue="colors" @change="childChange"></AlphaControl>
                    </div>
                </div>
            </div>
            <div class="color-picker-fields-wrap">
                <div class="color-picker-fields" v-show="fieldsIndex === 0">
                    <div class="color-picker-field" style="width: 200%">
                        <EditInput label="hex" :modelValue="colors.hex" @change="inputChange" prefix="#"></EditInput>
                    </div>
                    <div class="color-picker-field">
                        <EditInput
                            label="a"
                            :modelValue="colors.rgba.a"
                            :max="100"
                            :min="0"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                </div>
                <div class="color-picker-fields" v-show="fieldsIndex === 1">
                    <div class="color-picker-field">
                        <EditInput
                            label="r"
                            :max="255"
                            :min="0"
                            :modelValue="colors.rgba.r"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                    <div class="color-picker-field">
                        <EditInput
                            label="g"
                            :max="255"
                            :min="0"
                            :modelValue="colors.rgba.g"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                    <div class="color-picker-field">
                        <EditInput
                            label="b"
                            :max="255"
                            :min="0"
                            :modelValue="colors.rgba.b"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                    <div class="color-picker-field">
                        <EditInput
                            label="a"
                            :modelValue="colors.rgba.a"
                            :max="100"
                            :min="0"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                </div>
                <div class="color-picker-fields" v-show="fieldsIndex === 2">
                    <div class="color-picker-field">
                        <EditInput
                            label="h"
                            :max="360"
                            :min="0"
                            :modelValue="hsl.h"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                    <div class="color-picker-field">
                        <EditInput
                            label="s"
                            :max="100"
                            :min="0"
                            :modelValue="hsl.s"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                    <div class="color-picker-field">
                        <EditInput
                            label="l"
                            :max="100"
                            :min="0"
                            :modelValue="hsl.l"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                    <div class="color-picker-field">
                        <EditInput
                            label="a"
                            :modelValue="colors.rgba.a"
                            :max="100"
                            :min="0"
                            @change="inputChange"
                        ></EditInput>
                    </div>
                </div>
                <div class="color-picker-toggle-btn" @click="toggleViews">
                    <div class="color-picker-toggle-icon">
                        <svg
                            style="width:24px; height:24px"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#333"
                                d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <!-- <RecentlyUsed v-if="showUsed" ref="recentlyUsedRef" @change="childChange"></RecentlyUsed> -->
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'ChromeColorPicker',
});
</script>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import SaturationValue from '../common/saturation-value.vue';
import ColorPreview from '../common/color-preview.vue';
import HueControl from '../common/hue-control.vue';
import AlphaControl from '../common/alpha-control.vue';
import PickPen from '../common/pick-pen.vue';
import EditInput from '../common/edit-input.vue';
import RecentlyUsed from '../common/recently-used.vue';
import { formatColor, getAlpha, isAlpha } from '../common/utils';

const props = withDefaults(defineProps<{
    modelValue: string;
    showUsed?: boolean;
}>(), {
    modelValue: '',
    showUsed: true,
})
const emit = defineEmits(['input']);
const _colors = ref<ReturnType<typeof formatColor> | null>(null);
const childChange = (val: any) => {
    const color = formatColor(val);
    _colors.value = color;
    const emitValue = (color.a !== undefined && color.a < 1) ? color.hex8 : color.hex6;
    emit('input', emitValue);
};
const colors = computed({
    get() {
        return _colors.value || formatColor(props.modelValue);
    },
    set(val) {
        childChange(val);
    },
});
const hsl = computed(() => {
    const { h, s, l } = colors.value.hsl;
    return {
        h: Number(h).toFixed(),
        s: (s * 100).toFixed(),
        l: (l * 100).toFixed(),
    };
});

const fieldsIndex = ref(0);
const toggleViews = () => {
    if (fieldsIndex.value >= 2) {
        fieldsIndex.value = 0;
        return;
    }
    fieldsIndex.value ++;
};
const inputChange = (data?: Record<string, string>) => {
    if (!data) {
        return;
    }
    if (data.hex) {
        childChange({
            hex: data.hex,
            a: isAlpha(data.hex) ? getAlpha(data.hex) : colors.value.rgba.a,
            source: 'hex',
        });
    } else if (data.r || data.g || data.b || data.a) {
        childChange({
            r: data.r || colors.value.rgba.r,
            g: data.g || colors.value.rgba.g,
            b: data.b || colors.value.rgba.b,
            a: data.a ? (Number(data.a) / 100) : colors.value.rgba.a,
            source: 'rgba',
        });
    } else if (data.h || data.s || data.l) {
        const s = data.s ? (Number(data.s) / 100) : colors.value.hsl.s;
        const l = data.l ? (Number(data.l) / 100) : colors.value.hsl.l;

        childChange({
            h: data.h || colors.value.hsl.h,
            s,
            l,
            source: 'hsl',
        });
    }
};

const recentlyUsedRef = ref<typeof RecentlyUsed | null>(null);
const unshiftUsedColor = (color: string) => {
    if (!recentlyUsedRef.value) {
        return false;
    }
    (recentlyUsedRef.value as unknown as { unshiftColor: (color: string) => void }).unshiftColor(color);
    return true;
};
</script>

<style lang="less">
.color-picker {
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
    box-sizing: initial;
    width: 225px;
    font-family: Menlo;
    background-color: #fff;
}
.color-picker-controls {
    display: flex;
    align-items: center;
}
.color-picker-sliders {
    flex: 1;
}
.color-picker-fields-wrap {
    display: flex;
    padding-top: 16px;
}
.color-picker-fields {
    display: flex;
    margin-left: -6px;
    flex: 1;
}
.color-picker-field {
    padding-left: 6px;
    width: 100%;
}
.color-picker-toggle-btn {
    width: 32px;
    text-align: right;
    position: relative;
}
.color-picker-toggle-icon {
    margin-right: -4px;
    margin-top: 12px;
    cursor: pointer;
    position: relative;
    z-index: 2;
    &:hover::after {
        content: '';
        display: inline-block;
        position: absolute;
        width: 24px;
        height: 28px;
        background: #eee;
        border-radius: 4px;
        top: -2px;
        left: 12px;
        z-index: -1;
    }
}
.color-picker-hue-wrap {
    position: relative;
    height: 10px;
    margin-bottom: 8px;
}
.color-picker-alpha-wrap {
    position: relative;
    height: 10px;
}
.color-picker-body {
    padding: 16px 16px 12px;
    background-color: #fff;
}
.color-picker-saturation-wrap {
    width: 100%;
    padding-bottom: 55%;
    position: relative;
    border-radius: 2px 2px 0 0;
    overflow: hidden;
}
</style>
