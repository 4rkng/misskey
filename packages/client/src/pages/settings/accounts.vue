<template>
<div class="_formRoot">
	<FormSuspense :p="init">
		<FormButton primary @click="addAccount"><i class="fas fa-plus"></i> {{ $ts.addAccount }}</FormButton>

		<div v-for="account in accounts" :key="account.id" class="_panel _button lcjjdxlm" @click="menu(account, $event)">
			<div class="avatar">
				<MkAvatar :user="account" class="avatar"/>
			</div>
			<div class="body">
				<div class="name">
					<MkUserName :user="account"/>
				</div>
				<div class="acct">
					<MkAcct :user="account"/>
				</div>
			</div>
		</div>
	</FormSuspense>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormSuspense from '@/components/form/suspense.vue';
import FormButton from '@/components/ui/button.vue';
import * as os from '@/os';
import * as symbols from '@/symbols';
import { getAccounts, addAccount, login } from '@/account';

export default defineComponent({
	components: {
		FormSuspense,
		FormButton,
	},

	emits: ['info'],

	data() {
		return {
			[symbols.PAGE_INFO]: {
				title: this.$ts.accounts,
				icon: 'fas fa-users',
				bg: 'var(--bg)',
			},
			storedAccounts: getAccounts().then(accounts => accounts.filter(x => x.id !== this.$i.id)),
			accounts: null,
			init: async () => os.api('users/show', {
				userIds: (await this.storedAccounts).map(x => x.id)
			}).then(accounts => {
				this.accounts = accounts;
			}),
		};
	},

	mounted() {
		this.$emit('info', this[symbols.PAGE_INFO]);
	},

	methods: {
		menu(account, ev) {
			os.popupMenu([{
				text: this.$ts.switch,
				icon: 'fas fa-exchange-alt',
				action: () => this.switchAccount(account),
			}, {
				text: this.$ts.remove,
				icon: 'fas fa-trash-alt',
				danger: true,
				action: () => this.removeAccount(account),
			}], ev.currentTarget || ev.target);
		},

		addAccount(ev) {
			os.popupMenu([{
				text: this.$ts.existingAccount,
				action: () => { this.addExistingAccount(); },
			}, {
				text: this.$ts.createAccount,
				action: () => { this.createAccount(); },
			}], ev.currentTarget || ev.target);
		},

		addExistingAccount() {
			os.popup(import('@/components/signin-dialog.vue'), {}, {
				done: res => {
					addAccount(res.id, res.i);
					os.success();
				},
			}, 'closed');
		},

		createAccount() {
			os.popup(import('@/components/signup-dialog.vue'), {}, {
				done: res => {
					addAccount(res.id, res.i);
					this.switchAccountWithToken(res.i);
				},
			}, 'closed');
		},

		async switchAccount(account: any) {
			const storedAccounts = await getAccounts();
			const token = storedAccounts.find(x => x.id === account.id).token;
			this.switchAccountWithToken(token);
		},

		switchAccountWithToken(token: string) {
			login(token);
		},
	}
});
</script>

<style lang="scss" scoped>
.lcjjdxlm {
	display: flex;
	padding: 16px;

	> .avatar {
		display: block;
		flex-shrink: 0;
		margin: 0 12px 0 0;

		> .avatar {
			width: 50px;
			height: 50px;
		}
	}

	> .body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: calc(100% - 62px);
		position: relative;

		> .name {
			font-weight: bold;
		}
	}
}
</style>
