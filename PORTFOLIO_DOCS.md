# 🌑 Nuxt Portfolio — Dokumentasi Lengkap

> Dokumentasi arsitektur, setup, fitur, dan implementasi untuk web portfolio dinamis berbasis Nuxt 3 dengan admin panel, animasi premium, dan 3D physics lanyard. Backend menggunakan **Firebase** (Firestore + Auth). Gambar disimpan sebagai **base64** di Firestore. Tema: **dark mode penuh**.

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Proyek](#3-struktur-proyek)
4. [Setup & Instalasi](#4-setup--instalasi)
5. [Konfigurasi Environment](#5-konfigurasi-environment)
6. [Firebase Setup](#6-firebase-setup)
7. [Skema Data Firestore](#7-skema-data-firestore)
8. [Strategi Penyimpanan Gambar (Base64)](#8-strategi-penyimpanan-gambar-base64)
9. [Autentikasi Admin](#9-autentikasi-admin)
10. [Admin Panel](#10-admin-panel)
11. [Halaman Publik Portfolio](#11-halaman-publik-portfolio)
12. [Sistem Animasi](#12-sistem-animasi)
13. [3D Physics Lanyard](#13-3d-physics-lanyard)
14. [Design System (Dark Theme)](#14-design-system-dark-theme)
15. [Deployment](#15-deployment)
16. [Referensi Firebase](#16-referensi-firebase)

---

## 1. Gambaran Umum

Portfolio ini adalah aplikasi **fullstack** berbasis Nuxt 3 yang menggabungkan:

- **Halaman publik** yang memamerkan identitas, proyek, pengalaman, dan kontak
- **Admin panel** terproteksi untuk mengelola semua konten secara dinamis
- **Animasi premium** menggunakan GSAP + ScrollTrigger + Three.js
- **3D Lanyard interaktif** bermodel fisika nyata (gravitasi, Verlet integration, spring constraint) yang bisa diseret menggunakan mouse/touch
- **Dark theme penuh** — tidak ada toggle light/dark, seluruh UI dirancang untuk latar gelap

### Alur Data

```
Visitor ──────► Nuxt 3 Frontend ◄──── Firebase Firestore (NoSQL)
                      │                        ▲
                      │               Firebase Auth (Admin login)
                      └──── Admin Panel ────────┘
                            (route terproteksi)

Gambar: File → FileReader → base64 string → disimpan di Firestore
        Firestore → base64 string → <img src="data:image/...;base64,...">
```

### Kenapa Base64 di Firestore?

Firebase Storage pada plan gratis (Spark) memerlukan akun billing aktif sejak 2024. Untuk menghindari ketergantungan tersebut, seluruh gambar dikodekan sebagai base64 dan disimpan langsung di Firestore dengan strategi berikut:

| Ukuran Gambar               | Strategi                                                |
| --------------------------- | ------------------------------------------------------- |
| < 700 KB (setelah kompresi) | Disimpan dalam dokumen yang sama                        |
| > 700 KB                    | Disimpan di dokumen terpisah di sub-collection `images` |

> ⚠️ **Batas keras Firestore**: 1 MB per dokumen. Selalu kompres gambar di sisi klien sebelum menyimpan.

---

## 2. Tech Stack

| Kategori        | Library / Tool                | Versi  | Keterangan                           |
| --------------- | ----------------------------- | ------ | ------------------------------------ |
| Framework       | **Nuxt 3**                    | ^3.13  | SSR + SSG + SPA hybrid               |
| UI State        | **Pinia**                     | ^2.x   | Store management                     |
| Database        | **Firebase Firestore**        | ^10.x  | NoSQL document database              |
| Auth            | **Firebase Auth**             | ^10.x  | Email/password                       |
| Styling         | **Tailwind CSS v4**           | ^4.x   | Utility-first CSS                    |
| Tema            | **Dark mode native**          | —      | Hardcoded dark, tidak ada toggle     |
| Animasi Utama   | **GSAP**                      | ^3.x   | ScrollTrigger, SplitText, TextPlugin |
| 3D Engine       | **Three.js**                  | ^0.167 | WebGL renderer untuk lanyard         |
| Fisika Lanyard  | **Custom Verlet**             | —      | Rope simulation + rigid body         |
| Form            | **VeeValidate + Zod**         | —      | Validasi form admin                  |
| Kompresi Gambar | **browser-image-compression** | ^2.x   | Kompres sebelum encode base64        |
| Icon            | **Lucide Vue**                | —      | Icon konsisten                       |
| Notifikasi      | **vue-sonner**                | —      | Toast notification                   |
| Rich Text       | **Tiptap**                    | ^2.x   | Editor konten proyek                 |
| SEO             | **@nuxtjs/seo**               | —      | Meta, OG, sitemap otomatis           |

---

## 3. Struktur Proyek

```
portfolio/
├── app.vue
├── nuxt.config.ts
├── tailwind.config.ts
├── firebase.json                 # Firebase project config
├── firestore.rules               # Security rules Firestore
├── .env
├── .env.example
│
├── assets/
│   ├── css/
│   │   ├── main.css              # Tailwind base + CSS custom properties (dark)
│   │   └── animations.css        # Keyframes global
│   ├── fonts/                    # Font lokal (opsional)
│   └── images/
│       └── lanyard/              # Template kartu (PNG statis)
│
├── components/
│   ├── global/                   # Auto-imported
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   └── AppNavbar.vue
│   │
│   ├── landing/                  # Seksi halaman utama
│   │   ├── HeroSection.vue
│   │   ├── AboutSection.vue
│   │   ├── ProjectsSection.vue
│   │   ├── ExperienceSection.vue
│   │   ├── SkillsSection.vue
│   │   ├── TestimonialsSection.vue
│   │   └── ContactSection.vue
│   │
│   ├── lanyard/                  # Komponen 3D lanyard
│   │   ├── LanyardCanvas.vue     # Mount point Three.js
│   │   ├── LanyardPhysics.ts     # Verlet rope simulation
│   │   ├── LanyardRenderer.ts    # Three.js scene setup
│   │   ├── LanyardCard.ts        # ID card mesh + tekstur
│   │   └── LanyardInteraction.ts # Drag handler
│   │
│   ├── ui/                       # Komponen atom reusable
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseModal.vue
│   │   ├── BaseTable.vue
│   │   ├── BaseCard.vue
│   │   ├── BaseBadge.vue
│   │   ├── ImageUpload.vue       # Input gambar → kompresi → base64
│   │   └── RichTextEditor.vue
│   │
│   └── admin/                    # Komponen panel admin
│       ├── AdminSidebar.vue
│       ├── AdminHeader.vue
│       ├── ProjectForm.vue
│       ├── ExperienceForm.vue
│       ├── SkillForm.vue
│       └── TestimonialForm.vue
│
├── composables/
│   ├── useFirebase.ts            # Inisialisasi Firebase app + services
│   ├── useAuth.ts                # Login, logout, session state
│   ├── useImageBase64.ts         # Kompresi + encode/decode gambar
│   ├── useProjects.ts            # CRUD proyek
│   ├── useExperience.ts          # CRUD pengalaman kerja
│   ├── useSkills.ts              # CRUD skill
│   ├── useTestimonials.ts        # CRUD testimoni
│   ├── useProfile.ts             # Data profil pemilik
│   ├── useGsap.ts                # GSAP utilities + ScrollTrigger
│   └── useLanyard.ts             # Inisialisasi & kontrol lanyard
│
├── layouts/
│   ├── default.vue               # Layout halaman publik (dark)
│   └── admin.vue                 # Layout admin panel (dark)
│
├── middleware/
│   ├── auth.ts                   # Guard: redirect jika belum login
│   └── guest.ts                  # Guard: redirect jika sudah login
│
├── pages/
│   ├── index.vue                 # Halaman utama portfolio
│   ├── projects/
│   │   ├── index.vue             # Daftar semua proyek
│   │   └── [slug].vue            # Detail proyek
│   │
│   └── admin/
│       ├── login.vue             # Halaman login admin
│       ├── index.vue             # Dashboard admin
│       ├── profile.vue           # Edit profil & lanyard card
│       ├── projects/
│       │   ├── index.vue
│       │   ├── create.vue
│       │   └── [id].vue
│       ├── experience/
│       │   ├── index.vue
│       │   ├── create.vue
│       │   └── [id].vue
│       ├── skills/
│       │   ├── index.vue
│       │   ├── create.vue
│       │   └── [id].vue
│       └── testimonials/
│           ├── index.vue
│           ├── create.vue
│           └── [id].vue
│
├── plugins/
│   ├── gsap.ts                   # Inisialisasi GSAP + plugin (SSR-safe)
│   └── firebase.ts               # Inisialisasi Firebase (Universal)
│
├── server/
│   └── api/
│       └── og-image.ts           # Generate OG image dinamis
│
├── stores/
│   ├── auth.ts                   # State auth global
│   ├── profile.ts                # State data profil
│   └── ui.ts                     # State UI (sidebar open/close)
│
└── types/
    ├── models.ts                 # Type semua model data (Project, Profile, dll)
    ├── lanyard.ts                # Type fisika & scene lanyard
    └── index.ts                  # Re-export semua type
```

---

## 4. Setup & Instalasi

### 4.1 Prasyarat

- Node.js >= 20.x
- pnpm >= 9.x (direkomendasikan)
- Akun [Firebase](https://firebase.google.com) (gratis, plan Spark)
- Firebase CLI: `npm install -g firebase-tools`

### 4.2 Clone & Install

```bash
# Buat proyek Nuxt baru
npx nuxi@latest init portfolio
cd portfolio

# Firebase
pnpm add firebase

# State management
pnpm add pinia @pinia/nuxt

# Animasi & 3D
pnpm add gsap
pnpm add three @types/three

# Form & validasi
pnpm add vee-validate zod @vee-validate/zod

# Kompresi gambar (untuk base64 pipeline)
pnpm add browser-image-compression

# UI
pnpm add vue-sonner lucide-vue-next

# Rich text editor
pnpm add @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image

# SEO
pnpm add @nuxtjs/seo

# Dev dependencies
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add -D @nuxt/image
```

### 4.3 Firebase CLI Login & Init

```bash
# Login ke Firebase
firebase login

# Inisialisasi project (pilih: Firestore, Hosting)
firebase init

# Pilih project yang sudah dibuat di Firebase Console
```

### 4.4 Konfigurasi `nuxt.config.ts`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxt/image", "@nuxtjs/seo"],

  css: ["~/assets/css/main.css"],

  vite: {
    optimizeDeps: {
      include: ["firebase/app", "firebase/auth", "firebase/firestore"],
    },
  },

  // Paksa dark mode di level HTML — tidak ada toggle
  app: {
    head: {
      htmlAttrs: { class: "dark" },
      titleTemplate: "%s | Portfolio",
      viewport: "width=device-width, initial-scale=1",
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  routeRules: {
    "/": { prerender: true },
    "/projects/**": { isr: 3600 },
    "/admin/**": { ssr: false }, // Admin = SPA murni (Firebase adalah client SDK)
  },

  runtimeConfig: {
    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      firebaseMessagingSenderId: "",
      firebaseAppId: "",
      siteUrl: "",
      siteName: "",
    },
  },
});
```

---

## 5. Konfigurasi Environment

```bash
# .env.example — salin ke .env dan isi nilainya

# Firebase Config (semua public — aman di client)
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nama-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=nama-project
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NUXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Site
NUXT_PUBLIC_SITE_URL=https://namakamu.dev
NUXT_PUBLIC_SITE_NAME="Nama Kamu"
```

> **Catatan**: Firebase config (API key dsb.) memang dirancang untuk bisa di-expose ke client. Keamanan diatur via **Firestore Security Rules**, bukan lewat menyembunyikan key.

---

## 6. Firebase Setup

### 6.1 Buat Project di Firebase Console

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Klik **Add Project** → beri nama
3. Nonaktifkan Google Analytics (opsional)
4. Pilih plan **Spark (Free)**

### 6.2 Aktifkan Layanan

Di Firebase Console:

- **Authentication** → Sign-in method → Email/Password → **Enable**
- **Firestore Database** → Create database → pilih region terdekat → **Start in production mode**

### 6.3 Buat Admin User

Di **Firebase Console → Authentication → Users → Add user**:

- Email: `admin@namakamu.dev` (atau email pilihan)
- Password: password kuat

Tidak ada halaman registrasi publik. Admin dibuat **hanya** lewat Firebase Console.

### 6.4 Plugin Firebase (`plugins/firebase.ts`)

```typescript
// plugins/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  // Hindari inisialisasi ganda saat hot reload
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  return {
    provide: { firebaseApp: app, auth, db },
  };
});
```

### 6.5 Composable `useFirebase`

```typescript
// composables/useFirebase.ts
export const useFirebase = () => {
  const { $auth, $db } = useNuxtApp();
  return { auth: $auth, db: $db };
};
```

---

## 7. Skema Data Firestore

Firestore menggunakan dokumen NoSQL (JSON). Berikut struktur koleksi yang digunakan.

### 7.1 Koleksi `profile` (dokumen tunggal: `main`)

```
/profile/main
  ├── name: string
  ├── title: string               # "Full Stack Developer"
  ├── bio: string
  ├── email: string
  ├── githubUrl: string
  ├── linkedinUrl: string
  ├── twitterUrl: string
  ├── resumeUrl: string           # URL eksternal (Google Drive, dll)
  ├── avatarBase64: string        # "data:image/webp;base64,..."
  ├── lanyardPhotoBase64: string  # Foto untuk kartu lanyard
  ├── lanyardIdText: string       # "ID-0001"
  ├── lanyardRoleText: string     # "Developer"
  ├── lanyardOrgText: string      # "Freelance"
  └── updatedAt: Timestamp
```

> Jika `avatarBase64` melebihi 700 KB setelah kompresi, pindahkan ke sub-dokumen `/profile/main/images/avatar` (lihat Bab 8).

### 7.2 Koleksi `projects`

```
/projects/{projectId}
  ├── title: string
  ├── slug: string                # URL-friendly, unik
  ├── description: string         # Ringkasan singkat (max 200 karakter)
  ├── content: string             # HTML dari rich text editor
  ├── coverBase64: string | null  # "data:image/webp;base64,..." atau null
  ├── hasSeparateImage: boolean   # true jika cover di sub-dokumen
  ├── coverThumb: string          # Versi thumbnail kecil (< 20 KB) untuk list
  ├── techStack: string[]         # ["Vue 3", "Firebase", "Three.js"]
  ├── projectUrl: string
  ├── repoUrl: string
  ├── isFeatured: boolean
  ├── isPublished: boolean
  ├── orderIndex: number
  ├── createdAt: Timestamp
  └── updatedAt: Timestamp

# Sub-koleksi gambar besar (opsional)
/projects/{projectId}/images/cover
  └── base64: string
```

### 7.3 Koleksi `experience`

```
/experience/{expId}
  ├── company: string
  ├── role: string
  ├── description: string
  ├── startDate: string           # "2022-03" (YYYY-MM)
  ├── endDate: string | null      # null = masih aktif
  ├── isCurrent: boolean
  ├── logoBase64: string          # Logo perusahaan kecil (< 100 KB)
  ├── companyUrl: string
  └── orderIndex: number
```

### 7.4 Koleksi `skills`

```
/skills/{skillId}
  ├── name: string
  ├── category: string            # "Frontend" | "Backend" | "Tools" | "Lainnya"
  ├── iconBase64: string          # SVG/PNG kecil logo skill (< 50 KB)
  ├── level: number               # 0-100
  └── orderIndex: number
```

### 7.5 Koleksi `testimonials`

```
/testimonials/{testimonialId}
  ├── name: string
  ├── role: string
  ├── company: string
  ├── avatarBase64: string        # Foto kecil (< 100 KB)
  ├── content: string
  ├── isPublished: boolean
  ├── orderIndex: number
  └── createdAt: Timestamp
```

### 7.6 Firestore Security Rules (`firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    // Profil: publik baca, admin tulis
    match /profile/{docId} {
      allow read: if true;
      allow write: if isAuthenticated();

      match /images/{imageId} {
        allow read: if true;
        allow write: if isAuthenticated();
      }
    }

    // Proyek: publik baca yang published saja, admin full access
    match /projects/{projectId} {
      allow read: if resource.data.isPublished == true;
      allow read, write: if isAuthenticated();

      match /images/{imageId} {
        allow read: if true;
        allow write: if isAuthenticated();
      }
    }

    // Experience & Skills: publik baca, admin tulis
    match /experience/{expId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /skills/{skillId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    // Testimoni: publik baca yang published, admin full
    match /testimonials/{testimonialId} {
      allow read: if resource.data.isPublished == true;
      allow read, write: if isAuthenticated();
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

---

## 8. Strategi Penyimpanan Gambar (Base64)

Ini adalah bab inti yang membedakan arsitektur ini dari yang menggunakan cloud storage.

### 8.1 Pipeline Gambar

```
User pilih file
      │
      ▼
browser-image-compression
  - Resize ke max 1280px
  - Konversi ke WebP
  - Quality 80%
  - Target < 600 KB
      │
      ▼
FileReader.readAsDataURL()
  → "data:image/webp;base64,/9j/..."
      │
      ├── estimateBase64Size()
      │         │
      │    < 700 KB?
      │    ├── Ya  → simpan di field dokumen utama
      │    └── Tidak → simpan di sub-dokumen /images/cover
      │
      ▼
Firestore (disimpan)
      │
      ▼
<img :src="base64String" />  ← render langsung di browser
```

### 8.2 Batasan & Solusi

| Masalah                               | Solusi                                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| Firestore max 1 MB/dokumen            | Kompres ke WebP < 600 KB; gunakan sub-dokumen jika masih besar                                |
| List query lambat karena base64 besar | Simpan `coverThumb` (< 20 KB) terpisah untuk daftar; `coverBase64` hanya di fetch saat detail |
| Bandwidth lebih besar dari URL CDN    | Kompres agresif WebP quality 70-80%, resize sesuai kebutuhan tampilan                         |
| Foto lanyard harus bagus              | Kompres lebih longgar (quality 85%), max 800px — karena dirender di canvas Three.js           |

### 8.3 Composable `useImageBase64`

```typescript
// composables/useImageBase64.ts
import imageCompression from "browser-image-compression";

export interface ImageOptions {
  maxSizeMB?: number; // default: 0.55
  maxWidthOrHeight?: number; // default: 1280
  quality?: number; // default: 0.8 (dipakai via options)
}

export const useImageBase64 = () => {
  /**
   * Kompres file gambar lalu encode ke base64.
   * Output siap disimpan ke Firestore.
   */
  const fileToBase64 = async (
    file: File,
    options: ImageOptions = {},
  ): Promise<string> => {
    const compressed = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB ?? 0.55,
      maxWidthOrHeight: options.maxWidthOrHeight ?? 1280,
      useWebWorker: true,
      fileType: "image/webp",
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressed);
    });
  };

  /**
   * Buat thumbnail kecil untuk list view (max 200px, < 20 KB)
   */
  const fileToThumb = async (file: File): Promise<string> => {
    return fileToBase64(file, { maxSizeMB: 0.018, maxWidthOrHeight: 200 });
  };

  /**
   * Estimasi ukuran base64 dalam bytes
   */
  const estimateBase64Size = (base64: string): number => {
    const data = base64.split(",")[1] || base64;
    return Math.ceil(data.length * 0.75);
  };

  /**
   * Apakah aman disimpan dalam dokumen yang sama? (< 700 KB)
   */
  const isSafeForSameDoc = (base64: string): boolean => {
    return estimateBase64Size(base64) < 700_000;
  };

  return { fileToBase64, fileToThumb, estimateBase64Size, isSafeForSameDoc };
};
```

### 8.4 Komponen `ImageUpload.vue`

```vue
<!-- components/ui/ImageUpload.vue -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  label?: string;
  maxMB?: number;
  maxPx?: number;
  withThumb?: boolean; // jika true, emit juga thumbnail
}>();

const emit = defineEmits<{
  "update:modelValue": [base64: string];
  thumb: [thumbBase64: string];
  sizeWarning: [bytes: number];
}>();

const { fileToBase64, fileToThumb, estimateBase64Size, isSafeForSameDoc } =
  useImageBase64();
const loading = ref(false);
const error = ref("");

const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  loading.value = true;
  error.value = "";

  try {
    const base64 = await fileToBase64(file, {
      maxSizeMB: props.maxMB ?? 0.55,
      maxWidthOrHeight: props.maxPx ?? 1280,
    });

    if (!isSafeForSameDoc(base64)) {
      emit("sizeWarning", estimateBase64Size(base64));
    }

    emit("update:modelValue", base64);

    if (props.withThumb) {
      const thumb = await fileToThumb(file);
      emit("thumb", thumb);
    }
  } catch (err: any) {
    error.value = "Gagal memproses gambar: " + err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="image-upload">
    <label class="upload-label">
      <span>{{ label ?? "Unggah Gambar" }}</span>
      <input
        type="file"
        accept="image/*"
        class="sr-only"
        @change="handleFileChange"
      />
    </label>

    <p v-if="loading" class="upload-state">Mengompresi & mengenkode...</p>
    <p v-if="error" class="upload-error">{{ error }}</p>

    <div v-if="modelValue && !loading" class="upload-preview">
      <img :src="modelValue" alt="Preview" />
      <button type="button" @click="emit('update:modelValue', '')">
        Hapus
      </button>
    </div>
  </div>
</template>
```

### 8.5 Simpan & Baca Gambar Besar di Sub-Dokumen

```typescript
// utils/imageStorage.ts
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";

/**
 * Simpan proyek beserta gambar cover.
 * Otomatis memisahkan ke sub-dokumen jika > 700 KB.
 */
export async function saveProjectCover(
  db: any,
  projectId: string,
  coverBase64: string,
  coverThumb: string,
) {
  const { isSafeForSameDoc } = useImageBase64();

  if (isSafeForSameDoc(coverBase64)) {
    // Gambar kecil: simpan langsung di dokumen utama
    await setDoc(
      doc(db, "projects", projectId),
      { coverBase64, coverThumb },
      { merge: true },
    );
  } else {
    // Gambar besar: pisahkan ke sub-dokumen
    await setDoc(
      doc(db, "projects", projectId),
      { coverBase64: null, coverThumb, hasSeparateImage: true },
      { merge: true },
    );
    await setDoc(doc(db, `projects/${projectId}/images/cover`), {
      base64: coverBase64,
    });
  }
}

/**
 * Baca proyek lengkap dengan gambar cover (untuk halaman detail).
 */
export async function getProjectWithCover(db: any, projectId: string) {
  const snap = await getDoc(doc(db, "projects", projectId));
  if (!snap.exists()) return null;

  const data = { id: snap.id, ...snap.data() } as any;

  if (data.hasSeparateImage) {
    const imgSnap = await getDoc(doc(db, `projects/${projectId}/images/cover`));
    data.coverBase64 = imgSnap.exists() ? imgSnap.data()?.base64 : null;
  }

  return data;
}
```

---

## 9. Autentikasi Admin

### 9.1 Auth Store (`stores/auth.ts`)

```typescript
import type { User } from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(true); // true sampai Firebase resolve state pertama kali

  const isLoggedIn = computed(() => !!user.value);

  const setUser = (u: User | null) => {
    user.value = u;
  };
  const clearUser = () => {
    user.value = null;
  };
  const setLoading = (v: boolean) => {
    loading.value = v;
  };

  return { user, loading, isLoggedIn, setUser, clearUser, setLoading };
});
```

### 9.2 Composable `useAuth`

```typescript
// composables/useAuth.ts
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const useAuth = () => {
  const { auth } = useFirebase();
  const authStore = useAuthStore();

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    authStore.setUser(cred.user);
    await navigateTo("/admin");
  };

  const logout = async () => {
    await signOut(auth);
    authStore.clearUser();
    await navigateTo("/admin/login");
  };

  /**
   * Dipanggil sekali di app.vue.
   * Memantau perubahan auth state secara realtime.
   */
  const initAuthListener = () => {
    onAuthStateChanged(auth, (user) => {
      authStore.setUser(user);
      authStore.setLoading(false);
    });
  };

  return { login, logout, initAuthListener };
};
```

### 9.3 Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const store = useAuthStore();
  // Tunggu Firebase selesai cek token (hindari flash redirect)
  if (store.loading) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => store.loading,
        (val) => {
          if (!val) {
            stop();
            resolve();
          }
        },
      );
    });
  }
  if (!store.isLoggedIn) return navigateTo("/admin/login");
});

// middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  const store = useAuthStore();
  if (store.loading) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => store.loading,
        (val) => {
          if (!val) {
            stop();
            resolve();
          }
        },
      );
    });
  }
  if (store.isLoggedIn) return navigateTo("/admin");
});
```

### 9.4 Init Listener di `app.vue`

```vue
<!-- app.vue -->
<script setup lang="ts">
const { initAuthListener } = useAuth();
if (process.client) initAuthListener();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

---

## 10. Admin Panel

### 10.1 Layout Admin

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-shell">
    <AdminSidebar />
    <div class="admin-body">
      <AdminHeader />
      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
</script>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100dvh;
  background: var(--color-bg);
  color: var(--color-text);
}
</style>
```

### 10.2 Navigasi Sidebar

```typescript
const navItems = [
  { icon: "LayoutDashboard", label: "Dashboard", to: "/admin" },
  { icon: "User", label: "Profil & Lanyard", to: "/admin/profile" },
  { icon: "FolderOpen", label: "Proyek", to: "/admin/projects" },
  { icon: "Briefcase", label: "Pengalaman", to: "/admin/experience" },
  { icon: "Zap", label: "Skill", to: "/admin/skills" },
  { icon: "MessageSquare", label: "Testimoni", to: "/admin/testimonials" },
];
```

### 10.3 CRUD Pattern — Firestore (Contoh: Projects)

```typescript
// composables/useProjects.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export const useProjects = () => {
  const { db } = useFirebase();
  const col = collection(db, "projects");

  /** List untuk halaman daftar — tanpa coverBase64 penuh */
  const getAll = async (publishedOnly = false) => {
    const constraints = publishedOnly
      ? [where("isPublished", "==", true), orderBy("orderIndex")]
      : [orderBy("orderIndex")];
    const snap = await getDocs(query(col, ...constraints));
    return snap.docs.map((d) => {
      const { coverBase64, ...rest } = d.data();
      // Gunakan coverThumb untuk daftar, bukan gambar penuh
      return { id: d.id, ...rest };
    });
  };

  /** Detail lengkap termasuk gambar penuh */
  const getBySlug = async (slug: string) => {
    const q = query(
      col,
      where("slug", "==", slug),
      where("isPublished", "==", true),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return getProjectWithCover(db, snap.docs[0].id);
  };

  const create = async (
    payload: Partial<Project>,
    coverBase64?: string,
    coverThumb?: string,
  ) => {
    const slug = slugify(payload.title!);
    const docRef = await addDoc(col, {
      ...payload,
      slug,
      coverBase64: null,
      hasSeparateImage: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    if (coverBase64) {
      await saveProjectCover(db, docRef.id, coverBase64, coverThumb ?? "");
    }
    return docRef.id;
  };

  const update = async (
    id: string,
    payload: Partial<Project>,
    coverBase64?: string,
    coverThumb?: string,
  ) => {
    await updateDoc(doc(db, "projects", id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
    if (coverBase64) {
      await saveProjectCover(db, id, coverBase64, coverThumb ?? "");
    }
  };

  const remove = async (id: string) => {
    // Hapus sub-koleksi gambar terlebih dahulu
    const imgSnap = await getDocs(collection(db, `projects/${id}/images`));
    await Promise.all(imgSnap.docs.map((d) => deleteDoc(d.ref)));
    await deleteDoc(doc(db, "projects", id));
  };

  return { getAll, getBySlug, create, update, remove };
};
```

---

## 11. Halaman Publik Portfolio

### 11.1 Struktur Halaman Utama

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <HeroSection />
    <!-- Lanyard 3D + intro -->
    <AboutSection />
    <!-- Bio singkat -->
    <SkillsSection />
    <!-- Grid skill + progress bar -->
    <ProjectsSection />
    <!-- Featured projects -->
    <ExperienceSection />
    <!-- Timeline pengalaman -->
    <TestimonialsSection />
    <!-- Carousel testimoni -->
    <ContactSection />
    <!-- Form kontak -->
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Home",
  description: "Portfolio saya — developer & kreator digital",
});
</script>
```

### 11.2 Page Transition (Dark Feel)

```css
/* assets/css/animations.css */
.page-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
```

---

## 12. Sistem Animasi

### 12.1 Setup GSAP Plugin

```typescript
// plugins/gsap.client.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText);

export default defineNuxtPlugin(() => ({
  provide: { gsap, ScrollTrigger },
}));
```

### 12.2 Composable `useGsap`

```typescript
// composables/useGsap.ts
export const useGsap = () => {
  const { $gsap: gsap, $ScrollTrigger: ST } = useNuxtApp();

  /** Reveal elemen dari bawah dengan blur saat scroll */
  const revealOnScroll = (targets: string | Element | Element[], delay = 0) => {
    return gsap.fromTo(
      targets,
      { opacity: 0, y: 56, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        delay,
        scrollTrigger: {
          trigger: targets as Element,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );
  };

  /** Teks terpecah per karakter, muncul berputar dari bawah */
  const splitTextReveal = (el: Element) => {
    const split = new SplitText(el, { type: "chars, words" });
    return gsap.from(split.chars, {
      opacity: 0,
      y: 30,
      rotationX: -80,
      transformOrigin: "50% 50% -50",
      stagger: 0.022,
      duration: 0.55,
      ease: "back.out(1.4)",
      scrollTrigger: { trigger: el, start: "top 82%" },
    });
  };

  /** Counter angka dari 0 ke nilai target */
  const animateCounter = (el: Element, endValue: number, suffix = "") => {
    const obj = { val: 0 };
    return gsap.to(obj, {
      val: endValue,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + suffix;
      },
      scrollTrigger: { trigger: el, start: "top 80%" },
    });
  };

  /** Parallax lembut background */
  const parallax = (el: Element, speed = 0.25) => {
    return gsap.to(el, {
      yPercent: -25 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  };

  /** Efek magnetic tombol CTA saat hover */
  const magneticHover = (el: HTMLElement, strength = 0.35) => {
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.35,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  };

  /** Garis timeline tumbuh mengikuti scroll */
  const timelineGrow = (lineEl: Element) => {
    return gsap.fromTo(
      lineEl,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: lineEl,
          start: "top 75%",
          end: "bottom 25%",
          scrub: true,
        },
      },
    );
  };

  return {
    revealOnScroll,
    splitTextReveal,
    animateCounter,
    parallax,
    magneticHover,
    timelineGrow,
  };
};
```

### 12.3 Deskripsi Animasi Per Seksi

| Seksi            | Animasi                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**         | Nama: SplitText per-karakter blur+slide. Subtitle: typewriter cursor berkedip. CTA: fade-in + magnetic. Background: gradient orb melayang pelan |
| **About**        | Foto: reveal dari kiri dengan slight skew. Paragraf: stagger per baris                                                                          |
| **Skills**       | Progress bar fill 0→level saat scroll. Card: hover perspective 3D tilt                                                                          |
| **Projects**     | Card stagger dari bawah. Cover: zoom parallax hover. Badge tech: pop-in berurutan                                                               |
| **Experience**   | Garis timeline tumbuh scrub. Node: scale bounce. Card: slide bergantian kiri-kanan                                                              |
| **Testimonials** | Carousel GSAP drag atau scroll snap. Tanda kutip besar: scale animasi                                                                           |
| **Contact**      | Form field reveal stagger. Shake animation validasi gagal. Button: loading → centang sukses                                                     |

---

## 13. 3D Physics Lanyard

### 13.1 Konsep Fisika

Simulasi menggunakan **Verlet Integration** — metode numerik stabil yang umum digunakan di game engine dan simulasi fisika.

```
Rope  = N titik (Point Mass) yang dihubungkan Constraint jarak tetap
Card  = Rigid body di ujung bawah tali
Gaya  = Gravitasi ke bawah + Damping udara + Iterasi constraint
```

**Rumus Verlet Integration:**

```
pos_baru = pos + (pos - pos_lama) × (1 - damping) + gravitasi × dt²
```

**Constraint Solving** — menjaga panjang segmen tali tidak berubah:

```
untuk setiap pasang titik (A, B):
  delta     = B.pos - A.pos
  dist      = |delta|
  koreksi   = (dist - restLength) / dist × 0.5 × stiffness
  A.pos    += delta × koreksi    (jika tidak pinned)
  B.pos    -= delta × koreksi    (jika tidak pinned)
```

### 13.2 Tipe Data (`types/lanyard.ts`)

```typescript
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PointMass {
  pos: Vec3;
  prevPos: Vec3;
  acc: Vec3;
  pinned: boolean; // true = anchor di atas, tidak bergerak
}

export interface Constraint {
  a: number; // index titik A
  b: number; // index titik B
  restLength: number; // panjang istirahat (world units)
  stiffness: number; // 0-1
}

export interface LanyardConfig {
  numSegments: number; // jumlah titik tali (default: 24)
  ropeLength: number; // panjang total tali (default: 4.5)
  gravity: number; // percepatan jatuh (default: 12)
  damping: number; // hambatan udara 0-1 (default: 0.015)
  constraintIterations: number; // iterasi per frame (default: 8)
  cardWidth: number;
  cardHeight: number;
  cardTexturePath: string; // path PNG template kartu
}

export interface LanyardState {
  points: PointMass[];
  constraints: Constraint[];
  isDragging: boolean;
  dragPointIndex: number;
  mouseWorldPos: Vec3;
}
```

### 13.3 Engine Fisika (`components/lanyard/LanyardPhysics.ts`)

```typescript
import type { LanyardConfig, LanyardState } from "~/types/lanyard";

export function createLanyardPhysics(config: LanyardConfig): LanyardState {
  const points = [];
  const constraints = [];

  for (let i = 0; i <= config.numSegments; i++) {
    const t = i / config.numSegments;
    points.push({
      pos: { x: 0, y: -t * config.ropeLength, z: 0 },
      prevPos: { x: 0, y: -t * config.ropeLength, z: 0 },
      acc: { x: 0, y: 0, z: 0 },
      pinned: i === 0,
    });
  }

  const segLen = config.ropeLength / config.numSegments;
  for (let i = 0; i < config.numSegments; i++) {
    constraints.push({ a: i, b: i + 1, restLength: segLen, stiffness: 0.98 });
  }

  return {
    points,
    constraints,
    isDragging: false,
    dragPointIndex: -1,
    mouseWorldPos: { x: 0, y: 0, z: 0 },
  };
}

export function stepPhysics(
  state: LanyardState,
  config: LanyardConfig,
  dt: number,
): void {
  const dtSafe = Math.min(dt, 1 / 30);

  // 1. Verlet integration
  for (const p of state.points) {
    if (p.pinned) continue;
    const vx = (p.pos.x - p.prevPos.x) * (1 - config.damping);
    const vy = (p.pos.y - p.prevPos.y) * (1 - config.damping);
    const vz = (p.pos.z - p.prevPos.z) * (1 - config.damping);
    const nx = p.pos.x + vx + p.acc.x * dtSafe * dtSafe;
    const ny = p.pos.y + vy - config.gravity * dtSafe * dtSafe;
    const nz = p.pos.z + vz + p.acc.z * dtSafe * dtSafe;
    p.prevPos = { ...p.pos };
    p.pos = { x: nx, y: ny, z: nz };
    p.acc = { x: 0, y: 0, z: 0 };
  }

  // 2. Paksa titik drag ke posisi mouse dengan lerp
  if (state.isDragging && state.dragPointIndex >= 0) {
    const dp = state.points[state.dragPointIndex];
    const m = state.mouseWorldPos;
    const s = 0.4; // lerp speed
    dp.pos.x += (m.x - dp.pos.x) * s;
    dp.pos.y += (m.y - dp.pos.y) * s;
    dp.pos.z += (m.z - dp.pos.z) * s;
    dp.prevPos = { ...dp.pos };
  }

  // 3. Selesaikan constraint
  for (let iter = 0; iter < config.constraintIterations; iter++) {
    for (const c of state.constraints) {
      const pa = state.points[c.a];
      const pb = state.points[c.b];
      const dx = pb.pos.x - pa.pos.x;
      const dy = pb.pos.y - pa.pos.y;
      const dz = pb.pos.z - pa.pos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
      const diff = ((dist - c.restLength) / dist) * 0.5 * c.stiffness;
      if (!pa.pinned) {
        pa.pos.x += dx * diff;
        pa.pos.y += dy * diff;
        pa.pos.z += dz * diff;
      }
      if (!pb.pinned) {
        pb.pos.x -= dx * diff;
        pb.pos.y -= dy * diff;
        pb.pos.z -= dz * diff;
      }
    }
  }
}
```

### 13.4 Renderer Three.js (`components/lanyard/LanyardRenderer.ts`)

```typescript
import * as THREE from "three";
import type { LanyardConfig, LanyardState } from "~/types/lanyard";

export function createLanyardScene(
  canvas: HTMLCanvasElement,
  config: LanyardConfig,
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, -1.5, 9);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Pencahayaan dramatis cocok dark theme
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(3, 6, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  // Rim light biru electric — kesan tech/dark
  const rimLight = new THREE.DirectionalLight(0x3366ff, 0.7);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  // Tali
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0f,
    roughness: 0.7,
    metalness: 0.15,
  });
  const ropeMesh = new THREE.Mesh(new THREE.TubeGeometry(), ropeMat);
  ropeMesh.castShadow = true;
  scene.add(ropeMesh);

  // Klip logam silver
  scene.add(
    Object.assign(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12),
        new THREE.MeshStandardMaterial({
          color: 0xbbbbbb,
          metalness: 0.95,
          roughness: 0.05,
        }),
      ),
      { position: new THREE.Vector3(0, 0.09, 0) },
    ),
  );

  // ID Card
  const loader = new THREE.TextureLoader();
  const cardTexture = loader.load(config.cardTexturePath);
  const cardGeom = new THREE.BoxGeometry(
    config.cardWidth,
    config.cardHeight,
    0.022,
  );
  const cardMat = [
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ color: 0x111122 }),
    new THREE.MeshStandardMaterial({ map: cardTexture }), // muka depan
    new THREE.MeshStandardMaterial({ color: 0x0a0a18 }), // belakang
  ];
  const cardMesh = new THREE.Mesh(cardGeom, cardMat);
  cardMesh.castShadow = true;
  scene.add(cardMesh);

  // Foto di atas muka kartu
  const photoMat = new THREE.MeshBasicMaterial({ transparent: true });
  const photoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.55),
    photoMat,
  );
  scene.add(photoPlane);

  /** Load foto dari base64 Firestore */
  const setPhotoBase64 = (base64: string) => {
    const img = new Image();
    img.onload = () => {
      photoMat.map = new THREE.CanvasTexture(img as any);
      photoMat.needsUpdate = true;
    };
    img.src = base64;
  };

  const updateFromState = (state: LanyardState) => {
    const pts = state.points;
    const curve = new THREE.CatmullRomCurve3(
      pts.map((p) => new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z)),
    );
    ropeMesh.geometry.dispose();
    ropeMesh.geometry = new THREE.TubeGeometry(curve, 48, 0.028, 8, false);

    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];

    cardMesh.position.set(
      last.pos.x,
      last.pos.y - config.cardHeight / 2,
      last.pos.z,
    );
    cardMesh.quaternion.slerp(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(
          last.pos.x - prev.pos.x,
          last.pos.y - prev.pos.y,
          last.pos.z - prev.pos.z,
        ).normalize(),
      ),
      0.25,
    );

    photoPlane.position.copy(cardMesh.position);
    photoPlane.position.z += 0.016;
    photoPlane.position.y += 0.2;
    photoPlane.quaternion.copy(cardMesh.quaternion);
  };

  const handleResize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  const render = () => renderer.render(scene, camera);
  const dispose = () => {
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
  };

  return { render, updateFromState, setPhotoBase64, camera, dispose };
}
```

### 13.5 Drag Interaction (`components/lanyard/LanyardInteraction.ts`)

```typescript
import * as THREE from "three";
import type { LanyardState } from "~/types/lanyard";

export function setupDragInteraction(
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  state: LanyardState,
) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  const toWorld = (clientX: number, clientY: number): THREE.Vector3 | null => {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.ray.intersectPlane(plane, hit) ? hit.clone() : null;
  };

  const nearestDraggable = (world: THREE.Vector3): number => {
    const start = Math.floor(state.points.length * 0.6); // 40% titik terbawah
    let bestIdx = -1,
      bestDist = Infinity;
    for (let i = start; i < state.points.length; i++) {
      const p = state.points[i];
      const d = world.distanceTo(new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z));
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestDist < 1.5 ? bestIdx : -1;
  };

  const onDown = (e: MouseEvent | TouchEvent) => {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const world = toWorld(clientX, clientY);
    if (!world) return;
    const idx = nearestDraggable(world);
    if (idx >= 0) {
      state.isDragging = true;
      state.dragPointIndex = idx;
      canvas.style.cursor = "grabbing";
    }
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    if (state.isDragging) {
      const world = toWorld(clientX, clientY);
      if (world) state.mouseWorldPos = { x: world.x, y: world.y, z: world.z };
    } else {
      const world = toWorld(clientX, clientY);
      canvas.style.cursor =
        world && nearestDraggable(world) >= 0 ? "grab" : "default";
    }
  };

  const onUp = () => {
    state.isDragging = false;
    state.dragPointIndex = -1;
    canvas.style.cursor = "default";
  };

  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseup", onUp);
  canvas.addEventListener("touchstart", onDown, { passive: true });
  canvas.addEventListener("touchmove", onMove, { passive: true });
  canvas.addEventListener("touchend", onUp);

  return () => {
    canvas.removeEventListener("mousedown", onDown);
    canvas.removeEventListener("mousemove", onMove);
    canvas.removeEventListener("mouseup", onUp);
    canvas.removeEventListener("touchstart", onDown);
    canvas.removeEventListener("touchmove", onMove);
    canvas.removeEventListener("touchend", onUp);
  };
}
```

### 13.6 Komponen Vue (`components/lanyard/LanyardCanvas.vue`)

```vue
<script setup lang="ts">
import { createLanyardPhysics, stepPhysics } from "./LanyardPhysics";
import { createLanyardScene } from "./LanyardRenderer";
import { setupDragInteraction } from "./LanyardInteraction";
import type { LanyardConfig } from "~/types/lanyard";

const props = defineProps<{
  photoBase64?: string; // field lanyardPhotoBase64 dari Firestore
  name?: string;
  role?: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let rafId: number,
  lastTs = 0;

const config: LanyardConfig = {
  numSegments: 24,
  ropeLength: 4.5,
  gravity: 12,
  damping: 0.015,
  constraintIterations: 8,
  cardWidth: 1.4,
  cardHeight: 2.0,
  cardTexturePath: "/images/lanyard/card-template.png",
};

onMounted(() => {
  if (!canvasRef.value) return;

  const physics = createLanyardPhysics(config);
  const { render, updateFromState, setPhotoBase64, camera, dispose } =
    createLanyardScene(canvasRef.value, config);
  const cleanDrag = setupDragInteraction(canvasRef.value, camera, physics);

  // Tampilkan foto dari Firestore base64
  if (props.photoBase64) setPhotoBase64(props.photoBase64);

  const loop = (ts: number) => {
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    stepPhysics(physics, config, dt);
    updateFromState(physics);
    render();
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  onUnmounted(() => {
    cancelAnimationFrame(rafId);
    cleanDrag();
    dispose();
  });
});

// Jika foto diupdate dari admin, muat ulang tekstur
watch(
  () => props.photoBase64,
  (val) => {
    // renderer.setPhotoBase64(val) — expose jika perlu hot-reload foto
  },
);
</script>

<template>
  <div class="lanyard-wrap">
    <canvas ref="canvasRef" class="lanyard-canvas" />
    <span class="lanyard-hint">Seret kartu ↕</span>
  </div>
</template>

<style scoped>
.lanyard-wrap {
  position: relative;
  width: 100%;
  max-width: 380px;
  aspect-ratio: 9 / 16;
  margin: 0 auto;
}
.lanyard-canvas {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.lanyard-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.28);
  pointer-events: none;
  animation: float 2.4s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}
</style>
```

### 13.7 Tekstur Kartu Lanyard

Buat template di **Figma atau Canva**, export sebagai PNG ke `/public/images/lanyard/card-template.png`.

- **Resolusi**: 560 × 800 px (rasio 7:10)
- **Elemen**: Nama, role, ID number, logo/org, barcode dekoratif, lingkaran placeholder foto di bagian atas
- **Warna**: Dark — background gelap (#0e1420 atau serupa) dengan elemen teks terang dan aksen biru/electric
- **Format**: PNG (transparan di area foto untuk photoPlane Three.js)

Foto wajah diambil dari field `lanyardPhotoBase64` di Firestore dan dikirim ke komponen sebagai prop `photoBase64`.

---

## 14. Design System (Dark Theme)

### 14.1 Palet Warna

Seluruh antarmuka menggunakan dark background. Tidak ada mode terang sama sekali.

```css
/* assets/css/main.css */
:root {
  /* ── Background layers ── */
  --color-bg: #07090f; /* Latar paling dalam */
  --color-surface: #0e1420; /* Card, sidebar */
  --color-surface-raised: #141e30; /* Card elevated */
  --color-surface-overlay: #1c2840; /* Modal, dropdown */

  /* ── Border ── */
  --color-border: rgba(255, 255, 255, 0.06);
  --color-border-strong: rgba(255, 255, 255, 0.12);

  /* ── Teks ── */
  --color-text: #dde4f0; /* Primary */
  --color-text-muted: #7a8ba8; /* Secondary */
  --color-text-subtle: #3d4f68; /* Disabled, placeholder */

  /* ── Aksen ── */
  --color-accent: #4f8ef7; /* Biru electric — CTA utama */
  --color-accent-glow: rgba(79, 142, 247, 0.22);
  --color-accent-warm: #f0b429; /* Amber — badge, highlight */
  --color-accent-teal: #2dd4bf; /* Teal — sekunder */

  /* ── Semantic ── */
  --color-success: #34d399;
  --color-error: #f87171;
  --color-warning: #fbbf24;

  /* ── Motion ── */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --dur-fast: 120ms;
  --dur-base: 280ms;
  --dur-slow: 550ms;
}

/* ── Base reset dark ── */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--color-bg);
  color-scheme: dark;
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 14.2 Tipografi

```css
/* Pair: Syne (heading bold/geometric) + DM Sans (body clean) */
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap");

:root {
  --font-heading: "Syne", sans-serif;
  --font-body: "DM Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

h1 {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 8vw, 7.5rem);
  line-height: 0.92;
  letter-spacing: -0.03em;
  font-weight: 800;
}
h2 {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: -0.02em;
  font-weight: 700;
}
h3 {
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  font-weight: 700;
}
body {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.72;
}
code,
pre {
  font-family: var(--font-mono);
}
```

### 14.3 Efek Visual Dark

```css
/* Glow accent untuk tombol & elemen penting */
.glow {
  box-shadow:
    0 0 20px var(--color-accent-glow),
    0 0 40px rgba(79, 142, 247, 0.08);
}

/* Glass morphism — card transparan di atas latar gelap */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid var(--color-border);
}

/* Gradient teks hero */
.text-gradient {
  background: linear-gradient(
    125deg,
    var(--color-text) 0%,
    var(--color-accent) 45%,
    var(--color-accent-warm) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Garis dekoratif dengan gradient */
.line-accent {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-accent) 50%,
    transparent
  );
  opacity: 0.4;
}

/* Dot grid background subtle */
.dot-grid {
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.06) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
}
```

### 14.4 Token Komponen

```typescript
export const tokens = {
  radius: {
    sm: "6px",
    base: "12px",
    lg: "18px",
    xl: "24px",
    full: "9999px",
  },
  shadow: {
    card: "0 4px 24px rgba(0, 0, 0, 0.5)",
    modal: "0 12px 56px rgba(0, 0, 0, 0.7)",
    glow: "0 0 32px rgba(79, 142, 247, 0.18)",
  },
};
```

---

## 15. Deployment

### 15.1 Vercel (Direkomendasikan untuk Nuxt)

```bash
pnpm add -D vercel
vercel --prod
```

Set di **Vercel Dashboard → Settings → Environment Variables**:

```
NUXT_PUBLIC_FIREBASE_API_KEY
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NUXT_PUBLIC_FIREBASE_PROJECT_ID
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NUXT_PUBLIC_FIREBASE_APP_ID
NUXT_PUBLIC_SITE_URL
NUXT_PUBLIC_SITE_NAME
```

```json
// vercel.json
{
  "framework": "nuxtjs",
  "buildCommand": "pnpm build",
  "outputDirectory": ".output/public"
}
```

### 15.2 Firebase Hosting (Satu Platform)

Jika ingin deploy di satu platform yang sama dengan Firestore:

```bash
pnpm build
firebase deploy --only hosting
```

```json
// firebase.json
{
  "hosting": {
    "public": ".output/public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### 15.3 Docker (Self-host)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output .output
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", ".output/server/index.mjs"]
```

---

## 16. Referensi Firebase

### Operasi Firestore yang Digunakan

| Operasi             | Fungsi                      | Keterangan                   |
| ------------------- | --------------------------- | ---------------------------- |
| Baca satu dokumen   | `getDoc(doc(db, col, id))`  | Profile, project by ID       |
| Baca banyak dokumen | `getDocs(query(...))`       | List dengan filter           |
| Filter              | `where('field', '==', val)` | Published, by slug           |
| Sorting             | `orderBy('field')`          | Urutan tampil                |
| Tambah (auto ID)    | `addDoc(collection, data)`  | Create dokumen baru          |
| Update parsial      | `updateDoc(ref, data)`      | Ubah field tertentu          |
| Hapus               | `deleteDoc(ref)`            | Dokumen & sub-koleksi manual |
| Timestamp server    | `serverTimestamp()`         | createdAt, updatedAt         |

### Batas Firestore (Spark — Free Plan)

| Resource       | Limit         |
| -------------- | ------------- |
| Reads          | 50.000 / hari |
| Writes         | 20.000 / hari |
| Deletes        | 20.000 / hari |
| Storage total  | 1 GB          |
| Network egress | 10 GB / bulan |

> Untuk portfolio personal dengan gambar base64, pantau penggunaan storage di **Firebase Console → Firestore → Usage**. Satu gambar WebP 800px ≈ 100–300 KB base64 string.

### Estimasi Penggunaan Storage

| Konten              | Jumlah | Estimasi Base64                |
| ------------------- | ------ | ------------------------------ |
| Avatar profil       | 1      | ~150 KB                        |
| Foto lanyard        | 1      | ~200 KB                        |
| Cover proyek        | 5–10   | ~300 KB × 10 = 3 MB            |
| Logo experience     | 5      | ~30 KB × 5 = 150 KB            |
| Avatar testimoni    | 5      | ~50 KB × 5 = 250 KB            |
| Skill icons         | 20     | ~10 KB × 20 = 200 KB           |
| **Total perkiraan** |        | **~4 MB** (jauh di bawah 1 GB) |

---

## Checklist Implementasi

### Phase 1 — Foundation

- [ ] Inisialisasi Nuxt 3 + konfigurasi dasar
- [ ] Setup Firebase: buat project, aktifkan Auth + Firestore
- [ ] Buat admin user di Firebase Console
- [ ] Deploy Firestore security rules
- [ ] Plugin Firebase client-side
- [ ] Setup Tailwind v4 + dark design tokens (CSS custom properties)
- [ ] Layout default & admin (dark)
- [ ] Auth store + middleware auth & guest

### Phase 2 — Admin Panel

- [ ] Halaman login admin (dark UI)
- [ ] Dashboard (statistik jumlah dokumen)
- [ ] CRUD Profil + `useImageBase64` + kompresi foto & lanyard
- [ ] CRUD Proyek + rich text editor + cover image (thumb + full)
- [ ] CRUD Pengalaman Kerja + logo perusahaan
- [ ] CRUD Skill + icon
- [ ] CRUD Testimoni + avatar
- [ ] Preview lanyard card di halaman admin profil

### Phase 3 — Halaman Publik

- [ ] Hero section (placeholder lanyard)
- [ ] About section
- [ ] Skills section + progress bar
- [ ] Projects section + halaman detail
- [ ] Experience timeline
- [ ] Testimonials carousel
- [ ] Contact section

### Phase 4 — Animasi

- [ ] Plugin GSAP client-side
- [ ] Composable `useGsap`
- [ ] Animasi tiap seksi (reveal, split text, counter, parallax, timeline grow)
- [ ] Magnetic hover CTA
- [ ] Page transition dark
- [ ] Dot grid / orb background Hero

### Phase 5 — 3D Lanyard

- [ ] Engine fisika Verlet
- [ ] Three.js scene + pencahayaan dramatis (dark)
- [ ] TubeGeometry dinamis tali
- [ ] ID card mesh + tekstur PNG
- [ ] PhotoPlane + load base64 dari Firestore
- [ ] Drag interaction mouse + touch
- [ ] Integrasikan ke Hero section

### Phase 6 — Polish & Deploy

- [ ] SEO meta + OG image per halaman
- [ ] Lighthouse audit ≥ 90
- [ ] Uji ukuran gambar base64 (pantau batas 1 MB/dokumen)
- [ ] Mobile responsiveness
- [ ] Deploy ke Vercel atau Firebase Hosting
- [ ] Custom domain
- [ ] Monitor Firestore usage dashboard

---

> **Catatan**: Firebase Storage sebenarnya masih tersedia di plan Spark, namun sejak 2024 membutuhkan billing account aktif meski tidak dikenai biaya. Arsitektur base64 ini dipilih untuk menghindari keharusan memasukkan data kartu kredit sama sekali.

_Dokumentasi ini mencakup seluruh arsitektur dari setup awal hingga deployment, dengan Firebase sebagai satu-satunya backend dan base64 sebagai strategi penyimpanan gambar yang sepenuhnya bebas storage eksternal._
