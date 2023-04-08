<template>
    <div class="editable-wrapper">
        <div class="editable-input">
            <span v-if="prefix" class="prefix">{{ prefix }}</span>
            <input
                :class="['input__input', prefix ? 'input__prefix' : '']"
                v-model="inputValue"
                @keydown="handleKeyDown"
                @input="handleInput"
                @blur="blur"
                ref="input"
            />
        </div>
        <span :for="label" class="input__label">{{ labelSpanText }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import { clamp } from 'lodash-es';
import { isValidColor } from './utils';
const props = withDefaults(defineProps<{
    label: string;
    modelValue: string | number;
    labelText?: string;
    max?: number;
    min?: number;
    arrowOffset?: number;
    prefix?: string;
}>(), {
    label: '',
    labelText: '',
    modelValue: '',
    arrowOffset: 1,
    prefix: '',
})
const emit = defineEmits(['change']);
const isHex = computed(() => props.label === 'hex');
const isAlpha = computed(() => props.label === 'a');
// 输入异步更新
const asyncUpdate = computed(() => isHex.value || isAlpha.value);

const limit = (num: number) => {
    return clamp(
        num,
        props.min === undefined ? -Number.MAX_VALUE : props.min,
        props.max === undefined ? Number.MAX_VALUE : props.max,
    );
};
const input = ref<HTMLInputElement | null>(null);
const inputValue = computed({
    get() {
        if (isAlpha.value) {
            return `${(Number(props.modelValue) * 100).toFixed()}%`;
        }
        return String(props.modelValue);
    },
    set(v) {
        if (asyncUpdate.value) {
            return v;
        }
        if (input.value) {
            return (input.value.value = String(limit(+input.value.value)));
        }
        return v;
    },
});
const labelSpanText = computed(() => props.labelText || props.label);

const hanldleEmit = (value: string | number) => {
    emit('change', {
        [props.label]: String(value),
    });
};
const handleInput = (e: Event) => {
    if (asyncUpdate.value) {
        return;
    }

    // 处理纯数字输入
    const value = (e.target as HTMLInputElement).value;
    const numReg = new RegExp(`^\\d+${isAlpha.value ? '%?' : ''}$`);
    if (numReg.test(value)) {
        const num = parseFloat(`${value}`);
        hanldleEmit(limit(num));
    } else {
        input.value && (input.value.value = inputValue.value);
    }
};

const blur = async (e: Event) => {
    const value = (e.target as HTMLInputElement).value;

    try {
        // 处理hex和透明度
        if (isHex.value) {
            if (isValidColor(value)) {
                hanldleEmit((e.target as HTMLInputElement).value);
                return;
            }
            throw new Error();
        } else if (isAlpha.value) {
            if (/^\d+%?$/.test(value)) {
                const alpha = parseInt(value, 10);
                hanldleEmit(limit(alpha));
                await nextTick();
                input.value && (input.value.value = inputValue.value);
                return;
            }
            throw new Error();
        }
    } catch {
        // 非法输入，还原回初始值
        input.value && (input.value.value = inputValue.value);
    }
};
const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        input.value?.blur();
        return;
    }

    const num = parseFloat(`${inputValue.value}`);
    if (!isNaN(num)) {
        const amount = props.arrowOffset;
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                hanldleEmit(limit(num + amount));
                break;
            case 'ArrowDown':
                e.preventDefault();
                hanldleEmit(limit(num - amount));
                break;
        }
    }
};
</script>
<style lang="less" scoped>
.editable-wrapper {
    .editable-input {
        display: flex;
        .prefix {
            background-color: #f5f7fa;
            color: #606266;
            border: 1px solid #d5d6d9;
            border-radius: 4px;
            padding: 0 8px;
            white-space: nowrap;
            font-size: 12px;
            border-right: 0;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            height: 21px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
        .input__prefix {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .input__input {
            padding: 0;
            border: 0;
            outline: none;
            font-size: 11px;
            color: #333;
            width: 100%;
            border-radius: 2px;
            border: none;
            box-shadow: inset 0 0 0 1px #dadada;
            height: 21px;
            text-align: center;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
    .input__label {
        text-transform: uppercase;
        font-size: 11px;
        line-height: 11px;
        color: #969696;
        text-align: center;
        display: block;
        margin-top: 12px;
    }
}
</style>
