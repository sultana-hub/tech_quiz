🧠 Tech Quiz App (MERN Stack)

The Tech Quiz App is an interactive web application built using the MERN Stack (MongoDB, Express, React, Node.js) that allows users to take technology quizzes, get instant results, and track their performance.
It’s designed with a modern, responsive UI and secure backend APIs for smooth and real-time quiz experiences.

🚀 Live Demo

🔗 View Live Project[https://parveen-tech-quiz.vercel.app/]

🔗 Backend [https://tech-quiz-server.onrender.com]

🧩 Features
👩‍💻 For Users

Sign up / Log in using JWT Authentication

Browse quizzes by category (React, Node.js, JavaScript, MongoDB, etc.)

Attempt quizzes with multiple-choice questions

See instant score and correct answers

Timer-based quizzes with real-time progress

View leaderboard and past quiz results

Responsive and mobile-friendly UI

🧑‍🏫 For Admin

Admin dashboard for managing quizzes and users

Add / Edit / Delete questions and categories

View quiz statistics and user scores

🛠️ Tech Stack
Layer	Technologies
Frontend	React.js, React Query, MUI
Backend	Node.js, Express.js
Database	MongoDB with Mongoose
Authentication	JWT (JSON Web Token)
State Management	React Query
API Testing	Postman
Hosting	Vercel (Frontend), Render / Railway (Backend)
📸 Screenshots
Feature	Screenshot
🏠 Homepage	

🧩 Quiz Page	

🧾 Results Page	

🧑‍💼 Admin Dashboard	
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/sultana-hub/tech_quiz
cd tech-quiz-app

2️⃣ Install dependencies
Frontend:
cd client
npm install

Backend:
cd server
npm install

3️⃣ Environment Variables

Create a .env file in your server folder with the following variables:


 MONGODB_URL=Your Url


# test rechapcha secret key
    RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

PORT=2001

JWT_SECRET_KEY=Your key


FRONTEND_HOST=https://parveen-tech-quiz.vercel.app/

//mailConfiguration


# EMail
EMAIL_HOST ='smtp.gmail.com'
EMAIL_PORT =587
EMAIL_USER ='your email'
EMAIL_PASS ='your password'
EMAIL_FROM ='your email'


 frontend .env:
 VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI


4️⃣ Run the app
Run backend:
cd server
npm run dev

Run frontend:
cd client
npm run dev


Visit: http://localhost:5173



🧠 Key Functionalities
Feature	Description
Quiz API	CRUD operations for quizzes and questions
JWT Authentication	Secure login and token verification
Score Tracking	Store quiz scores and show results
Timer Feature	Countdown for each quiz
Leaderboard	Displays top scores of all users
Admin Panel	Create and manage quizzes dynamically
🧑‍💻 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
GET	/api/quizzes	Fetch all quizzes
POST	/api/quizzes	Create new quiz (Admin only)
GET	/api/quizzes/:id	Get quiz by ID
PUT	/api/quizzes/:id	Update quiz
DELETE	/api/quizzes/:id	Delete quiz
🔐 Authentication Flow

Passwords are hashed using bcryptjs

Tokens are generated using jsonwebtoken

Protected routes verified via JWT middleware

🧑‍💻 Author

👩‍💻 Parveen Sultana
Full Stack Developer (MERN | Appwrite | Supabase)
📧 Email: [psultana6@gmail.com
]
🌐 Portfolio: https://sultana-portfolio.vercel.app

💼 LinkedIn: https://www.linkedin.com/in/parveen-sultana-84671b6a/

⭐ Contributing

Contributions are always welcome!
To contribute:

Fork the repository

Create a new branch (git checkout -b feature-name)

Make your changes and commit (git commit -m "Added feature-name")

Push to the branch (git push origin feature-name)

Open a Pull Request 🚀