<template>
<button class="nrvgflfu _button" @click="toggle">
	<b>{{ modelValue ? $ts._cw.hide : $ts._cw.show }}</b>
	<span v-if="!modelValue">{{ label }}</span>
</button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { length } from 'stringz';
import * as misskey from 'misskey-js';
import { concat } from '@/scripts/array';
import { i18n } from '@/i18n';

const props = defineProps<{
	modelValue: boolean;
	note: misskey.entities.Note;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', v: boolean): void;
}>();

const label = computed(() => {
	return concat([
		props.note.text ? [i18n.t('_cw.chars', { count: length(props.note.text) })] : [],
		props.note.files && props.note.files.length !== 0 ? [i18n.t('_cw.files', { count: props.note.files.length }) ] : [],
		props.note.poll != null ? [i18n.locale.poll] : []
	] as string[][]).join(' / ');
});

const toggle = () => {
	emit('update:modelValue', !props.modelValue);
};
</script>

<style lang="scss" scoped>
.nrvgflfu {
	display: inline-block;
	padding: 4px 8px;
	font-size: 0.7em;
	color: var(--cwFg);
	background: var(--cwBg);
	border-radius: 2px;

	&:hover {
		background: var(--cwHoverBg);
	}

	> span {
		margin-left: 4px;

		&:before {
			content: '(';
		}

		&:after {
			content: ')';
		}
	}
}
</style>
