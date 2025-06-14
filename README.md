# Realtime Chat Application

A modern, real-time chat application built with React, Node.js, and Socket.IO, featuring instant messaging, user authentication, and media sharing capabilities.

## 🌟 Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Authentication**: Secure signup and login system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Media Sharing**: Share images and files in conversations
- **Modern UI**: Clean and intuitive user interface built with Tailwind CSS and DaisyUI
- **State Management**: Efficient state management using Zustand
- **Cloud Storage**: Media files stored in Cloudinary

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Socket.IO Client
- Zustand (State Management)
- Tailwind CSS with DaisyUI
- Lucide Icons
- Axios for HTTP requests

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose ODM)
- JWT Authentication
- Bcrypt for password hashing
- Cloudinary for media storage
- CORS enabled

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShadiSbaih/Realtime-Chat-App.git
   cd Realtime-Chat-App
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update the .env file with your configuration
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update the VITE_API_URL in .env to point to your backend
   ```

### Environment Variables

#### Backend (`.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Realtime-Chat-App/
├── backend/               # Backend server
│   ├── controllers/       # Route controllers
│   ├── lib/               # Utility functions
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── src/               # Source files
├── frontend/              # Frontend React app
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── assets/        # Images, fonts, etc.
│       ├── components/    # Reusable components
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Page components
│       ├── store/         # State management
│       └── utils/         # Utility functions
└── README.md              # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✉️ Contact

Shadi Sbaih - [@shadisbaih](https://github.com/ShadiSbaih)

Project Link: [https://github.com/ShadiSbaih/Realtime-Chat-App](https://github.com/ShadiSbaih/Realtime-Chat-App)
