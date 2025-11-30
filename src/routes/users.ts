import express, {Router} from 'express';
import {validate} from '../middleware/validate.middleware';
import {createUserSchema, updateUserSchema}  from '../models/user';
import {isAdmin, validJWTProvided} from '../middleware/auth.middleware'

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users';

const router: Router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', validJWTProvided, isAdmin, deleteUser);

export default router;
