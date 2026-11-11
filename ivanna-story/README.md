# A Little Story for Ivanna ♡

Website pengakuan interaktif bertema *Dreamy & Soft*: amplop surat → ayat Alkitab → pertanyaan (YES / NO yang kabur-kaburan) → video lirik sinematik → form wish → WhatsApp.

Stack: React 18 · Vite · TypeScript · Tailwind CSS · Framer Motion · GSAP · lucide-react.

---

## 1. Jalankan di komputer

```bash
npm install
npm run dev        # buka http://localhost:5173
npm run build      # build produksi ke folder dist/
npm run preview    # tes hasil build
```

Butuh Node.js 18+.

## 2. Personalisasi (semua di satu tempat)

| Mau ubah | File |
|---|---|
| Nama, panggilan, **nomor WhatsApp**, warna, musik, jumlah animasi | `src/data/config.ts` |
| Semua teks (opening, surat, pertanyaan, toast, form, thank-you) | `src/data/content.ts` |
| Ayat Alkitab + refleksi | `src/data/verses.ts` |
| Lirik lagu + durasi tiap baris | `src/data/lyrics.ts` |

Yang perlu kamu cek:
- `recipient.fullName` di `config.ts` (nama tengah belum diisi).
- Ayat di `verses.ts` memakai **Alkitab Terjemahan Baru (TB) LAI**. Bandingkan dulu dengan Alkitabmu sebelum publish.
- Surat di `content.ts` (`letter.paragraphs`) silakan diubah supaya terdengar seperti kamu.

## 3. Integrasi WhatsApp

Nomor sudah diisi: `+62 838 7002 8215` → `6283870028215` (format internasional, tanpa `+`, spasi, atau `0` di depan). Ganti di `config.whatsapp.number`.

Cara kerjanya:
1. Pengunjung mengisi form → validasi → animasi amplop.
2. Pesan disusun dan di-encode dengan `URLSearchParams` (emoji, baris baru, tanda kutip aman) menjadi `https://wa.me/<nomor>?text=...`.
3. WhatsApp dibuka di tab baru. Kalau popup diblokir browser, muncul tombol **Open WhatsApp** yang pasti jalan.

**Penting:** Click-to-Chat hanya *mengisi* pesan. Pesan baru sampai ke kamu setelah pengunjung menekan **Send** di WhatsApp. Website tidak pernah mengklaim pesan sudah terkirim, dan tidak ada API key atau server yang terlibat.

Format pesan ada di `src/utils/whatsapp.ts` (`buildMessage`).

## 4. Musik

Secara bawaan (`music.src: ''`) lagu instrumental **orisinal** dibuat langsung di browser lewat Web Audio: piano lembut, music-box, pad ambient, dan string tipis di bagian sinematik. Tidak ada file audio, tidak ada hak cipta yang terlibat.

Mau pakai file sendiri?
1. Taruh di `public/audio/story.mp3`.
2. Set `music.src: './audio/story.mp3'` di `config.ts`.
3. Kalau ada hening di awal file, isi `music.lyricsOffsetSec` supaya lirik mulai belakangan.
4. Sesuaikan `dur` di `lyrics.ts` agar pas dengan lagunya.

Pakai hanya musik yang kamu miliki atau punya lisensinya. Mengunggah lagu komersial ke website publik melanggar hak cipta. Kalau file gagal dimuat, instrumental bawaan otomatis dipakai.

Audio baru mulai setelah klik "Open My Little Story" (aturan autoplay browser). Tombol musik di pojok kanan atas selalu ada. Animasi tetap jalan walau audio mati.

## 5. Deploy ke GitHub Pages

Proyek sudah memakai `base: './'` dan punya workflow `.github/workflows/deploy.yml`.

1. Buat repo di GitHub (public), lalu push:
   ```bash
   git init
   git add .
   git commit -m "A little story"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
2. Di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Tunggu tab **Actions** selesai (hijau). Alamatnya: `https://<username>.github.io/<repo>/`.

Setiap `git push` ke `main` otomatis deploy ulang. Halaman diberi `noindex` supaya tidak muncul di Google, tapi siapa pun yang punya linknya tetap bisa membukanya.

Alternatif tanpa Actions: `npm run build`, lalu upload isi `dist/` ke branch `gh-pages`.

## 6. Deploy ke Vercel (opsional)

Import repo di vercel.com. Framework: Vite, build `npm run build`, output `dist`. Tidak ada environment variable.

## 7. Struktur

```
src/
├── components/   AnimatedBackground, FloatingPetals, Envelope, BibleVerse,
│                 ConfessionButtons, CinematicLyrics, MusicController, WishForm, ...
├── sections/     Welcome, Letter, Bible, Confession, Cinematic, Wish, ThankYou
├── hooks/        useExperience (state machine tahapan), useAudio (engine audio)
├── data/         config, content, verses, lyrics
└── utils/        whatsapp, theme, random
```

Tahapan dikunci oleh state machine (`useExperience`): tidak bisa loncat tahap. Cinematic dan Wish hanya terbuka setelah jawaban YES. Setelah WhatsApp dibuka, kunjungan berikutnya langsung ke layar thank-you; tombol **Replay** mengulang dari awal.

## 8. Perilaku tombol NO (tidak menjebak)

- Desktop: kabur saat kursor mendekat (spring), tidak pernah menimpa YES.
- HP: tap NO membuatnya pindah + toast lucu.
- Setelah `animation.maxNoDodges` kali (default 6) tombol berhenti kabur; klik berikutnya membuka dialog penolakan yang sopan (kembali / tutup halaman).
- Keyboard (Tab + Enter) dan mode *reduced motion* langsung membuka dialog tersebut, tanpa kabur-kaburan.

## 9. Aksesibilitas & performa

HTML semantik, label form, `aria-live` untuk toast dan caption lirik, fokus terlihat, dan `prefers-reduced-motion` dihormati (dekorasi diam, kamera sinematik mati). Dekorasi memakai CSS animation, jumlah partikel dikurangi di layar kecil, GSAP dimuat lazy hanya untuk adegan sinematik.

Opsional yang **tidak** dibuat: penyimpanan wish ke Supabase.
