# LMS Instructor Portal

This folder is the instructor-side dashboard for the Learning Management System. It is built for teachers and course creators to manage course content, publish lessons, and build assessments for learners.

## What this app does

The Instructor Portal allows users to:

- view a dashboard overview of course activity
- create and edit courses
- manage lesson content
- add quizzes and course assessments
- publish or manage course status
- search and organize course data
- switch between dark and light display modes

## Main features

- Course creation and editing workflow
- Quiz builder with course-linked questions
- Dashboard analytics for course performance
- Responsive instructor workspace layout
- Local data persistence using browser storage
- Course deletion and modification tools

## Folder structure

```bash
lms- Instructor/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CourseCard.jsx
│   │   ├── LessonPlayer.jsx
│   │   ├── Login.jsx
│   │   ├── Modal.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── Topbar.jsx
│   ├── data/
│   │   └── initialCourses.js
│   ├── features/
│   │   ├── CourseEditor.jsx
│   │   ├── LessonEditor.jsx
│   │   └── QuizBuilder.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── MyCourses.jsx
│   │   ├── PublishedCourses.jsx
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

This app uses React + Vite and stores instructor course content in browser storage so it behaves like a lightweight local LMS dashboard.

- `src/App.jsx` manages the overall instructor app state
- It keeps a list of courses and handles creating, editing, and deleting them
- It opens modals for the course editor and quiz builder
- `src/utils/storage.js` saves and loads course data using localStorage
- The sidebar and top bar help navigate between dashboard, courses, and quiz management pages

## Typical workflow

1. Instructor logs in or opens the workspace
2. Creates a new course or edits an existing one
3. Adds lessons, course details, and assessment materials
4. Creates quizzes tied to the course
5. Saves the content locally
6. Learners can then access published course content through the student portal

## Run this project

From this folder:

```bash
npm install
npm run dev
```

Then open the Vite URL in the browser.

## Notes

This is a frontend-first instructor tool for demo and educational use. It can be expanded to include backend APIs, authentication, real course publishing, and database storage.
