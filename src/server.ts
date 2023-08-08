require('dotenv').config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import router from './router';

import ControllerCron from './app/ControllerCron';

const app = express();

app.use(express.json());

/*
necessary to configure which sites can access the api
app.use(cors); 
*/

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});



app.use(router);
app.use('/files', express.static(path.resolve(__dirname, '..', 'download')));

app.use(router);

ControllerCron.fileDelete();

app.listen(8888, () => console.log(`server is run port 8888`));