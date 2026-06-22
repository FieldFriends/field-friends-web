# Environment Variable & Key Rotation Guide

This document catalogs every environment variable used in the project, its purpose, and exactly how to find or rotate it.

## 1. Cryptographic Keys & Peppers

**To rotate:** Run `npm run generate:keys` from the `field-friends-web` directory.

| Variable | Description |
| :--- | :--- |
| `FIELD_FRIENDS_PUBLIC_KEY` | RSA-4096 public key. (Private key must be deployed to the Python engine). |
| `FIELD_FRIENDS_MLKEM_PUBLIC_KEY` | ML-KEM-1024 public key. (Private key must be deployed to the Python engine). |
| `HASH_PEPPER` | 32-byte hexadecimal string used as salt for internal data hashing. |
| `USER_HASH_PEPPER` | 32-byte hexadecimal string used as salt for user-specific hashing. |

*Note: The generator script outputs these into `generated-keys/.env.keys.example`.*

## 2. Development Flags

| Variable | Description |
| :--- | :--- |
| `VITE_USE_MOCK_AUTH` | Set to `true` to bypass Supabase authentication during local development. This should ***always*** be `false` in production. |

## 3. Supabase

**Supabase Dashboard > Project Settings**

| Variable | Location | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Settings > API > Project URL | The public REST URL for the Supabase project. |
| `VITE_SUPABASE_ANON_KEY` | Settings > API Keys | The publishable key used by the frontend client. |
| `SUPABASE_SECRET_KEY` | Settings > API Keys | The secret key.
| `SUPABASE_DATABASE_URL` | Settings > Database > Connection string | The PostgreSQL connection URI used for direct database access (e.g., Kysely/Prisma). |

## 4. Cloudflare Turnstile

**Cloudflare Dashboard > Application Security > Turnstile**

| Variable | Location | Description |
| :--- | :--- | :--- |
| `VITE_TURNSTILE_SITE_KEY` | Site Configuration > Site Key | The public site key loaded by the frontend widget. |
| `TURNSTILE_SECRET_KEY` | Site Configuration > Secret Key | The private secret key used by the backend to verify the token. |

## 5. ZeptoMail

**Zoho ZeptoMail Dashboard > Agents > (agent name)**

| Variable | Location | Description |
| :--- | :--- | :--- |
| `ZEPTO_AUTH_KEY` | API/SMTP > API > Send Mail Token | The Send Mail token used to authenticate API requests. |
| `ZEPTO_WEBHOOK_SECRET` | Webhooks > Webhook Secret | Used to verify incoming webhook payloads from ZeptoMail. |
