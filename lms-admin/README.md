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
- Shared API persistence for users and courses
- Server persistence for users, courses, and categories
- Browser persistence for the theme preference and authentication token

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

This admin area is a React + Vite frontend. Users, courses, categories, and the admin profile are read from and written to the authenticated LMS API. Only the theme preference and JWT are kept in browser storage.

- `src/App.jsx` is the core application state manager
- It loads shared users and courses from `/api`
- It stores only the theme preference and JWT in browser storage
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

Start MongoDB and the shared API in a separate terminal:

```sh
cd server
npm install
# Create .env from .env.example and configure JWT_SECRET
npm run seed
npm run dev
```

Then, from this folder, start the admin portal:

```bash
npm install
npm run dev
```

Then open the local Vite URL in the terminal.

## Notes

See [server/README.md](../server/README.md) for database setup, API examples, and development account credentials.
