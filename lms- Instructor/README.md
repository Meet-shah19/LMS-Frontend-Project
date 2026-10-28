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
- Shared API persistence for courses and quizzes
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

This app uses React + Vite and reads and writes course content through the authenticated shared LMS API.

- `src/App.jsx` manages the overall instructor app state
- It keeps a list of courses and handles creating, editing, and deleting them
- It opens modals for the course editor and quiz builder
- `/api/courses` shares course details, lessons, and quizzes with the admin and student portals
- The sidebar and top bar help navigate between dashboard, courses, and quiz management pages

## Typical workflow

1. Instructor signs in with an LMS account
2. Creates a new course or edits an existing one
3. Adds lessons, course details, and assessment materials
4. Creates quizzes tied to the course
5. Saves the content to the shared LMS API
6. Learners can then access published course content through the student portal

## Run this project

Start MongoDB and the shared API in a separate terminal:

```sh
cd server
npm install
# Create .env from .env.example and configure JWT_SECRET
npm run seed
npm run dev
```

Then, from this folder, start the instructor portal:

```bash
npm install
npm run dev
```

Then open the Vite URL in the browser.

## Notes

See [server/README.md](../server/README.md) for setup details and development account credentials.
