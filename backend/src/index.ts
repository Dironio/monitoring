import { config } from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rootRouter from './routers/root.router'

config({ path: '../.env' });

const PORT = process.env.PORT || 4242;
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true, origin: true
    //  origin: `${process.env.API_FRONT}`
}))

app.use('/api', rootRouter);




function start() {
    try {
        console.log(`${process.env.API_FRONT}`)
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT} port`)
        })
    } catch (e: any) {
        console.log('Error start: ', e.message);
        process.exit(1);
    }
}

start();