# Field Friends

### Mission
To help people in the university community make friends by matching people into small friend groups based on shared interests.

### Disclaimer
**Field Friends is an independent project.**

It is **not** affiliated with, endorsed by, or sponsored by the University of Illinois Urbana-Champaign (UIUC).


### Technology Stack
- **Frontend:** Vue 3 + Vuetify 3.
- **Backend:** Vercel Serverless Functions (Node.js + Zod Validation).
- **Database:** Supabase.
- **Encryption:** Hybrid AES-256-GCM + RSA-4096 (private keys held cold-storage).

### Security Note
Sensitive data is encrypted *before* leaving the Vercel API.
The database only sees ciphertext.
Decryption keys are held offline on a local air-gapped machine and never touch the cloud infrastructure.