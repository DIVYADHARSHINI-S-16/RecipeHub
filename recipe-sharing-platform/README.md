# RecipeHub — Recipe Sharing Platform (MERN Stack)

A full-stack recipe sharing platform built with MongoDB, Express, React (Vite), and Node.js.

## Features
- JWT Authentication (Register / Login)
- Recipe CRUD (Create, Read, Update, Delete)
- Search recipes by title
- Filter recipes by category
- User profile (edit name/bio, change password)
- Cloudinary image upload with drag-and-drop UI
- Fully responsive design (Tailwind CSS)

## Tech Stack
- **Frontend:** React 18 + Vite, React Router v6, Tailwind CSS, Axios, React Hot Toast, React Icons
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Multer, Cloudinary

## Project Structure
```
recipe-sharing-platform/
├── backend/     → Express API (auth, recipes, users, image upload)
└── frontend/    → React + Vite client app
```

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
```

Edit `backend/.env` with your own values:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recipe-sharing-platform
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get Cloudinary credentials free at [cloudinary.com](https://cloudinary.com/console).

Start MongoDB locally (or use MongoDB Atlas and paste the connection string into `MONGO_URI`), then run:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

`frontend/.env` is already set to point at the local backend:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Private | Get logged-in user |
| GET | `/api/recipes` | Public | List recipes (search/category/pagination) |
| GET | `/api/recipes/:id` | Public | Get single recipe |
| POST | `/api/recipes` | Private | Create recipe |
| PUT | `/api/recipes/:id` | Private (owner) | Update recipe |
| DELETE | `/api/recipes/:id` | Private (owner) | Delete recipe |
| GET | `/api/recipes/user/my-recipes` | Private | Get logged-in user's recipes |
| GET | `/api/users/profile` | Private | Get profile + recipe count |
| PUT | `/api/users/profile` | Private | Update name/bio/avatar |
| PUT | `/api/users/change-password` | Private | Change password |
| POST | `/api/upload` | Private | Upload image to Cloudinary |
| DELETE | `/api/upload/:publicId` | Private | Delete image from Cloudinary |

## Notes
- Both `backend` and `frontend` were verified to install cleanly and build/boot without errors.
- `node_modules` are excluded from this package — run `npm install` in each folder first.
- Run backend and frontend in two separate terminals for local development.
