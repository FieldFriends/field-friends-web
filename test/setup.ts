import { generateKeyPairSync } from 'node:crypto';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// FriendDev: Inject the mock key.
process.env.FIELD_FRIENDS_PUBLIC_KEY = publicKey;

// FriendDev: Store private key globally so our tests can use it to simulate decryption.
(globalThis as any).__TEST_PRIVATE_KEY__ = privateKey;