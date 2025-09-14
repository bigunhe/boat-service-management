import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { registerUser, loginUser, updateProfile, updatePassword, getUserProfile, getAllUsers, deleteUser} from '../controllers/userController.js';

const router = express.Router();


// GET requests


router.get('/profile', authMiddleware, getUserProfile);

router.get('/all', authMiddleware, getAllUsers);



// POST requests


router.post('/auth/register', registerUser);

router.post('/auth/login',  loginUser);


// use middleware for protected routes (update profile and update password)


router.post('/profile/update', authMiddleware, updateProfile);

router.post('/profile/update-password', authMiddleware, updatePassword);


// DELETE requests


router.delete('/delete/:id', authMiddleware, deleteUser);









export default router;