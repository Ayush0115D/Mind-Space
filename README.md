# 🧠 Mind-Space

<div align="center">

![Mind-Space Banner](https://img.shields.io/badge/Mind-Space-4A90E2?style=for-the-badge&logo=brain&logoColor=white)

**Your Personal Mental Wellness Companion**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Tech Stack](#tech-stack) • [Contributing](#contributing)

</div>

---

## 📖 About The Project

**Mind-Space** is a comprehensive mental health and wellness platform designed to provide users with a safe, supportive digital environment for managing their mental well-being. Built with modern web technologies, Mind-Space offers an intuitive interface for tracking mood, accessing resources, and connecting with mental health support systems.

### ✨ Why Mind-Space?

In today's fast-paced world, mental health often takes a backseat. Mind-Space aims to:
- 🎯 Make mental wellness accessible and approachable
- 🔒 Provide a secure, judgment-free space for self-reflection
- 📊 Help users understand their mental health patterns
- 🤝 Connect individuals with appropriate resources and support
- 💡 Promote mindfulness and emotional awareness

---

## 🚀 Key Features

Mind-Space offers a comprehensive suite of tools designed to support your mental wellness journey through five interconnected sections, each crafted to provide personalized, meaningful support.

### 1. 🏠 **Dasboard & Landing Page**
A welcoming section introduces users to Mind-Space with a calming, modern design featuring smooth animations and gradient backgrounds. The landing page clearly communicates the platform's mission with compelling visuals and easy navigation to all features. Quick access buttons guide users to start their mental wellness journey.

### 2. 📊 **Mood Tracking & Analytics**
An interactive mood tracker allows users to log their daily emotions through an intuitive interface with emoji-based selection or detailed emotion categorization. The analytics dashboard displays mood trends over time using beautiful charts and graphs, helping users identify patterns. Users can add notes to each entry, view weekly/monthly summaries, and gain insights into their emotional well-being journey.

### 3. 📚 **Resource Library**
A comprehensive collection of mental health resources including articles, guides, and educational content organized by categories like anxiety, depression, stress management, and mindfulness. The section features curated content with search and filter functionality, making it easy to find relevant information. Each resource includes helpful tags, estimated reading time, and user ratings to help users find the most valuable content for their needs.

### 4. 🎯 **Goals & Habits**
A powerful goal-setting and habit-tracking system that helps users build positive routines and achieve their mental wellness objectives. Users can create personalized goals, set daily or weekly habits, and track their consistency with visual progress indicators. The section includes streak tracking, milestone celebrations, and motivational reminders to keep users engaged and committed to their self-improvement journey.

### 5. ✨ **Personalized Recommendations**
An intelligent recommendation engine that analyzes your mental health and  suggests relevant methods to overcome and self-care activities based on your current emotional state and past interactions. As you engage with the platform, recommendations become increasingly personalized to match your unique mental health journey.

---

## 🛠️ Tech Stack

### Frontend
```
⚛️  React 18.x          - UI Library
⚡  Vite 5.x            - Build Tool & Dev Server
🎨  Tailwind CSS        - Styling Framework
📊  Chart.js            - Data Visualization
🔄  React Router        - Client-side Routing
📱  Responsive Design   - Mobile-first Approach
```

### Backend
```
🟢  Node.js 18.x        - Runtime Environment
🚂  Express.js 4.x      - Web Framework
🍃  MongoDB             - Database
🔐  JWT                 - Authentication
🔒  Bcrypt              - Password Hashing
```

### Tools
```
📦  npm                 - Package Manager
🐙  Git                 - Version Control
🐱  GitHub              - Code Hosting & Collaboration
```

---

## 📥 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Clone the Repository
```bash
git clone https://github.com/Ayush0115D/Mind-Space.git
cd Mind-Space
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup
```bash
# Navigate to backend directory (if separate)
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5000

# Start backend server
npm start

# Development mode with auto-reload
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend
MONGODB_URI=mongodb://localhost:27017/mindspace
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development

# Optional
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🎯 Usage

1. **Sign Up / Login**: Create an account or log in to access personalized features
2. **Complete Profile**: Set up your profile with preferences and goals
3. **Track Your Mood**: Log daily emotions and thoughts
4. **Explore Resources**: Browse articles, videos, and self-help tools
5. **Connect**: Join community discussions (optional)
6. **Review Progress**: Check your dashboard for insights and achievements

---

## 📂 Project Structure

```
Mind-Space/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable React components
│   │   ├── common/      # Shared components
│   │   ├── layout/      # Layout components
│   │   └── sections/    # Section-specific components
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── MoodTracker.jsx
│   │   ├── Resources.jsx
│   │   ├── Community.jsx
│   │   └── Dashboard.jsx
│   ├── context/         # React Context API
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Entry point
├── backend/             # Backend server (if applicable)
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   └── server.js        # Server entry point
├── .env.example         # Example environment variables
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Screenshots

<div align="center">

### 🏠 Home & Wellness Hub
![Home Page](./screenshots/Screenshot%202025-10-08%20233122.png)

### 📊 Mood Tracking & Analytics
![Mood Tracking](./screenshots/Screenshot%202025-10-08%20233200.png)

### 📚 Resource Library
![Resource Library](./screenshots/Screenshot%202025-10-08%20233232.png)

### 🎯 Goals & Habits
![Goals & Habits](./screenshots/Screenshot%202025-10-08%20233304.png)

### ✨ Personalized Recommendations
![Recommendations](./screenshots/Screenshot%202025-10-08%20233317.png)

</div>

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🛡️ Security & Privacy

Mind-Space takes user privacy seriously:
- 🔒 End-to-end encryption for sensitive data
- 🚫 No selling of user data
- 👤 Anonymous usage options available
- 🔐 Secure authentication with JWT
- 📜 GDPR compliant data handling

---

## 📝 Developer

**Ayush**

- GitHub: [@Ayush0115D](https://github.com/Ayush0115D)
- Project Link: [Mind-Space](https://github.com/Ayush0115D/Mind-Space)

---


## 📞 Support & Resources

### Crisis Support
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: [https://www.iasp.info/resources/Crisis_Centres/](https://www.iasp.info/resources/Crisis_Centres/)

### Mental Health Organizations
- NAMI (National Alliance on Mental Illness)
- Mental Health America
- Anxiety and Depression Association of America

---

<div align="center">

**If you found this project helpful, please consider giving it a ⭐️**

Made with ❤️ for mental wellness

</div>
