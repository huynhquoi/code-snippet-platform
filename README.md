# 🚀 Code Snippet Platform

A modern community-driven web app for sharing, exploring, and analyzing code snippets — built with **Next.js 15**, **TypeScript**, and **Firebase**.

Live Demo 👉 [code-snippet-platform-one.vercel.app](https://code-snippet-platform-one.vercel.app)

---

## 🌟 Features

### 🧑‍💻 Core
- ✨ **Share code snippets** with title, language, topic, and tags.
- 🔍 **Search & filter** snippets by keyword, language, or tag.
- 👁️‍🗨️ **View count tracking** for popularity insights.
- 🧾 **Public / private mode** toggle for snippet visibility.

### ⚙️ Advanced
- 🧠 **Time Complexity Analyzer**  
  Detects code complexity (`O(1)`, `O(n)`, `O(n²)`, etc.) using static analysis logic — with confidence score and explanation.

- 💬 **Structured SEO metadata**  
  Each snippet has full metadata + JSON-LD (`SoftwareSourceCode`) for Google rich results.

- 🌐 **Auto-generated Sitemap & Robots.txt**  
  Built via Next.js App Router metadata routes — perfect for SEO.

### 💅 UI/UX
- 🎨 Clean, modern interface built with **Tailwind CSS** + **shadcn/ui**.
- 🧩 Fully **responsive** — optimized for mobile, tablet, and desktop.
- 🕶️ Smooth transitions, accessible components, and consistent design system.

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 15 (App Router)](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| Database & Auth | [Firebase Firestore](https://firebase.google.com/docs/firestore), [Firebase Auth](https://firebase.google.com/docs/auth) |
| Hosting | [Vercel](https://vercel.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Code Highlight | [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) |

---

## 🧩 Folder Structure

```

src/
├─ app/
│ ├─ (auth)/ → Auth routes (login, register, etc.)
│ ├─ (main)/ → Main app layout
│ │ └─ profile/
│ │ └─ [username]/ → User profile pages
│ │ ├─ layout.tsx
│ │ └─ page.tsx
│ ├─ snippets/ → Snippet-related routes
│ │ ├─ [slug]/ → Snippet detail + edit
│ │ │ ├─ edit/
│ │ │ │ ├─ layout.tsx
│ │ │ │ └─ page.tsx
│ │ │ └─ page.tsx
│ │ └─ new/
│ │ └─ page.tsx
│ ├─ tags/ → Tag listing pages
│ │ └─ page.tsx
│ ├─ layout.tsx → Root layout (providers, metadata, i18n)
│ ├─ page.tsx → Home page
│ ├─ sitemap.ts → Dynamic sitemap generator
│ └─ robots.ts → SEO robots config
│
├─ components/
│ ├─ features/
│ │ ├─ auth/ → Auth components
│ │ ├─ profile/ → User profile components
│ │ │ ├─ ProfileHeader.tsx
│ │ │ └─ ProfileStats.tsx
│ │ ├─ snippet/ → Snippet core components
│ │ │ ├─ ComplexityAnalyzerDialog.tsx
│ │ │ ├─ SnippetCard.tsx
│ │ │ ├─ SnippetFilters.tsx
│ │ │ ├─ SnippetForm.tsx
│ │ │ ├─ SnippetList.tsx
│ │ │ └─ TagInput.tsx
│ │ └─ tag/ → Tag cloud UI
│ ├─ layout/ → Shared layout wrappers (if any)
│ └─ ui/ → shadcn/ui base components
│
├─ lib/
│ ├─ firebase/ → Firebase setup & CRUD services
│ └─ complexity-analyzer.ts → Static time complexity detection logic
│
├─ contexts/
│ └─ AuthContext.tsx → Firebase authentication context
│
├─ styles/
│ └─ globals.css → Tailwind base styles
│
├─ public/
│ └─ favicon.ico
│
└─ types/
└─ index.d.ts → Shared TypeScript interfaces

````

---

## ⚡ Getting Started

### 1️⃣ Clone & install
```bash
git clone https://github.com/<your-username>/code-snippet-platform.git
cd code-snippet-platform
npm install
````

### 2️⃣ Setup Firebase

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3️⃣ Run locally

```bash
npm run dev
```

Then visit 👉 `http://localhost:3000`

---

## 🔎 SEO Overview

* Dynamic **metadata generation** via Next.js 15 App Router.
* Auto **sitemap.xml** and **robots.txt**.
* Structured **SoftwareSourceCode JSON-LD** for snippets.
* OpenGraph support for rich previews when sharing links.

---

## 🧠 Time Complexity Analyzer

Core logic lives in:

```ts
/lib/complexity-analyzer.ts
```

It detects:

* Loops (`for`, `while`, `map`, etc.)
* Recursive calls
* Nesting depth
* Common patterns (`binary search`, `sort`, `memoization`)
* Returns `complexity`, `confidence`, `explanation`, and `details`.

---

## 📦 Deployment

* 1-click deploy with **Vercel**.
* Auto build and route generation via App Router.
* Recommended domain:
  [https://code-snippet-platform-one.vercel.app](https://code-snippet-platform-one.vercel.app)

---

## 💡 Future Improvements (Optional)

* 🧩 User profile schema (`Person` JSON-LD).
* 💬 Comment system for snippets.
* 🌈 Theme switcher (light/dark).
* 🧪 Basic Jest unit tests for analyzer logic.
* ⚙️ Real-time updates with Firestore `onSnapshot`.

---

## 👨‍💻 Author

**ReiH**
Frontend Developer → Aspiring Full Stack Engineer

> “Clean code, clear logic, intuitive UI.”

---

## 📜 License

MIT License — feel free to use and improve.

