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

// FriendDev: Inject mock ZeptoMail authentication key for webhook signature tests.
process.env.ZEPTO_AUTH_KEY = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6';

// FriendDev: Store private key globally so our tests can use it to simulate decryption.
(globalThis as any).__TEST_PRIVATE_KEY__ = privateKey;