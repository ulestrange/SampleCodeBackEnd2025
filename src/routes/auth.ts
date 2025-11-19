import express, {Router} from 'express';
import {validate} from '../middleware/validate.middleware';
import {createUserSchema, updateUserSchema}  from '../models/user';

import {
  handleLogin

} from '../controllers/auth';

const router: Router = express.Router();

router.post('/',  handleLogin);

router.get('/',  handleLogin);



export default router;