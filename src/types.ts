import type { providers } from './constants.js';

export type MailProvider = (typeof providers)[number];

/**
 * API response format với hydra:member pattern
 */
export interface ApiResponse<T> {
	'@context'?: string;
	'@id'?: string;
	'@type'?: string;
	'hydra:member': T;
	'hydra:totalItems'?: number;
}

export type CreateInstanceOptions = {
	proxy?: string;
	provider?: MailProvider;
};

export type EmailContact = {
	address: string;
	name: string;
};

export type Attachment = {
	id: string;
	filename: string;
	contentType: string;
	disposition: string;
	transferEncoding: string;
	related: boolean;
	size: number;
	downloadUrl: string;
};

//================payload=======================//

export type CreateRandomEmailBody = {
	emailLength?: number;
	emailPrefix?: string;
	passwordLength?: number;
};

export type LoginBody = {
	email: string;
	password: string;
};

//================response======================//
export type MeResponse = {
	id: string;
	address: string;
	quota: number;
	used: number;
	isDisabled: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CreateRandomEmailResponse = {
	email?: string;
	password?: string;
	id?: string;
};

export type LoginResponse = {
	token: string;
};

export type GetMessagesResponse = {
	'@id': string;
	'@type': string;
	id: string;
	accountId: string;
	msgId: string;
	from: EmailContact;
	to: EmailContact[];
	subject: string;
	intro: string;
	seen: boolean;
	isDeleted: boolean;
	hasAttachments: boolean;
	size: number;
	downloadUrl: string;
	createdAt: string;
	updatedAt: string;
};

export type GetMessageResponse = {
	'@id': string;
	'@type': string;
	id: string;
	from: EmailContact;
	to: EmailContact[];
	cc: Record<string, string>[] | string[];
	bcc: Record<string, string>[] | string[];
	subject: string;
	seen: boolean;
	flagged: boolean;
	isDeleted: boolean;
	verifications: Record<string, string>[];
	retention: boolean;
	retentionDate: string;
	text: string;
	html: string[];
	hasAttachments: boolean;
	attachments: Attachment[];
	size: number;
	downloadUrl: string;
	createdAt: string;
	updatedAt: string;
};
