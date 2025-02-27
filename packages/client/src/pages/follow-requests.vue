<template>
<div>
	<MkPagination ref="list" :pagination="pagination" class="mk-follow-requests">
		<template #empty>
			<div class="_fullinfo">
				<img src="https://xn--931a.moe/assets/info.jpg" class="_ghost"/>
				<div>{{ $ts.noFollowRequests }}</div>
			</div>
		</template>
		<template v-slot="{items}">
			<div v-for="req in items" :key="req.id" class="user _panel">
				<MkAvatar class="avatar" :user="req.follower" :show-indicator="true"/>
				<div class="body">
					<div class="name">
						<MkA v-user-preview="req.follower.id" class="name" :to="userPage(req.follower)"><MkUserName :user="req.follower"/></MkA>
						<p class="acct">@{{ acct(req.follower) }}</p>
					</div>
					<div v-if="req.follower.description" class="description" :title="req.follower.description">
						<Mfm :text="req.follower.description" :is-note="false" :author="req.follower" :i="$i" :custom-emojis="req.follower.emojis" :plain="true" :nowrap="true"/>
					</div>
					<div class="actions">
						<button class="_button" @click="accept(req.follower)"><i class="fas fa-check"></i></button>
						<button class="_button" @click="reject(req.follower)"><i class="fas fa-times"></i></button>
					</div>
				</div>
			</div>
		</template>
	</MkPagination>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MkPagination from '@/components/ui/pagination.vue';
import { userPage, acct } from '@/filters/user';
import * as os from '@/os';
import * as symbols from '@/symbols';

export default defineComponent({
	components: {
		MkPagination
	},

	data() {
		return {
			[symbols.PAGE_INFO]: {
				title: this.$ts.followRequests,
				icon: 'fas fa-user-clock',
			},
			pagination: {
				endpoint: 'following/requests/list',
				limit: 10,
			},
		};
	},

	methods: {
		accept(user) {
			os.api('following/requests/accept', { userId: user.id }).then(() => {
				this.$refs.list.reload();
			});
		},
		reject(user) {
			os.api('following/requests/reject', { userId: user.id }).then(() => {
				this.$refs.list.reload();
			});
		},
		userPage,
		acct
	}
});
</script>

<style lang="scss" scoped>
.mk-follow-requests {
	> .user {
		display: flex;
		padding: 16px;

		> .avatar {
			display: block;
			flex-shrink: 0;
			margin: 0 12px 0 0;
			width: 42px;
			height: 42px;
			border-radius: 8px;
		}

		> .body {
			display: flex;
			width: calc(100% - 54px);
			position: relative;

			> .name {
				width: 45%;

				@media (max-width: 500px) {
					width: 100%;
				}

				> .name,
				> .acct {
					display: block;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					margin: 0;
				}

				> .name {
					font-size: 16px;
					line-height: 24px;
				}

				> .acct {
					font-size: 15px;
					line-height: 16px;
					opacity: 0.7;
				}
			}

			> .description {
				width: 55%;
				line-height: 42px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				opacity: 0.7;
				font-size: 14px;
				padding-right: 40px;
				padding-left: 8px;
				box-sizing: border-box;

				@media (max-width: 500px) {
					display: none;
				}
			}

			> .actions {
				position: absolute;
				top: 0;
				bottom: 0;
				right: 0;
				margin: auto 0;

				> button {
					padding: 12px;
				}
			}
		}
	}
}
</style>
