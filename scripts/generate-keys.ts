import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import { Algorithms, KeyTypes, KeyFormats, Encodings, CryptoConfig, ZeptoMailConfig } from '../shared/constants.ts';

const OUTPUT_DIR = 'generated-keys';
const MLKEM_FILE = 'mlkem-private.txt';
const MLKEM_PUB_FILE = 'mlkem-public.pem';
const RSA_FILE = 'rsa-private.pem';
const RSA_PUB_FILE = 'rsa-public.pem';
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

  const privPath = `${OUTPUT_DIR}/${MLKEM_FILE}`;
  fs.writeFileSync(privPath, mlkemSeed.toString(Encodings.Hex));
  console.log(` -> Saved ${privPath}`);

  const pubPath = `${OUTPUT_DIR}/${MLKEM_PUB_FILE}`;
  fs.writeFileSync(pubPath, mlkemPub);
  console.log(` -> Saved ${pubPath}`);

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

  const privPath = `${OUTPUT_DIR}/${RSA_FILE}`;
  fs.writeFileSync(privPath, rsaPriv);
  console.log(` -> Saved ${privPath}`);

  const pubPath = `${OUTPUT_DIR}/${RSA_PUB_FILE}`;
  fs.writeFileSync(pubPath, rsaPub);
  console.log(` -> Saved ${pubPath}`);

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
 * @param zeptoAuthKey - Zepto authentication key.
 * @returns The formatted `.env` template string.
 */
function createEnvTemplate(rsaPub: string, mlkemPub: string, hashPepper: string, userHashPepper: string, zeptoWebhookSecret: string, zeptoAuthKey: string): string {
  return `# Keys
# ---------------------------------------------
# 1. Copy these values into field-friends-web/.env.local
# 2. Copy the public keys and peppers to Vercel project environment variables.

FIELD_FRIENDS_PUBLIC_KEY="${rsaPub.trim()}"

FIELD_FRIENDS_MLKEM_PUBLIC_KEY="${mlkemPub.trim()}"

HASH_PEPPER=${hashPepper}
USER_HASH_PEPPER=${userHashPepper}

ZEPTO_WEBHOOK_SECRET=${zeptoWebhookSecret}
ZEPTO_AUTH_KEY=${zeptoAuthKey}
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

    console.log('Generating Zepto Webhook Secret (32-byte hex)...');
    const zeptoWebhookSecret = generateHashPepper(ZeptoMailConfig.WebhookSecretLength);

    console.log('Generating Zepto Auth Key (24-byte hex -> 48 chars)...');
    const zeptoAuthKey = generateHashPepper(ZeptoMailConfig.AuthKeyLength);

    const envTemplate = createEnvTemplate(rsaPub, mlkemPub, hashPepper, userHashPepper, zeptoWebhookSecret, zeptoAuthKey);

    const outPath = `${OUTPUT_DIR}/${ENV_FILE}`;
    fs.writeFileSync(outPath, envTemplate);
    console.log(`\nPublic keys and peppers have been written to "${outPath}".`);

  } catch (e) {
    console.error('Error generating keys:', e);
    process.exit(1);
  }
}

main();
