# Gatari Product Filler — Netlify Ready

Struktur ini sudah benar untuk Netlify:

- `index.html` = frontend
- `netlify/functions/generate.js` = backend proxy ke Anthropic
- `netlify.toml` = konfigurasi Netlify Functions

## Cara pakai di Netlify

1. Upload/deploy folder ini ke Netlify.
2. Masuk ke Netlify Dashboard.
3. Buka `Site configuration` → `Environment variables`.
4. Tambahkan variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: API key Anthropic kamu
5. Redeploy site.
6. Buka website, lalu klik Generate.

Opsional, kalau model ingin diganti, tambah variable:

- Key: `ANTHROPIC_MODEL`
- Value contoh: `claude-sonnet-4-20250514`

Catatan: API key jangan ditaruh di HTML.
