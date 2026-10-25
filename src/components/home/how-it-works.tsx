const STEPS = [
  { n: "01", title: "Pilih Game", desc: "Cari game atau voucher favoritmu." },
  { n: "02", title: "Isi Data Akun", desc: "Masukkan User ID atau data yang diminta." },
  { n: "03", title: "Bayar", desc: "Pilih metode pembayaran yang kamu suka." },
  { n: "04", title: "Selesai", desc: "Item masuk otomatis ke akunmu." },
];

export function HowItWorks() {
  return (
    <section className="rounded-3xl glass p-6 sm:p-10">
      <h2 className="mb-1 text-center text-2xl font-bold sm:text-3xl">
        Top up cuma <span className="text-gradient">4 langkah</span>
      </h2>
      <p className="mb-8 text-center text-sm text-muted-foreground">Tanpa ribet, tanpa perlu daftar akun.</p>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <li key={s.n} className="relative rounded-2xl border border-border/60 p-5">
            <span className="font-heading text-4xl font-bold text-gradient">{s.n}</span>
            <p className="mt-2 font-semibold">{s.title}</p>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
