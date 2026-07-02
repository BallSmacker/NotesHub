# 📚 NotesHub

A modern full-stack notes sharing platform built for college students.

NotesHub allows students to browse subjects, preview notes directly in the browser, and download study material. Administrators can securely manage subjects and PDFs through a dedicated dashboard.

---

# ✨ Features

## 👨‍🎓 Student

- Browse subjects
- Search subjects
- View Notes and Practical PDFs
- In-browser PDF preview
- Download PDFs
- Responsive mobile-first interface
- No login required

---

## 👨‍💼 Admin

- Secure JWT authentication
- Dashboard with statistics
- Add, edit and delete subjects
- Upload PDFs
- Preview PDFs
- Delete PDFs
- Automatic cloud file management

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React
- React PDF

## Backend

- Node.js
- Express.js
- Multer
- JWT Authentication
- bcryptjs

## Database

- PostgreSQL

## Storage

- Supabase Storage

---

# 📂 Project Structure

```
NotesHub
│
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── assets
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── config
│   ├── controllers
│   ├── database
│   ├── middleware
│   ├── routes
│   ├── package.json
│   └── index.js
│
└── README.md
```

---

# ⚙ Environment Variables

## Server (.env)

```env
PORT=

DATABASE_URL=

JWT_SECRET=

ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=
```

## Client (.env)

```env
VITE_API_URL=
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/NotesHub.git
```

Go into the project

```bash
cd NotesHub
```

## Backend

```bash
cd server
npm install
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

Frontend:

```
[http://localhost:5173](https://noteshubfrontend.vercel.app)
```

Backend:

```
[http://localhost:3000](https://noteshub-backend-icx3.onrender.com)
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|----------|----------------|
| POST | /auth/login |

---

## Subjects

| Method | Endpoint |
|----------|--------------------------|
| GET | /subjects |
| POST | /subjects |
| PUT | /subjects/:id |
| DELETE | /subjects/:id |

---

## PDFs

| Method | Endpoint |
|----------|-----------------------------|
| GET | /pdfs |
| GET | /pdfs/subject/:subjectId |
| POST | /pdfs |
| PUT | /pdfs/:id |
| DELETE | /pdfs/:id |

---

# 🔐 Authentication

Students do not require an account.

Only administrators can:

- Upload PDFs
- Delete PDFs
- Manage subjects

Protected routes use JWT authentication.

---

# 📱 Screenshots

Add screenshots after deployment.

- Home Page
- Semester Page
- Subject Page
- PDF Preview
- Admin Dashboard
- Upload PDF
- Manage Subjects
- Manage PDFs

---

# 🚀 Deployment

Frontend

- Vercel

Backend

- Railway / Render

Database

- PostgreSQL

Storage

- Supabase Storage

---

# 📈 Future Improvements

- Replace PDFs from the dashboard
- Multiple semesters
- Drag-and-drop uploads
- PDF thumbnails
- Usage analytics
- Favorites / bookmarks
- Bulk uploads
- Role-based authentication

---

# 👨‍💻 Developer

**Somil Patel**

Built as a full-stack web application using React, Express, PostgreSQL and Supabase Storage.
