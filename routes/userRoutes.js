import express from 'express';
import {
  deleteUser,
  editUser,
  getAllUsers,
  logIn,
  signUp,
} from '../controllers/userControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
export const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', logIn);
userRouter.get('/allUsers', getAllUsers);
userRouter.delete('/delete', authMiddleware, deleteUser);
userRouter.patch('/edit/:id', authMiddleware, editUser);
