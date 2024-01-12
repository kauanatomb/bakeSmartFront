import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', userController.createUser);
router.put('/:id', userController.updateUser);
router.get('/:id', userController.getOneUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);

export default router
