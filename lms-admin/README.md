# LMS Admin Dashboard

This folder is the admin control panel for the Learning Management System. It is designed for platform administrators to manage users, courses, categories, settings, and overall LMS data.

## What this app does

The admin dashboard allows an administrator to:

- manage registered users and their roles
- add, delete, and monitor courses
- group content into categories
- review overview analytics
- edit admin profile information
- switch dark mode on the platform
- manage the learning platform as a central control panel

## Main features

- User management dashboard
- Course approval and listing management
- Category creation and organization
- Analytics and overview panels
- Theme toggle for light/dark mode
- Local browser persistence for all admin data

## Folder structure

```bash
lms-admin/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── AdminLogin.jsx
│   │   ├── Analytics.jsx
│   │   ├── Categories.jsx
│   │   ├── Courses.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   └── Users.jsx
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

This admin area is a React + Vite frontend that stores its state in `localStorage` so administrators can manage records without a backend.

- `src/App.jsx` is the core application state manager
- It stores admin settings, users, courses, categories, and theme preferences
- It uses `useEffect` to save the data after every update
- Each page handles a different management function such as users, courses, analytics, and profiles
- The sidebar helps navigate between the different admin modules

## Typical admin workflow

1. Administrator opens the dashboard
2. Views total users, courses, and content categories
3. Adds new users or manages existing account status
4. Creates or removes courses
5. Organizes content under categories
6. Reviews analytics and profile details

## Run this project

From this folder:

```bash
npm install
npm run dev
```

Then open the local Vite URL in the terminal.

## Notes

This is a frontend-only admin dashboard designed for demos and educational use. It can later be connected to a real backend, authentication layer, and database for production deployment.
