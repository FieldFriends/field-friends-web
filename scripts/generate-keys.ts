import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import { Algorithms, KeyTypes, KeyFormats } from '../shared/constants.ts';

try {
  console.log(`Generating ML-KEM keys using native Node.js crypto (${Algorithms.ML_KEM_1024})...`);
  const { publicKey, privateKey } = crypto.generateKeyPairSync(Algorithms.ML_KEM_1024);

  const pub = publicKey.export({ type: KeyTypes.Spki, format: KeyFormats.Pem });
  const priv = privateKey.export({ type: KeyTypes.Pkcs8, format: KeyFormats.Pem });

  fs.writeFileSync('mlkem-public.pem', pub);
  fs.writeFileSync('mlkem-private.pem', priv);

  console.log('Keys generated!');
} catch (e) {
  console.error('Error generating ML-KEM keys:', e);
  process.exit(1);
}
