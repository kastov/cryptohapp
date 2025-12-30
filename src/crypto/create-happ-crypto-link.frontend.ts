import JSEncrypt from 'jsencrypt';

import { HAPP_CRYPTO_V2, HAPP_CRYPTO_V3, HAPP_CRYPTO_V4 } from '../constants';

export type HappCryptoVersion = 'v2' | 'v3' | 'v4';

export interface HappCryptoResult {
    /** Deep link prefix (e.g., 'happ://crypt4/') */
    deepLink: string;
    /** Base64 encoded encrypted content */
    encryptedContent: string;
}

const CRYPTO_CONFIGS = {
    v2: HAPP_CRYPTO_V2,
    v3: HAPP_CRYPTO_V3,
    v4: HAPP_CRYPTO_V4,
} as const;

/**
 * Creates a Happ crypto deep link by encrypting content with RSA public key.
 * Uses jsencrypt library for browser compatibility.
 *
 * @param content - The content to encrypt (e.g., subscription URL)
 * @param version - Crypto version to use (v2, v3, or v4). Defaults to v4.
 * @returns Object with link, deepLink prefix, and encryptedContent, or null on error
 *
 * @example
 * ```ts
 * const result = createHappCryptoLink('https://subscription.link.com/s/remnawavetop');
 * // Returns:
 * // {
 * //   deepLink: 'happ://crypt4/',
 * //   encryptedContent: 'base64encodeddata...'
 * // }
 * ```
 */
export function createHappCryptoLink(
    content: string,
    version: HappCryptoVersion = 'v4',
): HappCryptoResult | null {
    try {
        const config = CRYPTO_CONFIGS[version];

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(config.publicKey);

        const encryptedContent = encrypt.encrypt(content);

        if (!encryptedContent) {
            return null;
        }

        return {
            deepLink: config.deepLink,
            encryptedContent,
        };
    } catch {
        return null;
    }
}
