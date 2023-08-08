import { Router, Request, Response, response } from 'express';
import multer from 'multer';

import RemoverBGController from './app/RemoverBGController';

const router = Router();
import multerConfig from './config/multer';

const upload = multer(multerConfig);

router.post('/', upload.single('file'), RemoverBGController.store); 

router.post('/teste', (request, response) => {

    const res = request.body;

    return response.status(200).json(res)
}); 

export default router;