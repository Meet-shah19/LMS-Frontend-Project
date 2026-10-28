# LMS Client Portal

This folder is the student-facing part of the Learning Management System (LMS). It is built for learners to browse courses, track their progress, complete quizzes, save notes, and manage their study profile.

## What this app does

The Client Portal helps students:

- view the dashboard with course stats and progress
- explore available courses
- open courses and lessons
- mark lessons as complete
- bookmark courses
- take quizzes and check results
- save notes and personal profile details
- load shared published courses from the LMS API
- save progress, notes, quiz attempts, and certificates to the authenticated LMS API

## Main features

- Role-based student experience
- Course catalog and searchable learning portal
- Lesson completion tracking
- Quiz evaluation with instant feedback
- Server-persisted notes, enrollments, and progress
- Bookmarks kept in app memory for the current session
- Responsive sidebar and mobile menu
- Student profile management

## Folder structure

```bash
LMS-Client-Portal/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CourseCard.jsx
│   │   ├── Sidebar.jsx
│   │   └── StatCard.jsx
│   ├── pages/
│   │   ├── Certificates.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ExploreCourses.jsx
│   │   ├── MyLearning.jsx
│   │   ├── MyNotes.jsx
│   │   ├── Profile.jsx
│   │   └── QuizCenter.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── ...
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## How it works

The app is powered by React + Vite. Published courses and student account data are loaded from the authenticated LMS API. A student sign-in is required; only the JWT is stored in browser storage.

- `src/App.jsx` is the main controller for the portal
- It contains the sidebar navigation and page switching logic
- It loads approved or published courses from `/api/courses`
- It loads enrollments and saved notes, progress, and certificates from `/api`
- It keeps bookmarks and quiz-answer drafts in page state
- Each page is a section of the learning portal and renders based on the active page state

## Example flow

1. Student opens the portal
2. Published courses are loaded from the shared LMS API
3. User clicks a course from the dashboard or explore page
4. Course details and lessons are shown
5. Student marks lessons complete
6. Progress and notes are saved to the server
7. Quiz attempts are scored and saved by the server

## Run this project

Start MongoDB and the shared API in a separate terminal:

```sh
cd server
npm install
# Create .env from .env.example and configure JWT_SECRET
npm run seed
npm run dev
```

Then, from this folder, start the client portal:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Notes

See [server/README.md](../server/README.md) for setup details and development account credentials.
