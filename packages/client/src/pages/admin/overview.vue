<template>
<div v-size="{ max: [740] }" class="edbbcaef">
	<div v-if="stats" class="cfcdecdf" style="margin: var(--margin)">
		<div class="number _panel">
			<div class="label">Users</div>
			<div class="value _monospace">
				{{ number(stats.originalUsersCount) }}
				<MkNumberDiff v-if="usersComparedToThePrevDay != null" v-tooltip="$ts.dayOverDayChanges" class="diff" :value="usersComparedToThePrevDay"><template #before>(</template><template #after>)</template></MkNumberDiff>
			</div>
		</div>
		<div class="number _panel">
			<div class="label">Notes</div>
			<div class="value _monospace">
				{{ number(stats.originalNotesCount) }}
				<MkNumberDiff v-if="notesComparedToThePrevDay != null" v-tooltip="$ts.dayOverDayChanges" class="diff" :value="notesComparedToThePrevDay"><template #before>(</template><template #after>)</template></MkNumberDiff>
			</div>
		</div>
	</div>

	<MkContainer :foldable="true" class="charts">
		<template #header><i class="fas fa-chart-bar"></i>{{ $ts.charts }}</template>
		<div style="padding: 12px;">
			<MkInstanceStats :chart-limit="500" :detailed="true"/>
		</div>
	</MkContainer>

	<div class="queue">
		<MkContainer :foldable="true" :thin="true" class="deliver">
			<template #header>Queue: deliver</template>
			<MkQueueChart :connection="queueStatsConnection" domain="deliver"/>
		</MkContainer>
		<MkContainer :foldable="true" :thin="true" class="inbox">
			<template #header>Queue: inbox</template>
			<MkQueueChart :connection="queueStatsConnection" domain="inbox"/>
		</MkContainer>
	</div>

		<!--<XMetrics/>-->

	<MkFolder style="margin: var(--margin)">
		<template #header><i class="fas fa-info-circle"></i> {{ $ts.info }}</template>
		<div class="cfcdecdf">
			<div class="number _panel">
				<div class="label">Misskey</div>
				<div class="value _monospace">{{ version }}</div>
			</div>
			<div v-if="serverInfo" class="number _panel">
				<div class="label">Node.js</div>
				<div class="value _monospace">{{ serverInfo.node }}</div>
			</div>
			<div v-if="serverInfo" class="number _panel">
				<div class="label">PostgreSQL</div>
				<div class="value _monospace">{{ serverInfo.psql }}</div>
			</div>
			<div v-if="serverInfo" class="number _panel">
				<div class="label">Redis</div>
				<div class="value _monospace">{{ serverInfo.redis }}</div>
			</div>
			<div class="number _panel">
				<div class="label">Vue</div>
				<div class="value _monospace">{{ vueVersion }}</div>
			</div>
		</div>
	</MkFolder>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, version as vueVersion } from 'vue';
import MkInstanceStats from '@/components/instance-stats.vue';
import MkButton from '@/components/ui/button.vue';
import MkSelect from '@/components/form/select.vue';
import MkNumberDiff from '@/components/number-diff.vue';
import MkContainer from '@/components/ui/container.vue';
import MkFolder from '@/components/ui/folder.vue';
import MkQueueChart from '@/components/queue-chart.vue';
import { version, url } from '@/config';
import bytes from '@/filters/bytes';
import number from '@/filters/number';
import XMetrics from './metrics.vue';
import * as os from '@/os';
import { stream } from '@/stream';
import * as symbols from '@/symbols';

export default defineComponent({
	components: {
		MkNumberDiff,
		MkInstanceStats,
		MkContainer,
		MkFolder,
		MkQueueChart,
		XMetrics,
	},

	emits: ['info'],

	data() {
		return {
			[symbols.PAGE_INFO]: {
				title: this.$ts.dashboard,
				icon: 'fas fa-tachometer-alt',
				bg: 'var(--bg)',
			},
			version,
			vueVersion,
			url,
			stats: null,
			meta: null,
			serverInfo: null,
			usersComparedToThePrevDay: null,
			notesComparedToThePrevDay: null,
			fetchJobs: () => os.api('admin/queue/deliver-delayed', {}),
			fetchModLogs: () => os.api('admin/show-moderation-logs', {}),
			queueStatsConnection: markRaw(stream.useChannel('queueStats')),
		}
	},

	async mounted() {
		this.$emit('info', this[symbols.PAGE_INFO]);

		os.api('meta', { detail: true }).then(meta => {
			this.meta = meta;
		});
		
		os.api('stats', {}).then(stats => {
			this.stats = stats;

			os.api('charts/users', { limit: 2, span: 'day' }).then(chart => {
				this.usersComparedToThePrevDay = this.stats.originalUsersCount - chart.local.total[1];
			});

			os.api('charts/notes', { limit: 2, span: 'day' }).then(chart => {
				this.notesComparedToThePrevDay = this.stats.originalNotesCount - chart.local.total[1];
			});
		});

		os.api('admin/server-info', {}).then(serverInfo => {
			this.serverInfo = serverInfo;
		});

		this.$nextTick(() => {
			this.queueStatsConnection.send('requestLog', {
				id: Math.random().toString().substr(2, 8),
				length: 200
			});
		});
	},

	beforeUnmount() {
		this.queueStatsConnection.dispose();
	},

	methods: {
		async showInstanceInfo(q) {
			let instance = q;
			if (typeof q === 'string') {
				instance = await os.api('federation/show-instance', {
					host: q
				});
			}
			// TODO
		},

		bytes,

		number,
	}
});
</script>

<style lang="scss" scoped>
.edbbcaef {
	.cfcdecdf {
		display: grid;
		grid-gap: 8px;
		grid-template-columns: repeat(auto-fill,minmax(150px,1fr));

		> .number {
			padding: 12px 16px;

			> .label {
				opacity: 0.7;
				font-size: 0.8em;
			}

			> .value {
				font-weight: bold;
				font-size: 1.2em;

				> .diff {
					font-size: 0.8em;
				}
			}
		}
	}

	> .charts {
		margin: var(--margin);
	}

	> .queue {
		margin: var(--margin);
		display: flex;

		> .deliver,
		> .inbox {
			flex: 1;
			width: 50%;

			&:not(:first-child) {
				margin-left: var(--margin);
			}
		}
	}

	&.max-width_740px {
		> .queue {
			display: block;

			> .deliver,
			> .inbox {
				width: 100%;

				&:not(:first-child) {
					margin-top: var(--margin);
					margin-left: 0;
				}
			}
		}
	}
}
</style>
