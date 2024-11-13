import express, { Express, NextFunction, Request, Response } from 'express';
import { NotFoundError } from '@application/error';
import cors from 'cors';
import morgan from 'morgan';
import { router } from '@api/Routes';
import { ErrorHandler } from '@api/Middleware';

const app: Express = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req, res) => res.json('Testing the endpoint'));

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError());
});

app.use(ErrorHandler);

export default app;
