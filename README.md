# @kastov/cryptohapp

A lightweight library for creating [Happ](https://www.happ.su) crypto deep links. Works on both Node.js (backend) and browser (frontend) environments.

## Features

- 🖥️ **Backend**: Uses native Node.js `crypto` module (zero dependencies)
- 🌐 **Frontend**: Uses lightweight `jsencrypt` library (~30KB)
- 📦 Supports multiple crypto versions (v2, v3, v4)

## Installation

**Backend (Node.js):**

```bash
npm i @kastov/cryptohapp
```

**Frontend (Browser):**

```bash
npm i @kastov/cryptohapp jsencrypt
```

## Usage

### Basic Example

```typescript
import { createHappCryptoLink } from '@kastov/cryptohapp';

const result = createHappCryptoLink('https://subscription.link.com/s/mysubscription');

if (result) {
  console.log(result.deepLink); // 'happ://crypt4/'
  console.log(result.encryptedContent); // 'base64encodeddata...'

  // Full link
  const fullLink = result.deepLink + result.encryptedContent;
  // 'happ://crypt4/base64encodeddata...'
}
```

### Specify Crypto Version

```typescript
import { createHappCryptoLink } from '@kastov/cryptohapp';

// Use v2
const resultV2 = createHappCryptoLink('https://example.com/sub', 'v2');
// resultV2.deepLink = 'happ://crypt2/'

// Use v3
const resultV3 = createHappCryptoLink('https://example.com/sub', 'v3');
// resultV3.deepLink = 'happ://crypt3/'

// Use v4 (default)
const resultV4 = createHappCryptoLink('https://example.com/sub', 'v4');
// resultV4.deepLink = 'happ://crypt4/'
```

### Error Handling

```typescript
import { createHappCryptoLink } from '@kastov/cryptohapp';

const result = createHappCryptoLink('https://example.com/subscription');

if (result === null) {
  console.error('Encryption failed');
} else {
  console.log('Success:', result.deepLink + result.encryptedContent);
}
```

### React Example

```tsx
import { useState } from 'react';
import { createHappCryptoLink } from '@kastov/cryptohapp';

function CryptoLinkGenerator() {
  const [link, setLink] = useState('');

  const generateLink = () => {
    const result = createHappCryptoLink('https://subscription.link.com/s/remnawavetop');

    if (result) {
      setLink(result.deepLink + result.encryptedContent);
    }
  };

  return (
    <div>
      <button onClick={generateLink}>Generate Crypto Link</button>
      {link && <a href={link}>Open in Happ</a>}
    </div>
  );
}
```

### NestJS Example

```typescript
import { Injectable } from '@nestjs/common';
import { createHappCryptoLink } from '@kastov/cryptohapp';

@Injectable()
export class HappService {
  generateCryptoLink(subscriptionUrl: string): string | null {
    const result = createHappCryptoLink(subscriptionUrl);

    if (!result) {
      return null;
    }

    return result.deepLink + result.encryptedContent;
  }
}
```

## API Reference

### `createHappCryptoLink(content, version?)`

Creates an encrypted Happ deep link.

#### Parameters

| Parameter | Type                   | Default | Description                                     |
| --------- | ---------------------- | ------- | ----------------------------------------------- |
| `content` | `string`               | —       | The content to encrypt (e.g., subscription URL) |
| `version` | `'v2' \| 'v3' \| 'v4'` | `'v4'`  | Crypto version to use                           |

#### Returns

`HappCryptoResult | null`

```typescript
interface HappCryptoResult {
  /** Deep link prefix (e.g., 'happ://crypt4/') */
  deepLink: string;
  /** Base64 encoded encrypted content */
  encryptedContent: string;
}
```

Returns `null` if encryption fails.

### Exported Constants

You can also access the public keys directly:

```typescript
import { HAPP_CRYPTO_V2, HAPP_CRYPTO_V3, HAPP_CRYPTO_V4 } from '@kastov/cryptohapp';

console.log(HAPP_CRYPTO_V4.publicKey); // RSA public key
console.log(HAPP_CRYPTO_V4.deepLink); // 'happ://crypt4/'
```

## How It Works

The library uses RSA encryption with PKCS1 padding to encrypt your content:

- **Backend**: Uses Node.js native `crypto.publicEncrypt()`
- **Frontend**: Uses `jsencrypt` library for browser compatibility

Both implementations produce identical encrypted output, ensuring cross-platform compatibility.

## Content Size Limits

RSA with PKCS1 padding can encrypt data up to `(keySize / 8) - 11` bytes. For a 4096-bit key, this is approximately **501 bytes**. If your content exceeds this limit, consider using a URL shortener or compression.

## Reference

- [Happ Crypto Link Documentation](https://www.happ.su/main/developer-documentation/crypto-link#api-instructions)

## License

MIT
