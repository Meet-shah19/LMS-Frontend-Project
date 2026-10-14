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
- keep course progress in the browser using localStorage

## Main features

- Role-based student experience
- Course catalog and searchable learning portal
- Lesson completion tracking
- Quiz evaluation with instant feedback
- Notes and bookmarks saved locally
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
│   ├── utils/
│   │   └── storage.js
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

The app is powered by React + Vite and keeps most data in browser storage instead of a backend database.

- `src/App.jsx` is the main controller for the portal
- It contains the sidebar navigation and page switching logic
- It manages states like:
  - `courses`
  - `progress`
  - `notes`
  - `bookmarks`
  - `quizResults`
  - `studentName` and `studentEmail`
- `src/utils/storage.js` reads and writes saved data from `localStorage`
- Each page is a section of the learning portal and renders based on the active page state

## Example flow

1. Student opens the portal
2. Courses are loaded from local storage
3. User clicks a course from the dashboard or explore page
4. Course details and lessons are shown
5. Student marks lessons complete
6. Progress is saved automatically in the browser
7. Quiz answers are checked and results are displayed

## Run this project

From this folder:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Notes

This portal is designed as a frontend-only learning experience. It is ideal for demo purposes and UI workflow testing, and it can later be connected to a real backend API and database.
