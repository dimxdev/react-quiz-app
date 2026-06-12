# 🧠 Quiz App — Project Roadmap

> **React + Vite · Trivia API · LocalStorage · Timer**
> Bangun aplikasi kuis interaktif dari nol sampai production-ready!

---

## 📋 Daftar Milestone

| # | Milestone | Status |
|---|-----------|--------|
| 1 | ⚙️ Setup Project | ☐ |
| 2 | 🔐 Authentication | ☐ |
| 3 | 🌐 Integrasi API | ☐ |
| 4 | 📝 Halaman Quiz | ☐ |
| 4.5 | 🗂️ Quiz State *(Disarankan)* | ☐ |
| 5 | 📊 Progress Quiz | ☐ |
| 6 | ⏱️ Timer | ☐ |
| 7 | 🏆 Result Page | ☐ |
| 8 | 💾 Resume Quiz *(Bonus)* | ☐ |
| 9 | ✨ Polishing | ☐ |
| 10 | 🚀 Finalisasi | ☐ |
| 11 | 🎥 Video Loom | ☐ |

---

## ⚙️ Milestone 1 — Setup Project

### Task 1.1 · Inisialisasi Project

- [ ] Buat project React dengan **Vite**
- [ ] Install dependency:
  - `react-router-dom`
  - `axios`
- [ ] Install **Tailwind CSS**
- [ ] Konfigurasi Tailwind pada Vite
- [ ] Tambahkan Tailwind import ke `index.css`:

```css
/* Tailwind v4 (cara terbaru) */
@import "tailwindcss";

/* Tailwind v3 (jika install dengan cara lama) */
/* @tailwind base;        */
/* @tailwind components;  */
/* @tailwind utilities;   */
```

> ⚠️ Sesuaikan dengan versi yang kamu install. Tailwind **v4** cukup satu baris `@import`. Tailwind **v3** perlu tiga baris `@tailwind`.

- [ ] Push project awal ke **GitHub**

**✅ Output yang diharapkan:**
```bash
npm run dev
# → Server berjalan tanpa error
# → Tailwind class sudah aktif
```

---

### Task 1.2 · Struktur Folder

- [ ] Buat struktur folder berikut:

```
src/
├── pages/
├── components/
├── services/
├── hooks/
├── utils/
└── context/
```

> 💡 Routing langsung didefinisikan di `App.jsx`, tidak perlu folder `routes/` terpisah.

- [ ] Setup routing dasar di `App.jsx` untuk:

```
/login
/quiz
/result
```

---

## 🔐 Milestone 2 — Authentication

### Task 2.1 · UI Login

- [ ] Buat halaman **Login**
- [ ] Input `username`
- [ ] Input `password`
- [ ] Tombol **Login**

**✅ Output:** Tampilan halaman login selesai dan rapi.

---

### Task 2.2 · Logic Login

- [ ] Validasi input tidak boleh kosong
- [ ] Simpan status login ke `localStorage`

```js
localStorage.setItem("isLoggedIn", true)
```

---

### Task 2.3 · Protected Route

- [ ] User **belum login** → redirect ke `/login`
- [ ] User **sudah login** → akses `/quiz` diizinkan

```
/login  ──(login berhasil)──▶  /quiz
```

---

### Task 2.4 · Logout

- [ ] Hapus status login dari `localStorage`
- [ ] Redirect ke `/login`

```
/quiz  ──(klik logout)──▶  /login
```

> 💡 Berguna untuk demo dan menunjukkan pemahaman auth flow secara lengkap.

---

## 🌐 Milestone 3 — Integrasi API

### Task 3.1 · Buat Service API

📄 File: `src/services/triviaApi.js`

- [ ] Buat function `fetchQuestions()`
- [ ] Ambil data dari endpoint:

```
https://opentdb.com/api.php?amount=10&type=multiple
```

---

### Task 3.2 · Testing API

- [ ] Tampilkan hasil soal di console untuk verifikasi

```js
console.log(data.results)
// → Array berisi 10 soal trivia
```

---

### Task 3.3 · Simpan Soal ke State

- [ ] `useState` untuk `questions`
- [ ] `loading` state
- [ ] `error` state

---

### Task 3.4 · Decode HTML Entity

Open Trivia DB sering mengembalikan karakter ter-encode seperti:

```
What is &quot;React&quot;?   →   What is "React"?
Tom &amp; Jerry            →   Tom & Jerry
```

- [ ] Buat helper function untuk decode HTML entity
- [ ] Terapkan pada `question` dan semua `answer` options

```js
// Contoh pendekatan
const decodeHTML = (str) => {
  const txt = document.createElement("textarea")
  txt.innerHTML = str
  return txt.value
}
```

> ⚠️ Jika tidak ditangani, teks soal akan terlihat tidak profesional di UI.

---

## 📝 Milestone 4 — Halaman Quiz

### Task 4.1 · Tampilkan Soal Pertama

- [ ] Ambil soal pada index `0`
- [ ] Render pertanyaan ke layar

**✅ Output:** Teks "Question 1" tampil di halaman.

---

### Task 4.2 · Tampilkan Pilihan Jawaban

- [ ] Gabungkan `correct_answer` + `incorrect_answers`
- [ ] **Shuffle** jawaban menggunakan `shuffleArray()` dari utils

**✅ Output:** 4 pilihan jawaban tampil acak:
```
A  ·  B  ·  C  ·  D
```

---

### Task 4.2.1 · Buat Utility Shuffle

📄 File: `src/utils/shuffle.js`

- [ ] Buat helper function `shuffleArray()`
- [ ] Simpan di `utils/shuffle.js`
- [ ] Gunakan untuk mengacak urutan jawaban di Task 4.2

```js
// Fisher-Yates shuffle
export const shuffleArray = (arr) => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
```

> 💡 Simpan di `utils/` agar bisa dipakai ulang di tempat lain jika dibutuhkan.

---

### Task 4.3 · Menjawab Soal

- [ ] Klik pada jawaban
- [ ] Simpan jawaban user ke state
- [ ] Pindah otomatis ke soal berikutnya

---

### Task 4.4 · Finish Quiz

- [ ] Deteksi jika soal yang dijawab adalah **soal terakhir**
- [ ] Redirect otomatis ke halaman `/result`

```
Soal ke-10 dijawab  ──▶  /result
```

---

## 🗂️ Milestone 4.5 — Quiz State *(Opsional tapi Disarankan)*

> Tentukan arsitektur state sebelum lanjut ke fitur Progress, Timer, dan Resume.
> Ini akan menghindarkan refactor besar di tengah jalan.

### Task 4.5.1 · Definisikan State

- [ ] Tentukan state yang dibutuhkan:

```js
const [questions, setQuestions]           = useState([])
const [currentQuestion, setCurrentQuestion] = useState(0)
const [answers, setAnswers]               = useState([])
const [timeLeft, setTimeLeft]             = useState(300)
```

---

### Task 4.5.2 · Pilih State Management

- [ ] Evaluasi pendekatan:

| Pendekatan | Kapan Dipakai |
|------------|---------------|
| `useState` | ✅ **Gunakan ini dulu** — cukup untuk project ini |
| `Context API` | Pertimbangkan hanya jika state perlu dibagi banyak komponen yang tidak berhubungan |

> 💡 **Rekomendasi:** Mulai dengan `useState` biasa. Migrasi ke Context API hanya kalau benar-benar dibutuhkan. Quiz app ini masih relatif kecil.

---

## 📊 Milestone 5 — Progress Quiz

### Task 5.1 · Progress Number

- [ ] Tampilkan nomor soal saat ini

```
Question 3 of 10
```

---

### Task 5.2 · Progress Bar

- [ ] Render progress bar visual

```
██████░░░░  6/10
```

---

### Task 5.3 · Total Soal

- [ ] Tampilkan ringkasan pengerjaan

```
Total Soal  :  10
Dikerjakan  :   6
```

---

## ⏱️ Milestone 6 — Timer

### Task 6.1 · Komponen Timer

- [ ] Buat komponen `components/Timer.jsx`

---

### Task 6.2 · Countdown

- [ ] Timer menghitung mundur setiap detik

```
05:00 → 04:59 → 04:58 → ...
```

---

### Task 6.3 · Timer Habis

- [ ] Jika timer mencapai `00:00`:
  - [ ] Quiz berhenti otomatis
  - [ ] Redirect ke halaman `/result`

---

## 🏆 Milestone 7 — Result Page

### Task 7.1 · Hitung Nilai

- [ ] Hitung jumlah jawaban **benar**
- [ ] Hitung jumlah jawaban **salah**
- [ ] Hitung jumlah soal **tidak dijawab**

---

### Task 7.2 · Halaman Hasil

- [ ] Render halaman hasil akhir

```
🎉 Quiz Finished!

✅ Benar          :  8
❌ Salah          :  2
⏭️  Tidak Dijawab :  0
```

---

### Task 7.3 · Tombol Restart

- [ ] Reset semua state
- [ ] Hapus data dari `localStorage`
- [ ] Kembali ke halaman `/login`

---

## 💾 Milestone 8 — Resume Quiz *(Nilai Plus)*

### Task 8.1 · Simpan Progress

- [ ] Setiap kali user menjawab, simpan ke `localStorage`:

```json
{
  "questions": [...],
  "currentQuestion": 4,
  "answers": ["A", "C", "B", "D"],
  "remainingTime": 234
}
```

> ⚠️ **Wajib menyimpan `questions`!** Saat browser di-refresh, API akan di-fetch ulang dan urutan soal bisa berubah. Tanpa menyimpan soal, jawaban yang sudah tersimpan akan menjadi tidak valid.

---

### Task 8.2 · Load Progress

- [ ] Saat aplikasi dibuka, cek `localStorage`
- [ ] Jika ada progress tersimpan → tampilkan popup konfirmasi:

```
╔══════════════════╗
║   Resume Quiz?   ║
║  [YES]    [NO]   ║
╚══════════════════╝
```

---

### Task 8.3 · Resume

- [ ] Jika user klik **YES** → lanjutkan dari soal terakhir
- [ ] Jika user klik **NO** → mulai dari awal

---

## ✨ Milestone 9 — Polishing

### Task 9.1 · Loading State

- [ ] Tampilkan indikator saat soal sedang dimuat

```
⏳ Loading Questions...
```

---

### Task 9.2 · Error State

- [ ] Tampilkan pesan jika fetch gagal

```
❌ Failed to fetch questions. Please try again.
```

---

### Task 9.2.1 · Empty State

- [ ] Tampilkan pesan jika API berhasil dipanggil tapi soal kosong

```
📭 No questions available.
```

> 💡 Jarang terjadi, tapi menangani edge case ini menunjukkan perhatian terhadap kualitas UX.

---

### Task 9.3 · Responsive Design

- [ ] Tampilan optimal di **Mobile** 📱
- [ ] Tampilan optimal di **Tablet** 💻
- [ ] Tampilan optimal di **Desktop** 🖥️

---

### Task 9.4 · UI Enhancement

- [ ] Card layout untuk soal
- [ ] Hover effect pada tombol jawaban
- [ ] Modern button styling
- [ ] Consistent spacing & typography

---

## 🚀 Milestone 10 — Finalisasi

### Task 10.1 · Cleanup

- [ ] Hapus semua `console.log`
- [ ] Rapikan struktur folder
- [ ] Rapikan dan urutkan semua `import`

---

### Task 10.2 · README.md

- [ ] Tulis deskripsi project
- [ ] Cara install (`npm install`)
- [ ] Cara menjalankan (`npm run dev`)
- [ ] Sertakan screenshot tampilan app

---

### Task 10.3 · Upload GitHub

- [ ] Commit history rapi & deskriptif
- [ ] Repository di-set **public**

---

## 🎥 Milestone 11 — Video Loom

### Task 11.1 · Demo Fitur Utama

Rekam dan tunjukkan:
- [ ] Proses **Login**
- [ ] **Fetch soal** dari API
- [ ] **Progress bar** berjalan
- [ ] **Timer** countdown
- [ ] Halaman **Result**

---

### Task 11.2 · Demo Fitur Bonus

- [ ] Tutup browser di tengah quiz
- [ ] Buka kembali browser
- [ ] Tunjukkan popup **Resume Quiz**
- [ ] Lanjutkan dari soal terakhir ✅

---

### Task 11.3 · Walkthrough Source Code

Tunjukkan bagian kode:
- [ ] **Routing** (`App.jsx`)
- [ ] **API Service** (`services/triviaApi.js`)
- [ ] **Timer** logic (`components/Timer.jsx`)
- [ ] **LocalStorage** (save & load progress)

---

## 🗺️ Urutan Pengerjaan yang Disarankan

```
 1. Setup Project          ████████████████████  Fondasi
 2. Routing                ████████████████████  Navigasi
 3. Login                  ████████████████████  Auth UI
 4. Protected Route        ████████████████████  Auth Logic
 5. Fetch API              ████████████████████  Data
 6. Render Soal            ████████████████████  Core UI
 7. Jawab Soal             ████████████████████  Interaksi
 8. Progress               ████████████████████  Feedback
 9. Timer                  ████████████████████  Gameplay
10. Result Page            ████████████████████  Output
11. Resume Quiz            ████████████████████  Bonus ⭐
12. Responsive UI          ████████████████████  Polish
13. GitHub                 ████████████████████  Deploy
14. Loom                   ████████████████████  Presentasi
```

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **React + Vite** | Framework & Build Tool |
| **react-router-dom** | Client-side Routing |
| **axios** | HTTP Request ke API |
| **Tailwind CSS** | Styling & Responsive Design |
| **Open Trivia DB** | Sumber soal quiz |
| **localStorage** | Persist login & progress |

---

> 💡 **Tips:** Kerjakan satu task sampai selesai sebelum lanjut ke task berikutnya.
> Commit setiap selesai satu milestone agar history Git tetap rapi!

---

*Good luck & have fun building! 🚀*