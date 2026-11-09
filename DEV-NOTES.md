# Dev Notes for portfolio-os

## Local Development Checklist

- Run the app locally with:
  ```sh
  pnpm run dev
  ```
- Provide a GitHub token as `GITHUB_KEY` (used by the Projects page). The worker reads `env.GITHUB_KEY` first, then falls back to the Cloudflare Secrets Store:
  - Simplest: put it in `.env.local`:
    ```sh
    GITHUB_KEY=<your_github_key>
    ```
  - Or create it in the local Cloudflare Secrets Store:
    ```sh
    pnpm wrangler secrets-store secret create <store_id> --name GITHUB_KEY --value <your_github_key> --scopes workers
    ```

## CI

- CI reads the token from the `GH_API_TOKEN` repo secret. Dependabot PRs only see Dependabot secrets, so `GH_API_TOKEN` must also be set there:
  ```sh
  gh secret set GH_API_TOKEN --app dependabot
  ```
- Secrets Store values are write-only; you can't read them back to copy elsewhere.
