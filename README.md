# ppob-fe-next

Storefront & panel admin PPOB — Next.js 16 (App Router, Cache Components, Partial Prefetching), shadcn/ui (Radix, preset Nova), Tailwind CSS v4, TanStack Query, Zustand, React Hook Form + Zod.

## Menjalankan

```bash
cp .env.example .env.local   # API_URL=http://localhost:8080
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # produksi (output: standalone)
```

Browser hanya berbicara dengan origin Next.js: `/api/v1/*` dan `/uploads/*` di-rewrite ke Go API, sehingga cookie auth (`ppob_token`, httpOnly) tetap first-party.

## Arsitektur

```
src/
  app/
    (store)/            storefront: beranda, game/[slug], games, cart, checkout, invoice/[invoice], track, faq, membership, account
    (auth)/             login, register
    admin/              dashboard & seluruh modul admin
  components/
    ui/                 primitif shadcn/ui
    layout/             header, nav, footer, background tema, floating contact, theme style
    home/ product/ cart/ checkout/ invoice/ account/ auth/   micro-component per fitur
    admin/              blok generik: SchemaForm, CrudPage, DataTable, FormDialog, ImageUpload, editor khusus
    shared/             Price, GameArt, StatusBadge, CountdownTimer, QuantityStepper, …
  lib/
    api/server.ts       fetcher server ber-'use cache' + cacheTag (settings, katalog, banner, flash sale, FAQ)
    api/client.ts       fetch client bertipe + ApiError
    actions.ts          server action revalidateStorefront (updateTag, hanya admin)
    types.ts constants.ts format.ts color.ts
  stores/               keranjang & pesanan terakhir (Zustand persist)
  hooks/                useAuth, useCountdown, useDebounce, useMounted
  proxy.ts              gate optimistik /account & /admin (otorisasi sebenarnya di API)
```

### Prinsip

- **Micro-component**: setiap bagian UI kecil & fokus (mis. `ProductOption`, `PurchaseSummary`, `CouponInput`, `PaymentMethodPicker`, `StatusTimeline`).
- **Server-first & ringan**: data publik dirender di server dan di-cache (`cacheLife('minutes')` + tag). Saat admin menyimpan perubahan, `updateTag` langsung memperbarui storefront.
- **Harga oleh server**: guest melihat harga publik dari cache; user member/reseller otomatis mendapat harga levelnya (refetch di client); checkout selalu memakai `/checkout/quote`.
- **Admin deklaratif**: modul admin didefinisikan sebagai konfigurasi kolom + field (`CrudPage`), sehingga konsisten dan mudah ditambah.
- **Tema runtime**: warna brand/aksen/radius dari pengaturan admin di-inject sebagai CSS variable di server (tanpa flash), latar gambar atau efek CSS.
- Aksesibilitas: label form, `aria-*`, fokus terlihat, `prefers-reduced-motion`.
