# 📄 PDF Management & Collaboration System

![Banner](https://github.com/mehraankush/Pedofile/blob/main/public/Banner.png)

A Full-stack web application that enables users to manage, share, and collaborate on PDF files. Built using **Next.js**, **MongoDB**, and **Google Drive API**, this system allows secure document storage, robust user management, and real-time commenting on shared PDFs.

---

## 🚀 Features

### ✅ Must-Have Features

#### 1. User Signup and Authentication
- Sign up with name, email, and password.
- Login with secure JWT-based authentication.
- Seamless route protection for authenticated users.
- Password reset and account recovery via email with token expiration.

#### 2. File Upload
- Authenticated users can upload PDF documents.
- PDF file validation ensures only `.pdf` extensions are accepted.
- Documents are uploaded to **Google Drive** and stored securely.

#### 3. Dashboard
- Authenticated users have a personal dashboard to view and manage their files.
- Full-text search to filter PDFs by title.
- Clickable files open an in-app PDF viewer with comments sidebar.

#### 4. File Sharing
- Share PDFs either:
  - Privately (with specific users by email).
  - Publicly (anyone with the link can view and comment).
- Generates unique shareable URLs.
- Email is sent automatically to invitees with the PDF link.

#### 5. Invited User File Access & Commenting
- Invited or public users can access shared files without signing in.
- Real-time comment panel is shown alongside the document.
- Comments are stored and linked to the file permanently.

#### 6. Nested Comments
- Users can reply to existing comments, enabling threaded discussions.
- Each comment supports:
  - Bold / Italic text.
  - Bullet points.
  - Markdown-like formatting.

#### 7. Security & Data Privacy
- User authentication is fully tokenized with role-based access.
- User passwords are salted and hashed using industry best practices.
- PDF access control:
  - Only owner or shared users (or public) can access files/comments.

#### 8. Responsive UI/UX
- Clean, modern interface built with TailwindCSS.
- Works across mobile, tablet, and desktop screens.
- Easy-to-navigate layout with quick access to core features.

![Schema](https://github.com/mehraankush/Pedofile/blob/main/public/schema.png)

---

### 🌟 Good-To-Have Features (Implemented)

- ✅ **Password Reset**: Secure email with time-limited reset token.
- ✅ **Email Notifications**: Automatically send email to invited users on PDF share.
- ✅ **Nested Comments**: Inline replies with markdown-like formatting.
- ✅ **Public View Mode**: Allow access without login for publicly shared PDFs.
- ✅ **Access Control**: Private vs Public sharing controlled by owner.
- ✅ **Comment Moderation**: Max replies limit and rate limit on comment post (for spam prevention).

---

## 🛠️ Tech Stack

| Tech                 | Purpose                                |
|----------------------|----------------------------------------|
| **Next.js**          | Frontend & backend API routes          |
| **MongoDB**          | NoSQL database                         |
| **Mongoose**         | ODM for schema validation              |
| **Google Drive API** | PDF upload and preview storage         |
| **JWT**              | Secure, stateless authentication       |
| **TailwindCSS**      | Responsive and modern UI styling       |
| **Resend**           | Password reset and share notification  |

---

## 📂 Folder Structure

```bash
.
├── app/               # Next.js app directory (App Router)
├── components/        # Reusable UI components
├── lib/               # Utilities for MongoDB, Google Drive, etc.
├── models/            # Mongoose models (User, Document, Comment)
├── pages/api/         # API routes (Auth, Upload, Share, Comments)
├── styles/            # TailwindCSS configs
├── types/             # TypeScript interfaces and types
├── utils/             # Helper logic (send email, token, etc.)
└── public/            # Static files


 Setup Instructions
 git clone https://github.com/your-username/pdf-collab.git
cd pdf-collab

npm install

Create a .env.local file and add the following:

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
JWT_SECRET="mehra_69"
DATABASE_URL="mongodb+srv://ajority&appName=spotdraft"
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID="1Oqje7kqhdwefgueLfkTrPAHlaC-ZrueA"
RESEND_API_KEY="re_LiVGyJTm_Ff8ksqegfwefvw"

npm run dev
