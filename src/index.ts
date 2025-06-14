import type { AxiosInstance } from 'axios';
import createInstance from './api.js';
import type {
	GetMessagesResponse,
	CreateInstanceOptions,
	CreateRandomEmailBody,
	CreateRandomEmailResponse,
	LoginBody,
	LoginResponse,
	GetMessageResponse,
	MeResponse,
	ApiResponse,
} from './types.js';
import { generateRandomString } from './utils.js';

/**
 * Create new instance of CustomMailjs
 * @param {CreateInstanceOptions} options - Options to create the instance
 * @param {string} [options.provider='mail.tm'] - Mail provider, default to 'mail.tm'
 * @param {string} [options.proxy] - Proxy URL to use for requests
 * @returns {CustomMailjs} Returns a new instance of CustomMailjs
 *
 * @example
 * const mailjs = new CustomMailjs({
 *  provider: 'mail.tm',
 *  proxy: 'http://user:pass@ip:port'
 * });
 */
export class CustomMailjs {
	private api: AxiosInstance;

	/**
	 * Initialize a new CustomMailjs instance
	 *
	 * @param {CreateInstanceOptions} options - Options for creating the instance
	 */
	constructor({ provider, proxy }: CreateInstanceOptions = {}) {
		try {
			this.api = createInstance({ provider, proxy });
		} catch {
			this.api = createInstance({});
		}
	}

	/**
	 * Get all available domains
	 *
	 * @returns {Promise<string[]>} Returns a list of domains from Mail.tm
	 * @example ['punkproof.com', 'oakon.com']
	 */
	async getDomains(): Promise<string[]> {
		try {
			const res =
				await this.api.get<ApiResponse<{ domain: string }[]>>('/domains');
			return (
				res.data['hydra:member']?.map((d: { domain: string }) => d.domain) || []
			);
		} catch {
			return [];
		}
	}

	/**
	 * Create a random email account
	 *
	 * @param {Object} [params] - Options to create the email
	 * @param {number} [params.emailLength=15] - Length of the email, default to 15
	 * @param {number} [params.passwordLength=7] - Length of the password, default to 7
	 * @param {string} [params.emailPrefix] - Prefix for the email address
	 * @returns {Promise<CreateRandomEmailResponse>} The created email and password. If creation is successful, all fields will be defined. If creation fails, all fields will be undefined.
	 */
	async createRandomEmail({
		emailLength = 15,
		emailPrefix,
		passwordLength = 7,
	}: CreateRandomEmailBody = {}): Promise<CreateRandomEmailResponse> {
		const emptyResponse = {
			email: undefined,
			id: undefined,
			password: undefined,
		};

		try {
			const domains = await this.getDomains();
			if (domains.length === 0) {
				return emptyResponse;
			}

			const randomDomain = domains[Math.floor(Math.random() * domains.length)];
			const randomString = generateRandomString(
				emailPrefix
					? Math.max(emailLength - emailPrefix.length, 0)
					: emailLength,
			);

			const address = emailPrefix
				? `${emailPrefix}${randomString}@${randomDomain}`
				: `${randomString}@${randomDomain}`;

			const password = generateRandomString(passwordLength);

			const res = await this.api.post('/accounts', {
				address,
				password,
			});

			if (!res.data || !res.data.id) {
				return emptyResponse;
			}

			return {
				id: res.data.id,
				email: address,
				password,
			};
		} catch {
			return emptyResponse;
		}
	}

	/**
	 * Authenticate and get bearer token
	 *
	 * @param {Object} params - Parameters for login
	 * @param {string} params.email - Email address to login
	 * @param {string} params.password - Password to login
	 * @returns {Promise<LoginResponse>} Returns the token for authenticated requests or empty object if failed
	 */
	async login({ email, password }: LoginBody): Promise<LoginResponse> {
		try {
			const res = await this.api.post<LoginResponse>('/token', {
				address: email,
				password,
			});

			const { token } = res.data;
			if (token) {
				this.setToken(token);
				return { token };
			}
			return { token: '' };
		} catch {
			return { token: '' };
		}
	}

	/**
	 * Get all messages from the authenticated account
	 *
	 * @returns {Promise<GetMessagesResponse[]>} Returns a list of messages or empty array if failed
	 */
	async getMessages(): Promise<GetMessagesResponse[]> {
		try {
			const res =
				await this.api.get<ApiResponse<GetMessagesResponse[]>>('/messages');
			return res.data['hydra:member'] || [];
		} catch {
			return [];
		}
	}

	/**
	 * Get a specific message by ID
	 *
	 * @param {string} id - ID of the message to retrieve
	 * @returns {Promise<GetMessageResponse | null>} Returns the message details or null if failed
	 */
	async getMessage(id: string): Promise<GetMessageResponse | null> {
		try {
			if (!id) {
				return null;
			}

			const res = await this.api.get<GetMessageResponse>(`/messages/${id}`);
			return res.data;
		} catch {
			return null;
		}
	}

	/**
	 * Delete a specific message by ID
	 *
	 * @param {string} id - ID of the message to delete
	 * @returns {Promise<boolean>} Returns true on success, false on failure
	 */
	async deleteMessage(id: string): Promise<boolean> {
		try {
			if (!id) {
				return false;
			}

			await this.api.delete(`/messages/${id}`);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Delete the authenticated account by ID
	 *
	 * @param {string} id - ID of the account to delete
	 * @returns {Promise<boolean>} Returns true on success, false on failure
	 */
	async deleteAccount(id: string): Promise<boolean> {
		try {
			if (!id) {
				return false;
			}

			await this.api.delete(`/accounts/${id}`);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get the authenticated user's account details
	 *
	 * @returns {Promise<MeResponse | null>} Returns the account details of the authenticated user or null if failed
	 */
	async me(): Promise<MeResponse | null> {
		try {
			const res = await this.api.get<MeResponse>('/me');
			return res.data;
		} catch {
			return null;
		}
	}

	/**
	 * Set the authentication token for API requests
	 *
	 * @param {string} token - The authentication token
	 * @private
	 */
	private setToken(token: string): void {
		if (!token) {
			return;
		}
		this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
	}
}

export default CustomMailjs;
