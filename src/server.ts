require('dotenv').config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import router from './router';

import ControllerCron from './app/ControllerCron';

const app = express();

app.use(express.json());

app.use(cors); 

app.use(router);
app.use('/files', express.static(path.resolve(__dirname, '..', 'download')));

app.use(router);

ControllerCron.fileDelete();

app.listen(8888, () => console.log(`server is run port 8888`));