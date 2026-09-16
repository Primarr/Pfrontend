# Primar Frontend

Next.js dashboard for **Primar** — Stellar-settled agent-to-agent payments.

## v0.2.0

- Horizon reachability indicator (testnet/public)
- Wallet session with G-strkey validation + stellar.expert links
- Publish-service and budget forms validate Stellar addresses / caps
- Error boundary around the app shell
- Vitest coverage for Stellar helpers + CI

```bash
npm install
npm test
npm run build
npm run dev
```

Env: see `.env.example`. Never commit private keys.
