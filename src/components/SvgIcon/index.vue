<template>
	<svg :style="iconStyle" :class="className" aria-hidden="true">
		<use :xlink:href="symbolId" />
	</svg>
</template>

<script setup name="SvgIcon">
import { computed } from 'vue'

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	prefix: {
		type: String,
		default: 'icon',
	},
	className: {
		type: String,
		default: '',
	},
	iconStyle: {
		type: Object,
		default: () => {
			return {}
		},
	},
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<style lang="scss" scoped>
svg {
	width: 18px;
	height: 18px;
}
</style>
