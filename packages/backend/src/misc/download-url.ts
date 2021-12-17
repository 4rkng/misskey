import * as fs from 'fs';
import * as stream from 'stream';
import * as util from 'util';
import got, * as Got from 'got';
<<<<<<< HEAD
import { httpAgent, httpsAgent } from './fetch';
=======
import { httpAgent, httpsAgent, StatusError } from './fetch';
>>>>>>> a1af83c0ab30c01fa3a0990b1486987e536d46fb
import config from '@/config/index';
import * as chalk from 'chalk';
import Logger from '@/services/logger';
import * as IPCIDR from 'ip-cidr';
const PrivateIp = require('private-ip');

const pipeline = util.promisify(stream.pipeline);

export async function downloadUrl(url: string, path: string): Promise<void> {
	const logger = new Logger('download');

	logger.info(`Downloading ${chalk.cyan(url)} ...`);

	const timeout = 30 * 1000;
	const operationTimeout = 60 * 1000;
	const maxSize = config.maxFileSize || 262144000;

	const req = got.stream(url, {
		headers: {
			'User-Agent': config.userAgent,
		},
		timeout: {
			lookup: timeout,
			connect: timeout,
			secureConnect: timeout,
			socket: timeout,	// read timeout
			response: timeout,
			send: timeout,
			request: operationTimeout,	// whole operation timeout
		},
		agent: {
			http: httpAgent,
			https: httpsAgent,
		},
<<<<<<< HEAD
=======
		http2: false,	// default
>>>>>>> a1af83c0ab30c01fa3a0990b1486987e536d46fb
		retry: 0,
	}).on('response', (res: Got.Response) => {
		if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') && !config.proxy && res.ip) {
			if (isPrivateIp(res.ip)) {
				logger.warn(`Blocked address: ${res.ip}`);
				req.destroy();
			}
		}
<<<<<<< HEAD

		const contentLength = res.headers['content-length'];
		if (contentLength != null) {
			const size = Number(contentLength);
			if (size > maxSize) {
				logger.warn(`maxSize exceeded (${size} > ${maxSize}) on response`);
				req.destroy();
			}
		}
	}).on('downloadProgress', (progress: Got.Progress) => {
		if (progress.transferred > maxSize) {
			logger.warn(`maxSize exceeded (${progress.transferred} > ${maxSize}) on downloadProgress`);
			req.destroy();
		}
	}).on('error', (e: any) => {
		if (e.name === 'HTTPError') {
			const statusCode = e.response?.statusCode;
			const statusMessage = e.response?.statusMessage;
			e.name = `StatusError`;
			e.statusCode = statusCode;
			e.message = `${statusCode} ${statusMessage}`;
		}
	});

	await pipeline(req, fs.createWriteStream(path));

=======

		const contentLength = res.headers['content-length'];
		if (contentLength != null) {
			const size = Number(contentLength);
			if (size > maxSize) {
				logger.warn(`maxSize exceeded (${size} > ${maxSize}) on response`);
				req.destroy();
			}
		}
	}).on('downloadProgress', (progress: Got.Progress) => {
		if (progress.transferred > maxSize) {
			logger.warn(`maxSize exceeded (${progress.transferred} > ${maxSize}) on downloadProgress`);
			req.destroy();
		}
	});

	try {
		await pipeline(req, fs.createWriteStream(path));
	} catch (e) {
		if (e instanceof Got.HTTPError) {
			throw new StatusError(`${e.response.statusCode} ${e.response.statusMessage}`, e.response.statusCode, e.response.statusMessage);
		} else {
			throw e;
		}
	}

>>>>>>> a1af83c0ab30c01fa3a0990b1486987e536d46fb
	logger.succ(`Download finished: ${chalk.cyan(url)}`);
}

function isPrivateIp(ip: string) {
	for (const net of config.allowedPrivateNetworks || []) {
		const cidr = new IPCIDR(net);
		if (cidr.contains(ip)) {
			return false;
		}
	}

	return PrivateIp(ip);
}
