<template>
<div>
	<MkSpacer :content-max="1200">
		<div class="lznhrdub">
			<div v-if="tab === 'local'">
				<div v-if="meta && stats && tag == null" class="localfedi7 _block _isolated" :style="{ backgroundImage: meta.bannerUrl ? `url(${meta.bannerUrl})` : null }">
					<header><span>{{ $t('explore', { host: meta.name || 'Misskey' }) }}</span></header>
					<div><span>{{ $t('exploreUsersCount', { count: num(stats.originalUsersCount) }) }}</span></div>
				</div>

				<template v-if="tag == null">
					<MkFolder class="_gap" persist-key="explore-pinned-users">
						<template #header><i class="fas fa-bookmark fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.pinnedUsers }}</template>
						<XUserList :pagination="pinnedUsers"/>
					</MkFolder>
					<MkFolder class="_gap" persist-key="explore-popular-users">
						<template #header><i class="fas fa-chart-line fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.popularUsers }}</template>
						<XUserList :pagination="popularUsers"/>
					</MkFolder>
					<MkFolder class="_gap" persist-key="explore-recently-updated-users">
						<template #header><i class="fas fa-comment-alt fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.recentlyUpdatedUsers }}</template>
						<XUserList :pagination="recentlyUpdatedUsers"/>
					</MkFolder>
					<MkFolder class="_gap" persist-key="explore-recently-registered-users">
						<template #header><i class="fas fa-plus fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.recentlyRegisteredUsers }}</template>
						<XUserList :pagination="recentlyRegisteredUsers"/>
					</MkFolder>
				</template>
			</div>
			<div v-else-if="tab === 'remote'">
				<div v-if="tag == null" class="localfedi7 _block _isolated" :style="{ backgroundImage: `url(/client-assets/fedi.jpg)` }">
					<header><span>{{ $ts.exploreFediverse }}</span></header>
				</div>

				<MkFolder ref="tags" :foldable="true" :expanded="false" class="_gap">
					<template #header><i class="fas fa-hashtag fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.popularTags }}</template>

					<div class="vxjfqztj">
						<MkA v-for="tag in tagsLocal" :key="'local:' + tag.tag" :to="`/explore/tags/${tag.tag}`" class="local">{{ tag.tag }}</MkA>
						<MkA v-for="tag in tagsRemote" :key="'remote:' + tag.tag" :to="`/explore/tags/${tag.tag}`">{{ tag.tag }}</MkA>
					</div>
				</MkFolder>

				<MkFolder v-if="tag != null" :key="`${tag}`" class="_gap">
					<template #header><i class="fas fa-hashtag fa-fw" style="margin-right: 0.5em;"></i>{{ tag }}</template>
					<XUserList :pagination="tagUsers"/>
				</MkFolder>

				<template v-if="tag == null">
					<MkFolder class="_gap">
						<template #header><i class="fas fa-chart-line fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.popularUsers }}</template>
						<XUserList :pagination="popularUsersF"/>
					</MkFolder>
					<MkFolder class="_gap">
						<template #header><i class="fas fa-comment-alt fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.recentlyUpdatedUsers }}</template>
						<XUserList :pagination="recentlyUpdatedUsersF"/>
					</MkFolder>
					<MkFolder class="_gap">
						<template #header><i class="fas fa-rocket fa-fw" style="margin-right: 0.5em;"></i>{{ $ts.recentlyDiscoveredUsers }}</template>
						<XUserList :pagination="recentlyRegisteredUsersF"/>
					</MkFolder>
				</template>
			</div>
			<div v-else-if="tab === 'search'">
				<div class="_isolated">
					<MkInput v-model="searchQuery" :debounce="true" type="search">
						<template #prefix><i class="fas fa-search"></i></template>
						<template #label>{{ $ts.searchUser }}</template>
					</MkInput>
					<MkRadios v-model="searchOrigin">
						<option value="combined">{{ $ts.all }}</option>
						<option value="local">{{ $ts.local }}</option>
						<option value="remote">{{ $ts.remote }}</option>
					</MkRadios>
				</div>

				<XUserList v-if="searchQuery" ref="search" class="_gap" :pagination="searchPagination"/>
			</div>
		</div>
	</MkSpacer>
</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import XUserList from '@/components/user-list.vue';
import MkFolder from '@/components/ui/folder.vue';
import MkInput from '@/components/form/input.vue';
import MkRadios from '@/components/form/radios.vue';
import number from '@/filters/number';
import * as os from '@/os';
import * as symbols from '@/symbols';

export default defineComponent({
	components: {
		XUserList,
		MkFolder,
		MkInput,
		MkRadios,
	},

	props: {
		tag: {
			type: String,
			required: false
		}
	},

	data() {
		return {
			[symbols.PAGE_INFO]: computed(() => ({
				title: this.$ts.explore,
				icon: 'fas fa-hashtag',
				bg: 'var(--bg)',
				tabs: [{
					active: this.tab === 'local',
					title: this.$ts.local,
					onClick: () => { this.tab = 'local'; },
				}, {
					active: this.tab === 'remote',
					title: this.$ts.remote,
					onClick: () => { this.tab = 'remote'; },
				}, {
					active: this.tab === 'search',
					title: this.$ts.search,
					onClick: () => { this.tab = 'search'; },
				},]
			})),
			tab: 'local',
			pinnedUsers: { endpoint: 'pinned-users' },
			popularUsers: { endpoint: 'users', limit: 10, noPaging: true, params: {
				state: 'alive',
				origin: 'local',
				sort: '+follower',
			} },
			recentlyUpdatedUsers: { endpoint: 'users', limit: 10, noPaging: true, params: {
				origin: 'local',
				sort: '+updatedAt',
			} },
			recentlyRegisteredUsers: { endpoint: 'users', limit: 10, noPaging: true, params: {
				origin: 'local',
				state: 'alive',
				sort: '+createdAt',
			} },
			popularUsersF: { endpoint: 'users', limit: 10, noPaging: true, params: {
				state: 'alive',
				origin: 'remote',
				sort: '+follower',
			} },
			recentlyUpdatedUsersF: { endpoint: 'users', limit: 10, noPaging: true, params: {
				origin: 'combined',
				sort: '+updatedAt',
			} },
			recentlyRegisteredUsersF: { endpoint: 'users', limit: 10, noPaging: true, params: {
				origin: 'combined',
				sort: '+createdAt',
			} },
			searchPagination: {
				endpoint: 'users/search',
				limit: 10,
				params: computed(() => (this.searchQuery && this.searchQuery !== '') ? {
					query: this.searchQuery,
					origin: this.searchOrigin,
				} : null)
			},
			tagsLocal: [],
			tagsRemote: [],
			stats: null,
			searchQuery: null,
			searchOrigin: 'combined',
			num: number,
		};
	},

	computed: {
		meta() {
			return this.$instance;
		},
		tagUsers(): any {
			return {
				endpoint: 'hashtags/users',
				limit: 30,
				params: {
					tag: this.tag,
					origin: 'combined',
					sort: '+follower',
				}
			};
		},
	},

	watch: {
		tag() {
			if (this.$refs.tags) this.$refs.tags.toggleContent(this.tag == null);
		},
	},

	created() {
		os.api('hashtags/list', {
			sort: '+attachedLocalUsers',
			attachedToLocalUserOnly: true,
			limit: 30
		}).then(tags => {
			this.tagsLocal = tags;
		});
		os.api('hashtags/list', {
			sort: '+attachedRemoteUsers',
			attachedToRemoteUserOnly: true,
			limit: 30
		}).then(tags => {
			this.tagsRemote = tags;
		});
		os.api('stats').then(stats => {
			this.stats = stats;
		});
	},
});
</script>

<style lang="scss" scoped>
.localfedi7 {
	color: #fff;
	padding: 16px;
	height: 80px;
	background-position: 50%;
	background-size: cover;
	margin-bottom: var(--margin);

	> * {
		&:not(:last-child) {
			margin-bottom: 8px;
		}

		> span {
			display: inline-block;
			padding: 6px 8px;
			background: rgba(0, 0, 0, 0.7);
		}
	}

	> header {
		font-size: 20px;
		font-weight: bold;
	}

	> div {
		font-size: 14px;
		opacity: 0.8;
	}
}

.vxjfqztj {
	> * {
		margin-right: 16px;

		&.local {
			font-weight: bold;
		}
	}
}
</style>
