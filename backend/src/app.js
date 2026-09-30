import express from 'express';
import cors from 'cors';
import urlRoutes from './routes/url.routes.js';

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json({
    limit: '16kb'
}))

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}));

app.use(express.static('public'));

app.use('/url', urlRoutes);

export { app }