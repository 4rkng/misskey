<template>
<transition name="fade" mode="out-in">
	<MkLoading v-if="fetching"/>

	<MkError v-else-if="error" @retry="init()"/>

	<p v-else-if="empty" class="mfcuwfyp">{{ $ts.noNotifications }}</p>

	<div v-else>
		<XList v-slot="{ item: notification }" class="elsfgstc" :items="items" :no-gap="true">
			<XNote v-if="['reply', 'quote', 'mention'].includes(notification.type)" :key="notification.id" :note="notification.note" @update:note="noteUpdated(notification.note, $event)"/>
			<XNotification v-else :key="notification.id" :notification="notification" :with-time="true" :full="true" class="_panel notification"/>
		</XList>

		<MkButton v-show="more" v-appear="$store.state.enableInfiniteScroll ? fetchMore : null" primary style="margin: var(--margin) auto;" :disabled="moreFetching" :style="{ cursor: moreFetching ? 'wait' : 'pointer' }" @click="fetchMore">
			<template v-if="!moreFetching">{{ $ts.loadMore }}</template>
			<template v-if="moreFetching"><MkLoading inline/></template>
		</MkButton>
	</div>
</transition>
</template>

<script lang="ts">
import { defineComponent, PropType, markRaw } from 'vue';
import paging from '@/scripts/paging';
import XNotification from './notification.vue';
import XList from './date-separated-list.vue';
import XNote from './note.vue';
import { notificationTypes } from 'misskey-js';
import * as os from '@/os';
import { stream } from '@/stream';
import MkButton from '@/components/ui/button.vue';

export default defineComponent({
	components: {
		XNotification,
		XList,
		XNote,
		MkButton,
	},

	mixins: [
		paging({}),
	],

	props: {
		includeTypes: {
			type: Array as PropType<typeof notificationTypes[number][]>,
			required: false,
			default: null,
		},
		unreadOnly: {
			type: Boolean,
			required: false,
			default: false,
		},
	},

	data() {
		return {
			connection: null,
			pagination: {
				endpoint: 'i/notifications',
				limit: 10,
				params: () => ({
					includeTypes: this.allIncludeTypes || undefined,
					unreadOnly: this.unreadOnly,
				})
			},
		};
	},

	computed: {
		allIncludeTypes() {
			return this.includeTypes ?? notificationTypes.filter(x => !this.$i.mutingNotificationTypes.includes(x));
		}
	},

	watch: {
		includeTypes: {
			handler() {
				this.reload();
			},
			deep: true
		},
		unreadOnly: {
			handler() {
				this.reload();
			},
		},
		// TODO: vue/vuexのバグか仕様かは不明なものの、プロフィール更新するなどして $i が更新されると、
		// mutingNotificationTypes に変化が無くてもこのハンドラーが呼び出され無駄なリロードが発生するのを直す
		'$i.mutingNotificationTypes': {
			handler() {
				if (this.includeTypes === null) {
					this.reload();
				}
			},
			deep: true
		}
	},

	mounted() {
		this.connection = markRaw(stream.useChannel('main'));
		this.connection.on('notification', this.onNotification);
	},

	beforeUnmount() {
		this.connection.dispose();
	},

	methods: {
		onNotification(notification) {
			const isMuted = !this.allIncludeTypes.includes(notification.type);
			if (isMuted || document.visibilityState === 'visible') {
				stream.send('readNotification', {
					id: notification.id
				});
			}

			if (!isMuted) {
				this.prepend({
					...notification,
					isRead: document.visibilityState === 'visible'
				});
			}
		},

		noteUpdated(oldValue, newValue) {
			const i = this.items.findIndex(n => n.note === oldValue);
			this.items[i] = {
				...this.items[i],
				note: newValue
			};
		},
	}
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.125s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.mfcuwfyp {
	margin: 0;
	padding: 16px;
	text-align: center;
	color: var(--fg);
}

.elsfgstc {
	background: var(--panel);
}
</style>
