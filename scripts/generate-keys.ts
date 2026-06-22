import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import { Algorithms, KeyTypes, KeyFormats, Encodings, CryptoConfig } from '../shared/constants.ts';

try {
  console.log(`Generating ML-KEM keys using native Node.js crypto (${Algorithms.ML_KEM_1024})...`);
  const { publicKey, privateKey } = crypto.generateKeyPairSync(Algorithms.ML_KEM_1024);

  const pub = publicKey.export({ type: KeyTypes.Spki, format: KeyFormats.Pem });
  const privBuffer = privateKey.export({ type: KeyTypes.Pkcs8, format: KeyFormats.Der }) as Buffer;

  // FriendDev: The raw seed is 64 bytes. In the PKCS#8 DER structure, it is always the last 64 bytes.
  const rawSeed = privBuffer.subarray(-CryptoConfig.MlKemSeedLength);

  fs.writeFileSync('mlkem-public.pem', pub);
  fs.writeFileSync('mlkem-private.txt', rawSeed.toString(Encodings.Hex));

  console.log('Keys generated!');
} catch (e) {
  console.error('Error generating ML-KEM keys:', e);
  process.exit(1);
}
