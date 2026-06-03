import * as fs from 'node:fs';
import * as path from 'node:path';

const fixturesDir = path.join(process.cwd(), 'test', 'fixtures');

// FriendDev: Load static test auth keys.
const rsaPub = fs.readFileSync(path.join(fixturesDir, 'rsa-pub.pem'), 'utf8');
const mlkemPub = fs.readFileSync(path.join(fixturesDir, 'mlkem-pub.pem'), 'utf8');

// FriendDev: Inject all required test env vars.
process.env.FIELD_FRIENDS_PUBLIC_KEY = rsaPub;
process.env.FIELD_FRIENDS_MLKEM_PUBLIC_KEY = mlkemPub;

// FriendDev: Inject symmetric secrets.
const secretsPath = path.join(fixturesDir, 'secrets.json');
const testSecrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));

for (const [key, value] of Object.entries(testSecrets)) {
    process.env[key] = value as string;
}