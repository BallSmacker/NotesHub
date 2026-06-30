# 📚 NotesHub

A mobile-first notes sharing platform built for college students.

Students can preview or download subject notes directly from the website, while the admin can manage subjects and upload, replace, or delete PDFs through a secure dashboard.

---

## ✨ Features

### Students
- View all subjects
- View Module 1, Module 2 and Practical PDFs
- Preview PDFs in the browser
- Download PDFs
- Mobile-friendly interface
- No login required

### Admin
- Secure JWT authentication
- Add, edit and delete subjects
- Upload PDFs
- Replace existing PDFs
- Delete PDFs
- Automatic file management

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Multer
- JWT Authentication
- bcryptjs

### Database
- PostgreSQL

### Storage
- Local Uploads (Development)
- Cloudflare R2 (Production)

---

## 📂 Project Structure

```
NotesHub/
│
├── server/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
└── client/ (React - Coming Soon)
```

---

## ⚙ Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=3000

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

ADMIN_USERNAME=

ADMIN_PASSWORD_HASH=

JWT_SECRET=
```

---

## 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Go into the server folder

```bash
cd server
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run dev
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/login |

---

### Subjects

| Method | Endpoint |
|---------|----------|
| GET | /subjects |
| GET | /subjects/:id |
| POST | /subjects |
| PUT | /subjects/:id |
| DELETE | /subjects/:id |

---

### PDFs

| Method | Endpoint |
|---------|----------|
| GET | /pdfs |
| GET | /pdfs/subject/:subjectId |
| POST | /pdfs |
| PUT | /pdfs/:id |
| DELETE | /pdfs/:id |

---

## 🔐 Authentication

Students do not need an account.

Only the administrator can:

- Upload PDFs
- Replace PDFs
- Delete PDFs
- Manage subjects

Protected routes require a JWT token.

---

## 📱 Project Goal

NotesHub is designed to provide a simple and efficient platform where college students can access study materials from any device without needing to download large files unnecessarily.

The project follows a mobile-first approach with a clean dark-themed interface.

---

## 🚧 Future Improvements

- Cloudflare R2 integration
- React frontend
- Admin dashboard
- Search subjects
- Latest updates section
- PDF analytics
- Semester management
- Deploy to production

---

## 👨‍💻 Developers

Backend: Somil Patel

Frontend: Somil Patel
Project Name: NotesHub
