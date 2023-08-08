import { Router, Request, Response } from 'express';
import multer from 'multer';

import RemoverBGController from './app/RemoverBGController';

const router = Router();
import multerConfig from './config/multer';

const upload = multer(multerConfig);

router.post('/', upload.single('file'), RemoverBGController.store); 

router.post('/teste', (request, response) => {
    return response.status(200).json({ msn: 'Deu certo caralho!' })
}); 

export default router;