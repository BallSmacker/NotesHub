# 📚 NotesHub

NotesHub is a full-stack notes sharing platform built for college students.

It allows an admin to upload and manage PDF notes while students can preview or download them directly from the website.

---

## ✨ Features

### Student
- View all subjects
- View Module 1 & Module 2 notes
- Preview PDFs in the browser
- Download PDFs

### Admin
- Add, edit and delete subjects
- Upload PDF notes
- Replace existing PDFs
- Delete PDFs

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Multer
- JWT Authentication (Coming Soon)

### Storage
- Local Uploads (Current)
- Cloudflare R2 (Planned)

### Frontend (Planned)
- React
- React Router
- Axios

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
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Go to the server folder

```bash
cd server
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000
DB_USER=your_username
DB_HOST=localhost
DB_NAME=noteshub
DB_PASSWORD=your_password
DB_PORT=5432
```

Start the server

```bash
npm run dev
```

---

## 📡 API Endpoints

### Subjects

| Method | Endpoint |
|---------|----------|
| GET | /subjects |
| GET | /subjects/:id |
| POST | /subjects |
| PUT | /subjects/:id |
| DELETE | /subjects/:id |

### PDFs

| Method | Endpoint |
|---------|----------|
| GET | /pdfs |
| GET | /pdfs/subject/:subjectId |
| POST | /pdfs |
| PUT | /pdfs/:id |
| DELETE | /pdfs/:id |

---

## 📌 Current Status

- ✅ Subjects CRUD
- ✅ PDF Upload
- ✅ PDF Preview
- ✅ PDF Delete
- ✅ PDF Replace
- ✅ PostgreSQL Integration
- ⏳ JWT Authentication
- ⏳ Cloudflare R2 Integration
- ⏳ React Frontend
- ⏳ Deployment

---

## 👨‍💻 Team

Backend: **Somil Patel**

Frontend: **Somil Patel**

---

## 📄 License

This project is for educational purposes.
