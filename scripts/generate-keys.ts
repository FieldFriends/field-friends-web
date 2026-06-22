import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import { Algorithms, KeyTypes, KeyFormats, Encodings, CryptoConfig } from '../shared/constants.ts';

const OUTPUT_DIR = 'generated-keys';
const MLKEM_FILE = 'mlkem-private.txt';
const RSA_FILE = 'rsa-private.pem';
const ENV_FILE = '.env.keys.example';

/**
 * Generates ML-KEM-1024 keypair, formats public key as PEM string,
 * extracts 64-byte seed from private key, and saves private seed to disk.
 * @returns The formatted public key PEM string.
 */
function generateMlKemKeys(): string {
  console.log(`Generating ML-KEM keys (${Algorithms.ML_KEM_1024})...`);
  const mlkemKeys = crypto.generateKeyPairSync(Algorithms.ML_KEM_1024);
  const mlkemPub = mlkemKeys.publicKey.export({ type: KeyTypes.Spki, format: KeyFormats.Pem }) as string;
  const mlkemPrivDer = mlkemKeys.privateKey.export({ type: KeyTypes.Pkcs8, format: KeyFormats.Der }) as Buffer;
  const mlkemSeed = mlkemPrivDer.subarray(-CryptoConfig.MlKemSeedLength);

  const outPath = `${OUTPUT_DIR}/${MLKEM_FILE}`;
  fs.writeFileSync(outPath, mlkemSeed.toString(Encodings.Hex));
  console.log(` -> Saved ${outPath}`);

  return mlkemPub;
}

/**
 * Generates 4096-bit RSA keypair, formats both as PEM strings,
 * and saves private key to disk.
 * @returns The formatted public key PEM string.
 */
function generateRsaKeys(): string {
  console.log('Generating RSA keys (4096-bit)...');
  const rsaKeys = crypto.generateKeyPairSync('rsa', { modulusLength: 4096 });
  const rsaPub = rsaKeys.publicKey.export({ type: KeyTypes.Spki, format: KeyFormats.Pem }) as string;
  const rsaPriv = rsaKeys.privateKey.export({ type: KeyTypes.Pkcs8, format: KeyFormats.Pem }) as string;

  const outPath = `${OUTPUT_DIR}/${RSA_FILE}`;
  fs.writeFileSync(outPath, rsaPriv);
  console.log(` -> Saved ${outPath}`);

  return rsaPub;
}

/**
 * Generates secure random hexadecimal string.
 * @param byteLength - Length of the random bytes to generate.
 * @returns The generated hexadecimal string.
 */
function generateHashPepper(byteLength: number = CryptoConfig.Scrypt.SaltLength): string {
  return crypto.randomBytes(byteLength).toString(Encodings.Hex);
}

/**
 * Creates environment variable template string containing the newly generated
 * public keys and cryptographic peppers.
 * @param rsaPub - RSA public key PEM string.
 * @param mlkemPub - ML-KEM public key PEM string.
 * @param hashPepper - System hash pepper.
 * @param userHashPepper - User-specific hash pepper.
 * @param zeptoWebhookSecret - Zepto webhook secret.
 * @returns The formatted `.env` template string.
 */
function createEnvTemplate(rsaPub: string, mlkemPub: string, hashPepper: string, userHashPepper: string, zeptoWebhookSecret: string): string {
  return `# Keys
# ---------------------------------------------
# 1. Copy these values into field-friends-web/.env.local
# 2. Copy the public keys and peppers to Vercel project environment variables.

FIELD_FRIENDS_PUBLIC_KEY="${rsaPub.trim()}"

FIELD_FRIENDS_MLKEM_PUBLIC_KEY="${mlkemPub.trim()}"

HASH_PEPPER=${hashPepper}
USER_HASH_PEPPER=${userHashPepper}

ZEPTO_WEBHOOK_SECRET=${zeptoWebhookSecret}
`;
}

/**
 * Generates all keys and peppers.
 */
function main() {
  try {
    console.log('Starting automated key generation...\n');

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const mlkemPub = generateMlKemKeys();
    const rsaPub = generateRsaKeys();

    console.log('Generating Hash Peppers (32-byte hex)...');
    const hashPepper = generateHashPepper();
    const userHashPepper = generateHashPepper();

    console.log('Generating Zepto Webhook Secret (16-byte hex)...');
    const zeptoWebhookSecret = generateHashPepper(16);

    const envTemplate = createEnvTemplate(rsaPub, mlkemPub, hashPepper, userHashPepper, zeptoWebhookSecret);

    const outPath = `${OUTPUT_DIR}/${ENV_FILE}`;
    fs.writeFileSync(outPath, envTemplate);
    console.log(`\nPublic keys and peppers have been written to "${outPath}".`);

  } catch (e) {
    console.error('Error generating keys:', e);
    process.exit(1);
  }
}

main();
