# Dev Notes for portfolio-os

## Local Development Checklist

- Run the app locally with:
  ```sh
  pnpm run dev
  ```
- Ensure the secret `GITHUB_KEY` is created in the local Cloudflare Secrets Store using Wrangler:
  ```sh
  pnpm wrangler secrets-store secret create <store_id> --name GITHUB_KEY --value <your_github_key> --scopes workers
  ```
  Replace `<store_id>` and `<your_github_key>` with your actual values.

---
Add any other personal notes or steps below:

- ...
