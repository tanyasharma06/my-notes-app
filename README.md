# Notes App

This is a personal note-taking application I built to learn full-stack development. It has user authentication, real-time updates, and works both online and offline.

## What I Built

I created a desktop app using Electron that lets users create, edit, and delete notes. The app has a login system and syncs notes in real-time across devices.

## Tech Stack

- **Frontend**: React with Electron for the desktop app
- **Backend**: Node.js with Express and MongoDB
- **Real-time**: Socket.io for live updates
- **Auth**: JWT tokens for security
- **Offline**: Local storage with LocalForage

## Features

- Sign up and login
- Add new notes with title and body
- Edit existing notes
- Delete notes with confirmation
- Real-time sync when multiple users are online
- Works offline with local caching
- Clean, simple UI

## How to Run

1. Make sure you have Node.js and MongoDB installed
2. Clone this repo
3. Install backend: `cd backend && npm install`
4. Install frontend: `cd ../frontend/client && npm install`
5. Create a `.env` file in backend with your MongoDB URL and JWT secret
6. Start backend: `npm run dev` in backend folder
7. Start frontend: `npm run dev` in frontend/client folder

The app will open as a desktop window.

## API

- POST /api/auth/login - login
- POST /api/auth/signup - register
- GET /api/notes - get notes
- POST /api/notes - create note
- PUT /api/notes/:id - update note
- DELETE /api/notes/:id - delete note

## Project Structure

```
note-app/
├── backend/          # Express server
├── frontend/client/  # React + Electron app
└── README.md
```

## What I Learned

- Building full-stack apps with MERN stack
- Implementing JWT authentication
- Using WebSockets for real-time features
- Creating Electron desktop apps
- Handling offline functionality
- Writing clean, maintainable code

This was a great project to practice modern web development skills!
