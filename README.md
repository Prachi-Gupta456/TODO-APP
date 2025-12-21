📝 To-Do List App (MERN Stack)

A full-stack To-Do List application built using React, Node.js, Express, MongoDB, and JWT authentication with HTTP-only cookies.
Users can sign up, log in, add, update, delete, and manage tasks securely.

🚀 Features

-🔐 Authentication

- User Sign Up & Login

-Password hashing using bcrypt

-JWT authentication stored in HTTP-only cookies

-Secure logout

✅ Task Management

-Add new tasks
-Update existing tasks
-Delete tasks
-Mark tasks as completed
-Task list fetched only for authenticated users

🎵 UI Enhancements

Sound effects for:

-Adding tasks
-Completing tasks
-Deleting tasks

-Clean and simple UI with React

🛠️ Tech Stack
-Frontend

-React

-React Router

-Fetch API

-CSS

-Backend

-Node.js

-Express.js

-MongoDB

-JWT (jsonwebtoken)

-bcrypt

-cookie-parser

-cors

-dotenv

🔒 Authentication Flow

-User logs in or signs up

-Server creates a JWT token

-Token is stored in HTTP-only cookies

-Protected routes verify token using middleware

-Unauthorized users are blocked

🔐 Protected Routes

The following routes require authentication:

/task-list

/add-tasks

/remove-tasks/:id

/update-tasks/:id

🧠 Security Measures

Passwords hashed using bcrypt

JWT stored in HTTP-only cookies

CORS configured with credentials

Protected routes using middleware

middleware

🌱 Future Improvements

User-specific tasks

Dark mode

👨‍💻 Author

Prachi Gupta
MERN Stack Developer
Learning full-stack development 🚀
