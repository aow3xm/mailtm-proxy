# mailtm-proxy

A TypeScript library for interacting with temporary email services like mail.tm and mail.gw, with proxy support to bypass rate limits.

## Installation

```bash
npm install mailtm-proxy
# or
yarn add mailtm-proxy
# or
pnpm add mailtm-proxy
```

## Features

- Create random email accounts
- Login to email accounts
- View message list
- View message details
- Delete messages
- Delete email accounts
- Proxy support for requests
- Support for multiple temporary email providers (mail.tm, mail.gw)
- Support for both ESM (ES Modules) and CJS (CommonJS)

## Usage

### Initialization

#### ES Modules (ESM)

```typescript
// Using import with ESM projects
import { CustomMailjs } from 'mailtm-proxy';
// or default import
import CustomMailjs from 'mailtm-proxy';

// Initialize with default configuration (mail.tm, no proxy)
const mailjs = new CustomMailjs();
```

#### CommonJS (CJS)

```javascript
// Using require with CommonJS projects
const { CustomMailjs } = require('mailtm-proxy');
// or default import
const CustomMailjs = require('mailtm-proxy');

// Initialize with default configuration (mail.tm, no proxy)
const mailjs = new CustomMailjs();
```

#### With Custom Configuration

```typescript
// Configuration applies to both ESM and CJS
const mailjs = new CustomMailjs({
  provider: 'mail.gw', // 'mail.tm' or 'mail.gw'
  proxy: 'http://user:pass@ip:port' // Optional
});
```

### Using with TypeScript

The library includes type definitions so you can use it without installing additional @types.

```typescript
import { CustomMailjs } from 'mailtm-proxy';
import type { CreateRandomEmailResponse } from 'mailtm-proxy';

async function createEmail(): Promise<CreateRandomEmailResponse> {
  const mailjs = new CustomMailjs();
  return await mailjs.createRandomEmail();
}
```

### Create Random Email Account

```typescript
// Create email with default configuration
const account = await mailjs.createRandomEmail();
// { id: '...', email: 'random123@domain.com', password: 'abc123' }

// Or create with custom configuration
const account = await mailjs.createRandomEmail({
  emailLength: 10, // Email length (default: 15)
  passwordLength: 10, // Password length (default: 7)
  emailPrefix: 'myemail' // Prefix for email address (optional)
});
```

### Login to Account

```typescript
const { token } = await mailjs.login({
  email: 'your-email@domain.com',
  password: 'your-password'
});
```

### Get Message List

```typescript
const messages = await mailjs.getMessages();
```

### View Message Details

```typescript
const messageDetails = await mailjs.getMessage('message-id');
```

### Delete Message

```typescript
await mailjs.deleteMessage('message-id');
```

### Delete Account

```typescript
await mailjs.deleteAccount('account-id');
```

### Get Current Account Information

```typescript
const accountInfo = await mailjs.me();
```

## Node.js Compatibility

This library is bundled to support both modern and older environments:

- **ES Modules**: For modern projects, Node.js >= 14
- **CommonJS**: Backward compatibility with older Node.js versions

The package automatically detects and selects the appropriate format based on how you import/require it.

## API Reference

### CustomMailjs

#### constructor(options)

Initialize a new instance of CustomMailjs.

| Parameter | Type | Description |
|---------|------|-------|
| options | Object | Configuration options |
| options.provider | string | Mail service provider ('mail.tm' or 'mail.gw'), default: 'mail.tm' |
| options.proxy | string | Proxy URL to use for requests (optional) |

#### getDomains()

Get a list of available domains.

**Returns**: `Promise<string[]>` - List of domains.

#### createRandomEmail(params)

Create a random email account.

| Parameter | Type | Description |
|---------|------|-------|
| params | Object | Options |
| params.emailLength | number | Email length, default: 15 |
| params.passwordLength | number | Password length, default: 7 |
| params.emailPrefix | string | Prefix for email address (optional) |

**Returns**: `Promise<CreateRandomEmailResponse>` - Created account information.

#### login(params)

Authenticate and get token.

| Parameter | Type | Description |
|---------|------|-------|
| params | Object | Login parameters |
| params.email | string | Email address to login |
| params.password | string | Password to login |

**Returns**: `Promise<LoginResponse>` - Authentication token.

#### getMessages()

Get all messages from authenticated account.

**Returns**: `Promise<GetMessagesResponse[]>` - List of messages.

#### getMessage(id)

Get a specific message by ID.

| Parameter | Type | Description |
|---------|------|-------|
| id | string | ID of message to retrieve |

**Returns**: `Promise<GetMessageResponse>` - Message details.

#### deleteMessage(id)

Delete a specific message by ID.

| Parameter | Type | Description |
|---------|------|-------|
| id | string | ID of message to delete |

**Returns**: `Promise<void>` - No data returned on success.

#### deleteAccount(id)

Delete authenticated account by ID.

| Parameter | Type | Description |
|---------|------|-------|
| id | string | ID of account to delete |

**Returns**: `Promise<void>` - No data returned on success.

#### me()

Get authenticated user account detailed information.

**Returns**: `Promise<MeResponse>` - Account details.
