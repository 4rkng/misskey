import define from '../../define';
import { createExportNotesJob } from '@/queue/index';
import ms from 'ms';

export const meta = {
	secure: true,
	requireCredential: true as const,
	limit: {
		duration: ms('1day'),
		max: 1,
	},
};

// eslint-disable-next-line import/no-default-export
export default define(meta, async (ps, user) => {
	createExportNotesJob(user);
});
