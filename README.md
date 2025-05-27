# Student Feedback Management System

A full-stack web application for managing student feedback using Express.js and React.js.

## Features

- Students can submit feedback for subjects with ratings and comments
- Admin interface to view all feedback
- Filter feedback by subject
- Average rating calculation per subject
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AbdurRafaybahria/openEnded.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start MongoDB server

2. Start the backend server:
```bash
cd backend
npm start
```

3. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
openEnded/
├── backend/           # Express.js backend
│   ├── server.js      # Main server file
│   └── package.json
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.js
│   │   │   ├── FeedbackList.js
│   │   │   └── AdminView.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```

## API Endpoints

- POST `/api/feedback` - Submit new feedback
- GET `/api/feedbacks` - Get all feedbacks
- GET `/api/feedbacks/:subject` - Get feedback by subject

## Technologies Used

- Backend: Express.js, MongoDB, Mongoose
- Frontend: React.js, Axios
- Styling: CSS3
