# Nexus Backend

The backend API for **Nexus**, a social media application built with Node.js, Express, and MongoDB. It provides authentication, user profiles, posts, likes, comments, social interactions, messaging, and real-time communication using Socket.IO.

## Features

- **Authentication** — User signup, login, logout, and cookie-based authentication.
- **User Profiles** — View user profiles, check username availability, update profile information, and upload profile images.
- **Social Connections** — Follow users, search for users, and retrieve follower and following lists.
- **Posts** — Create and retrieve posts, like posts, add comments, and delete comments.
- **Notifications** — Handle social activity notifications.
- **Messaging** — Retrieve conversations, send messages, and refresh conversation data in real time.
- **Calling Support** — Manage call information and call status, with real-time Socket.IO events.
- **Password Recovery** — Request verification codes, verify codes, and change passwords.
- **Media Uploads** — Cloudinary integration for media storage.
- **Email Services** — Nodemailer integration for email-based password recovery.

## Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt, and cookies
- **Real-Time Communication:** Socket.IO
- **Media Storage:** Cloudinary
- **Email:** Nodemailer
- **Middleware:** CORS, cookie-parser, and Multer

## Project Structure

```text
nexus-backend/
├── config/
│   ├── cloudinary.js
│   └── mail.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── Conversation.js
│   ├── Message.js
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── auth.routes.js
│   ├── password.routes.js
│   ├── post.routes.js
│   ├── social.routes.js
│   └── user.routes.js
├── socket/
│   └── socket.js
├── server.js
├── package.json
└── .env
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- A Cloudinary account for media uploads
- Email account credentials for password recovery emails

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd nexus-backend
```

Replace `<your-repository-url>` with your GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and configure the variables used by the application.

```env
MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDNAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

MAIL_USER=your_email_address
MAIL_PASS=your_email_app_password
```

Use the exact environment variable names expected by your implementation. Keep all credentials private and never commit your `.env` file to GitHub.

### 4. Start the Server

```bash
node server.js
```

The backend server runs on:

```text
http://localhost:1111
```

The current CORS configuration allows requests from the frontend at `http://localhost:5173` with credentials enabled. Update this setting when deploying the frontend to another origin.

## API Routes

The following are the main API route groups defined in the project.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/signup` | Register a user |
| POST | `/login` | Log in |
| POST | `/logout` | Log out |
| GET | `/usernameAvailability` | Check username availability |
| GET | `/admin` | Retrieve the authenticated user's information |
| GET | `/user/:Username` | Retrieve a user profile |
| GET | `/searchUsers` | Search for users |
| POST | `/follow` | Follow a user |
| GET | `/notifications` | Retrieve notifications |
| GET | `/` | Retrieve the feed |
| GET | `/post/:id` | Retrieve a post |
| POST | `/likes` | Handle post likes |
| POST | `/addComments` | Add a comment |
| POST | `/deleteComment` | Delete a comment |
| GET | `/getComments/:id` | Retrieve post comments |
| GET | `/conversations` | Retrieve conversations |
| GET | `/messages/:conversationId` | Retrieve conversation messages |
| POST | `/sendMessages/:conversationId` | Send a message |
| POST | `/call/:conversationId` | Initiate or update call information |
| GET | `/call/:conversationId` | Retrieve call information |
| POST | `/getCode` | Request a password recovery code |
| POST | `/verifyCode` | Verify a recovery code |
| POST | `/changePassword` | Change a password |

**Note:** These routes are registered in the source code. Authentication requirements, request bodies, response formats, and exact behavior depend on each route's implementation.

## Real-Time Communication

Nexus uses Socket.IO for real-time application events, including messaging updates, post interactions, notifications, and call-related communication.

The server also associates authenticated sockets with conversation rooms so that relevant events can be sent to connected participants.

## Security

- Password hashing uses bcrypt.
- Authentication middleware protects designated endpoints.
- Cookie-based authentication is supported.
- Environment variables are used for database and third-party service credentials.

For production deployment, use HTTPS, configure secure cookie options, restrict CORS to trusted origins, validate user input, and keep all secrets out of version control.

## Development

The project includes Nodemon as a development dependency. You can start the server with automatic restarts using:

```bash
npx nodemon server.js
```

## License

No specific open-source license has been configured for this project yet. Add a license if you intend to permit others to use, modify, or distribute the code.

---

**Nexus Backend** — Powering the social and real-time features of Nexus.
