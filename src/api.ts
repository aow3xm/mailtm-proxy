import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { CreateInstanceOptions } from './types.js';
const createInstance = ({
	provider = 'mail.tm',
	proxy,
}: CreateInstanceOptions): AxiosInstance => {
	const httpsAgent = proxy ? new HttpsProxyAgent(proxy) : undefined;
	const instance = axios.create({
		baseURL:
			provider === 'mail.tm' ? 'https://api.mail.tm' : 'https://api.mail.gw',
		httpsAgent,
	});
	instance.interceptors.response.use(
		(res) => res,
		(err: AxiosError) => {
			if (err.response) {
				if (err.response.status >= 400 && err.response.status < 500) {
					return Promise.resolve(err.response);
				}
				const data = err.response.data;
				throw new Error(JSON.stringify(data));
			}
			return Promise.reject(err);
		},
	);
	return instance;
};

export default createInstance;
