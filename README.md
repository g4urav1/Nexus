# Nexus — Social Media Platform

Nexus is a full-stack social media application designed to bring people together through posts, social interactions, messaging, notifications, and real-time communication.

Built with React, Node.js, Express, and MongoDB, Nexus combines a responsive frontend with a backend API to deliver an interactive social networking experience.

## Features

- **Authentication** — User registration, login, logout, and password recovery.
- **User Profiles** — View profiles, update personal information, and manage profile pictures.
- **Social Networking** — Discover users, follow other users, and explore connections.
- **Posts & Feed** — Create and view posts, like content, and interact through comments.
- **Comments & Likes** — Engage with posts and other users.
- **Real-Time Messaging** — Communicate through conversations with real-time updates.
- **Notifications** — Stay informed about social activity.
- **Voice Calling Support** — Call-related functionality with call notifications and real-time status updates.
- **Media Uploads** — Store and manage media using Cloudinary.
- **Password Recovery** — Recover account access through email-based verification.
- **Responsive Interface** — A modern interface designed for desktop and mobile screens.
- **Theme Support** — Consistent application styling with a customizable theme.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

### Authentication & Services
- JSON Web Tokens (JWT)
- bcrypt
- Cookie-based authentication
- Cloudinary
- Nodemailer
- Multer

## Project Architecture

Nexus follows a client-server architecture.

```text
Nexus/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*The directory names above illustrate the general architecture. Adjust them to match the actual repository structure.*

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- A Cloudinary account
- Email credentials for password recovery

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Install the frontend and backend dependencies in their respective directories.

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

Create the required `.env` file in the backend directory.

Configure your MongoDB connection, authentication secret, Cloudinary credentials, and email service credentials using the variable names expected by the backend.

Keep all credentials private and never commit your `.env` file.

### 4. Run the Backend

From the backend directory:

```bash
node server.js
```

### 5. Run the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL provided by Vite in your browser.

## Real-Time Features

Nexus uses Socket.IO to support real-time communication between connected users. The backend manages socket connections and application events, while the frontend responds to incoming updates.

This architecture supports features such as messaging, notifications, and call-related events.

## Security

- Password hashing with bcrypt.
- Authentication middleware for protected routes.
- Cookie-based session authentication.
- Environment-based configuration for sensitive credentials.
- CORS configuration for frontend-backend communication.

Production deployments should use HTTPS, secure cookie settings, strict CORS policies, input validation, and appropriately protected environment variables.

## Future Improvements

Potential enhancements include:

- Group conversations and calling.
- Improved media sharing.
- Advanced feed discovery.
- Enhanced notification preferences.
- Additional accessibility improvements.

## License

No license has been specified. Add a license file if you intend to permit public use, modification, or redistribution.

---

**Nexus** — Connect, share, and communicate.
