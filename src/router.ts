import { Router, Request, Response, response } from 'express';
import multer from 'multer';

import RemoverBGController from './app/RemoverBGController';

const router = Router();
import multerConfig from './config/multer';

const upload = multer(multerConfig);

router.post('/', upload.single('file'), RemoverBGController.store); 

export default router;